<script setup>
import { reactive } from 'vue';
import _ from 'lodash';
import jsonQuery from 'json-query';

import Lead from '@/components/Lead.vue'

const props = defineProps({
    teams: Object,
    players: Object,
    games: Object
});

const reactives = reactive({
  loading: true,
  totalScores: {}
});

calculateStats();

function calculateStats(){
  const finishedGames = jsonQuery('[**][*:beforeToday]', {
    data: props.games,
    locals: {
      beforeToday: function (item) {
        return new Date(item.Date) < new Date();
      }
    }
  });

  const reducedFinishedGames = _.reduce(finishedGames.value, function(gamesResult, gamesValue){
    const reducedMatches = _.reduce(gamesValue.Matches, function(matchesResult, matchesValue){
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
      matchesResult[matchesValue.team1] = {'GF': pointsTeam1, 'GA': pointsTeam2, 'GD': pointsTeam1 - pointsTeam2, "W": pointsTeam1 > pointsTeam2 ? 1 : 0, "L": pointsTeam1 < pointsTeam2 ? 1 : 0, "T": pointsTeam1 === pointsTeam2 ? 1 : 0, "Pts": pointsTeam1 === pointsTeam2 ? 1 : (pointsTeam1 > pointsTeam2 ? 3 : 0)};
      matchesResult[matchesValue.team2] = {'GF': pointsTeam2, 'GA': pointsTeam1, 'GD': pointsTeam2 - pointsTeam1, "W": pointsTeam2 > pointsTeam1 ? 1 : 0, "L": pointsTeam2 < pointsTeam1 ? 1 : 0, "T": pointsTeam2 === pointsTeam1 ? 1 : 0, "Pts": pointsTeam2 === pointsTeam1 ? 1 : (pointsTeam2 > pointsTeam1 ? 3 : 0)};
      return matchesResult;
    },{});
    Object.keys(props.teams).forEach(team => {
      (gamesResult[team] || (gamesResult[team] = [])).push(reducedMatches[team]);
    });
    return gamesResult;
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
  
  reactives.loading = false;
}

const placeArray = ['1st','2nd','3rd','4th','5th','6th','7th','8th']

</script>

<template>
  <div>
    <Lead title="Standings"/>
  </div>
  <div v-if="reactives.loading">
    <h2>Loading</h2>
  </div>
  <div v-else class="standings bg-gray-50">
    <table>
      <tr>
        <th>Place</th><th>Team</th><th>W</th><th>L</th><th>T</th><th>Pts</th><th>GF</th><th>GA</th><th>GD</th>
      </tr>
      <tr v-for="(value, key) in reactives.totalScores" :key="key">
        <td>{{placeArray[key]}}</td><td :style="{backgroundColor: props.teams[value.team].color, color: props.teams[value.team].color === 'black' || props.teams[value.team].color === 'blue'? 'white': 'black'}">{{props.teams[value.team].name}}</td><td>{{value.W}}</td><td>{{value.L}}</td><td>{{value.T}}</td><td>{{value.Pts}}</td><td>{{value.GF}}</td><td>{{value.GA}}</td><td>{{value.GD}}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

  .standings{
    text-align: center;
  }
</style>
