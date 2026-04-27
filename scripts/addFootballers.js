import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import _ from 'lodash';

const serviceAccountPath = process.argv[2];
const csvPath = process.argv[3];

if (!serviceAccountPath || !csvPath) {
    console.error('Usage: node addFootballers.js <path-to-service-account-json> <path-to-footballers-csv>');
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(resolve(serviceAccountPath), 'utf8'));

// Initialize Firebase Admin SDK

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://mpls-sl.firebaseio.com'
});

const db = admin.firestore();

const csvFile = resolve(csvPath);
let csvContent;

try {
    csvContent = readFileSync(csvFile, 'utf8');
} catch (error) {
    console.error('Error reading CSV file:', error.message);
    process.exit(1);
}

const rows = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

if (rows.length < 2) {
    console.error('CSV must include a header row and at least one data row.');
    process.exit(1);
}

const headers = rows[0].split(',').map((header) => header.trim().toLowerCase());
const nameIndex = headers.indexOf('name');
const yearIndex = headers.indexOf('year');
const teamIndex = headers.indexOf('team');
const goalsIndex = headers.indexOf('goals');

if (nameIndex === -1 || yearIndex === -1 || teamIndex === -1 || goalsIndex === -1) {
    console.error('CSV header must include columns: name, year, team, goals');
    process.exit(1);
}

const footballers = rows.slice(1).map((row) => {
    const columns = row.split(',').map((value) => value.trim());
    return {
        name: columns[nameIndex] || '',
        year: columns[yearIndex] || '',
        team: columns[teamIndex] || '',
        goals: columns[goalsIndex] || ''
    };
}).filter((footballer) => footballer.name && footballer.year && footballer.team && footballer.goals);

if (footballers.length === 0) {
    console.error('No valid footballer rows found in the CSV file.');
    process.exit(1);
}

const uniqueFootballers = _.uniqBy(footballers, (f) => f.name.toLowerCase());
console.log(`Found ${uniqueFootballers.length} of ${footballers.length} unique footballers to add.`);

const errors = [];

await Promise.all(
    uniqueFootballers.map(async (footballer) => {
        try {
            console.log(`Prepared to add: ${footballer.name}`);
            const snapshot = await db.collection('footballers').where('name', '==', footballer.name).get();
            if (snapshot.empty) {
                await db.collection('footballers').add({ name: footballer.name });
                console.log(`Added: ${footballer.name}`);
            } else {
                console.log(`Footballer already exists: ${footballer.name}`);
            }
        } catch (error) {
            console.error(`Error processing ${footballer.name}:`, error);
            errors.push({ name: footballer.name, error: error.message });
        }
    })
);
console.log(`Finished processing. Added ${uniqueFootballers.length - errors.length} footballers with ${errors.length} errors.`);

if (errors.length > 0) {
    console.log('Errors encountered:');
    errors.forEach((err) => {
        console.log(`- ${err.name}: ${err.error}`);
    });
}

const uniqueTeams = _.uniqBy(footballers, (f) => `${f.team.toLowerCase()}-${f.year}`).map((f) => ({ team: f.team, year: f.year }));
console.log(`Found ${uniqueTeams.length} unique teams to add.`);

const sessionsSnap = await db.collection('sessions').get();
const sessions = sessionsSnap.docs.map((doc) => {
    const data = doc.data();
    if (data.year == 2013 && data.part == 1) {
        return { year: 2013.1, id: doc.id };
    } else if (data.year == 2013 && data.part == 2) {
        return { year: 2013.2, id: doc.id };
    } else {
        return { year: data.year, id: doc.id };
    }
});

const sessionErrors = [];

await Promise.all(
    uniqueTeams.map(async (team) => {
        try {
            console.log(`Prepared to add team: ${team.team} (${team.year})`);
            const session = sessions.find((s) => s.year == team.year);
            if (!session) {
                console.error(`No session found for year ${team.year} when adding team ${team.team}`);
                return;
            }
            const existingTeam = await db
                .collection('sessions')
                .doc(session.id)
                .collection('teams')
                .where('name', '==', team.team)
                .limit(1)
                .get();

            if (existingTeam.empty) {
                await db.collection('sessions').doc(session.id).collection('teams').add({ name: team.team });
                console.log(`Added team: ${team.team} (${team.year})`);
            } else {
                console.log(`Team already exists in session: ${team.team} (${team.year})`);
            }
        } catch (error) {
            console.error(`Error processing team ${team.team} (${team.year}):`, error);
            sessionErrors.push({ team: team.team, year: team.year, error: error.message });
        }
    })
);
console.log(`Finished processing teams. Added ${uniqueTeams.length - sessionErrors.length} teams with ${sessionErrors.length} errors.`);

if (sessionErrors.length > 0) {
    console.log('Errors encountered while adding teams:');
    sessionErrors.forEach((err) => {
        console.log(`- ${err.team} (${err.year}): ${err.error}`);
    });
}

const goalsErrors = [];

await Promise.all(
    footballers.map(async (footballer) => {
        try {
            console.log(`Processing goals for: ${footballer.name} (${footballer.team}, ${footballer.year})`);

            // Find the footballer's document ID
            const footballerSnap = await db.collection('footballers').where('name', '==', footballer.name).limit(1).get();
            if (footballerSnap.empty) {
                console.error(`Footballer not found: ${footballer.name}`);
                return;
            }

            const footballerId = footballerSnap.docs[0].id;

            // Find the session and team
            const session = sessions.find((s) => s.year == footballer.year);
            if (!session) {
                console.error(`No session found for year ${footballer.year} when adding goals for ${footballer.name}`);
                return;
            }

            const teamSnap = await db
                .collection('sessions')
                .doc(session.id)
                .collection('teams')
                .where('name', '==', footballer.team)
                .limit(1)
                .get();

            if (teamSnap.empty) {
                console.error(`Team not found: ${footballer.team} in session ${session.year}`);
                return;
            }

            const teamId = teamSnap.docs[0].id;

            // Check if this footballer already exists in the team's members
            const existingMember = await db
                .collection('sessions')
                .doc(session.id)
                .collection('teams')
                .doc(teamId)
                .collection('members')
                .where('footballerId', '==', footballerId)
                .limit(1)
                .get();

            if (!existingMember.empty) {
                console.log(`Footballer already exists in team: ${footballer.name} (${footballer.team}, ${footballer.year})`);
                return;
            }

            // Add goals record to the team's members subcollection
            await db
                .collection('sessions')
                .doc(session.id)
                .collection('teams')
                .doc(teamId)
                .collection('members')
                .add({
                    footballerId: footballerId,
                    goals: parseInt(footballer.goals) || 0
                });

            console.log(`Added goals for ${footballer.name}: ${footballer.goals} (${footballer.team}, ${footballer.year})`);
        } catch (error) {
            console.error(`Error processing goals for ${footballer.name}:`, error);
            goalsErrors.push({ name: footballer.name, team: footballer.team, year: footballer.year, error: error.message });
        }
    })
);

console.log(`Finished processing goals. Added ${footballers.length - goalsErrors.length} goal records with ${goalsErrors.length} errors.`);

if (goalsErrors.length > 0) {
    console.log('Errors encountered while adding goals:');
    goalsErrors.forEach((err) => {
        console.log(`- ${err.name} (${err.team}, ${err.year}): ${err.error}`);
    });
}
            