<script setup>
  import { db } from "./firebase";
  import { ref, onValue } from "firebase/database";
  import { reactive, ref as vueRef } from 'vue';
  import Nav from '@/components/Nav.vue'
  import _ from 'lodash';
  import jsonQuery from 'json-query';


  const reactives = reactive({
      games: {},
      teams: {},
      players: {},
      totalScores: {},
      finishedGames: {},
  });

  main();
  function main(){
    loadTeams();
    loadPlayers();
    loadGames();
  }


  async function loadGames(){
    onValue(ref(db, 'winter-21-22-2/Games'), (snapshot) => {
        reactives.games = snapshot.val();
        calculateStats(snapshot.val());
    });
  }

  async function loadTeams(){
    onValue(ref(db, 'winter-21-22-2/Teams'), (snapshot) => {
        reactives.teams = snapshot.val();
    });
  }

  async function loadPlayers(){
    onValue(ref(db, 'winter-21-22-2/Players'), (snapshot) => {
        reactives.players = snapshot.val();
    });
  }

  async function calculateStats(inputData){
    const finishedGames = jsonQuery('[**][*:beforeToday]', {
      data: inputData,
      locals: {
        beforeToday: function (item) {
          return new Date(item.Date) < new Date();
        }
      }
    });
    const reducedFinishedGames = _.reduce(finishedGames.value, function(gamesResult, gamesValue, gamesKey){
      const reducedMatches = _.reduce(gamesValue.Matches, function(matchesResult, matchesValue, matchesKey){
        const reducedPoints = _.reduce(matchesValue.points, function(pointsResult, pointsValue, pointsKey){
          const reducedTeamPoints = _.reduce(pointsValue, function(teamPointsResult, teamPointsValue){
            teamPointsResult = teamPointsResult + teamPointsValue;
            return teamPointsResult;
          },0);
          pointsResult[pointsKey] = reducedTeamPoints;
          return pointsResult;
        },{});
        const pointsTeam1 = reducedPoints[matchesValue.team1]? reducedPoints[matchesValue.team1] : 0;
        const pointsTeam2 = reducedPoints[matchesValue.team2]? reducedPoints[matchesValue.team2] : 0;
        matchesResult[matchesValue.team1] = {'match': matchesKey, 'GF': pointsTeam1, 'GA': pointsTeam2, 'GD': pointsTeam1 - pointsTeam2, "W": pointsTeam1 > pointsTeam2 ? 1 : 0, "L": pointsTeam1 < pointsTeam2 ? 1 : 0, "T": pointsTeam1 === pointsTeam2 ? 1 : 0, "Pts": pointsTeam1 === pointsTeam2 ? 1 : (pointsTeam1 > pointsTeam2 ? 3 : 0)};
        matchesResult[matchesValue.team2] = {'match': matchesKey, 'GF': pointsTeam2, 'GA': pointsTeam1, 'GD': pointsTeam2 - pointsTeam1, "W": pointsTeam2 > pointsTeam1 ? 1 : 0, "L": pointsTeam2 < pointsTeam1 ? 1 : 0, "T": pointsTeam2 === pointsTeam1 ? 1 : 0, "Pts": pointsTeam2 === pointsTeam1 ? 1 : (pointsTeam2 > pointsTeam1 ? 3 : 0)};
        return matchesResult;
      },{});
      Object.keys(reactives.teams).forEach(team => {
        (gamesResult[team] || (gamesResult[team] = [])).push(reducedMatches[team]);
      });
      return gamesResult;
    },{});

    reactives.finishedGames = _.reduce(reducedFinishedGames, function(result, value, key){
      const reducedGames = _.reduce(value, function(teamResult, teamValue, teamKey){
        if(teamValue){
          teamResult[teamValue.match] = teamValue;
        };
        return teamResult;
      },{});
      result[key] = reducedGames;
      return result;
    },{});
    const totalScores = _.reduce(reducedFinishedGames, function(totalScoresResult, totalScoresValue, totalScoresKey){
      const totalTeamScores = _.reduce(totalScoresValue, function(totalTeamScoresResult, totalTeamScoresValue){
        if (totalTeamScoresValue){
          totalTeamScoresResult = {
            GF: totalTeamScoresValue.GF + totalTeamScoresResult.GF,
            GA: totalTeamScoresValue.GA + totalTeamScoresResult.GA,
            GD: totalTeamScoresValue.GD + totalTeamScoresResult.GD,
            W: totalTeamScoresValue.W + totalTeamScoresResult.W,
            L: totalTeamScoresValue.L + totalTeamScoresResult.L,
            T: totalTeamScoresValue.T + totalTeamScoresResult.T,
            Pts: totalTeamScoresValue.Pts + totalTeamScoresResult.Pts
          };
        };
        return totalTeamScoresResult;
      },{GF: 0, GA: 0, GD: 0, W: 0, L: 0, T: 0, Pts: 0});
      totalScoresResult[totalScoresKey] = totalTeamScores;
      return totalScoresResult;
    },{});

    const totalScoresArray = _.reduce(totalScores, function(result, value, key){
      value.team = key;
      result.push(value);
      return result;
    },[])

    const cmp = (a, b) => (a < b) - (a > b);

    totalScoresArray.sort(function(a, b) {
      return cmp(a.Pts, b.Pts) || cmp(a.GD, b.GD) || cmp(a.GF, b.GF); 
    })
    
    reactives.totalScores = totalScoresArray;
  }

</script>

<style scoped>
.background{
  background-position: center;
  /* background-repeat: no-repeat; */
  /* background-size: cover; */
  background-attachment: fixed;
}
main{
  padding-top: 64px;
  min-height: 100vh;
  max-width: 100vw;
}

</style>

<template>
  <div class="background" v-bind:style="{ backgroundImage:'url(/mplssl-logo-transparent.png)' }">
    <Nav/>
    <main>
      <router-view
      :games="reactives.games"
      :teams="reactives.teams"
      :players="reactives.players"
      :totalScores="reactives.totalScores"
      :finishedGames="reactives.finishedGames"
      />
    </main>
  </div>
</template>
