<template>
    <div>
        <Lead title="Subs"/>
    </div>
    <div v-if="reactives.loading">
        LOADING
    </div>
    <div v-else>
        <table class="bg-gray-50">
            <tr>
                <th>Name</th><th><button class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none"
                    v-on:click="filterGender">
                    {{reactives.gender}}</button>
                </th>
                <th>Email <button class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none"
                    v-on:click="copyEmails">
                    Copy</button>
                </th>
                <th>Donations</th>
            </tr>
            <tr v-for="sub in reactives.subs" :key="sub">
                <td>{{sub.Name}}</td><td>{{sub.Gender}}</td><td>{{sub['Email Address']}}</td><td>{{sub.Donations}}</td>
            </tr>
        </table>
    </div>
</template>

<script setup>
    import Lead from '@/components/Lead.vue';
    import { db } from "../firebase";
    import { reactive } from 'vue';
    import { ref, onValue } from "firebase/database";
    import _ from 'lodash';

    const props = defineProps({
        teams: Object,
        players: Object,
        games: Object,
        finishedGames: Object,
        totalScores: Object,
    });

    const reactives = reactive({
        allSubs: Object,
        subs: Object,
        loading: true,
        gender: 'M/F',
    });

    loadSubs();

    async function loadSubs(){
        onValue(ref(db, 'winter-21-22-2/Subs'), (snapshot) => {
            reactives.allSubs = snapshot.val();
            reactives.subs = snapshot.val();
            reactives.loading = false;
        });
    }

    function filterGender(){
        if(reactives.gender == 'M/F'){
            reactives.gender = 'F';
            reactives.subs = _.filter(reactives.allSubs, ['Gender', 'F']);
        } else if(reactives.gender == 'F'){
            reactives.gender = 'M';
            reactives.subs = _.filter(reactives.allSubs, ['Gender', 'M']);
        } else {
            reactives.gender = 'M/F';
            reactives.subs = reactives.allSubs;
        }
    }

    function copyEmails(){
        const emails = _.reduce(reactives.subs, function(r,v,k){
            r = r.concat(`${v['Email Address']}, `);
            return r;
        },'')
        navigator.clipboard.writeText(emails).then(function() {
            console.log('Copying to clipboard was successful!');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

</script>

<style scoped>
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        opacity: 0.95;

        display: block;
        max-width: -moz-fit-content;
        max-width: fit-content;
        margin: 0 auto;
        overflow-x: auto;
        white-space: nowrap;
    }
    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }
    tr:nth-child(even) {
        background-color: #dddddd;
    }
</style>