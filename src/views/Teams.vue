<script setup>
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { reactive, ref as vueRef } from 'vue';
import _ from 'lodash';
import jsonQuery from 'json-query';

import Lead from '@/components/Lead.vue'

const props = defineProps({
    teams: Object,
    players: Object,
    games: Object
});

const reactives = reactive({
  loading: false
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
      matchesResult[matchesValue.team1] = {'GF': reducedPoints[matchesValue.team1], 'GA': reducedPoints[matchesValue.team2], 'GD': reducedPoints[matchesValue.team1] - reducedPoints[matchesValue.team2], "W": reducedPoints[matchesValue.team1] > reducedPoints[matchesValue.team2] ? 1 : 0, "L": reducedPoints[matchesValue.team1] < reducedPoints[matchesValue.team2] ? 1 : 0, "T": reducedPoints[matchesValue.team1] === reducedPoints[matchesValue.team2] ? 1 : 0}
      matchesResult[matchesValue.team2] = {'GF': reducedPoints[matchesValue.team2], 'GA': reducedPoints[matchesValue.team1], 'GD': reducedPoints[matchesValue.team2] - reducedPoints[matchesValue.team1], "W": reducedPoints[matchesValue.team2] > reducedPoints[matchesValue.team1] ? 1 : 0, "L": reducedPoints[matchesValue.team2] < reducedPoints[matchesValue.team1] ? 1 : 0, "T": reducedPoints[matchesValue.team2] === reducedPoints[matchesValue.team1] ? 1 : 0}
      return matchesResult;
    },{});
    Object.keys(props.teams).forEach(team => {
      (gamesResult[team] || (gamesResult[team] = [])).push(reducedMatches[team]);
    });
    return gamesResult;
  },{});
  console.log(reducedFinishedGames);
}

</script>

<template>
  <div>
    <Lead title="Teams"/>
  </div>
  <div v-if="reactives.loading">
    <h2>Loading</h2>
  </div>
  <div v-else class="standings bg-gray-50">
    <table>
      <tr>
        <th>Place</th><th>Team</th><th>W</th><th>L</th><th>T</th><th>Pts</th><th>GF</th><th>GA</th><th>GD</th>
      </tr>
      <tr v-for="(value, key) in JSON.parse(JSON.stringify(props.teams))" :key="key">
        <td>place</td><td>{{value.name}}</td><td>w</td><td>l</td><td>t</td><td>pts</td><td>gf</td><td>ga</td><td>gd</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

  .standings{
    text-align: center;
  }
</style>
