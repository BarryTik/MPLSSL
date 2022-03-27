<template>
    <div>
        <Lead title="Winter 21/22"/>
    </div>
    <div v-if="reactives.loading">
        <h2>Loading</h2>
    </div>
    <div v-else>
      <div v-for="day in Object.keys(props.games).sort(function(a, b) {
        return cmp(props.games[a].Date, props.games[b].Date); 
    })" :key="day">
        <h1>{{props.games[day].title}}</h1>
        <table>
          <tr v-for="match in Object.keys(props.games[day].Matches)" :key="match">
            <td :style="{ backgroundColor: props.games[day].Matches[match].team1? props.teams[props.games[day].Matches[match].team1].color : 'white', color: props.games[day].Matches[match].team1? props.teams[props.games[day].Matches[match].team1].color === 'black' || props.teams[props.games[day].Matches[match].team1].color === 'blue'? 'white' : 'black' : 'gray', fontWeight: props.finishedGames[props.games[day].Matches[match].team1]? props.finishedGames[props.games[day].Matches[match].team1][match].W? 900 : 400 : 500}">{{props.games[day].Matches[match].team1? props.teams[props.games[day].Matches[match].team1].name: 'TBD'}}</td>
            <td class="score" :style="{fontWeight: props.finishedGames[props.games[day].Matches[match].team1]? props.finishedGames[props.games[day].Matches[match].team1][match].W? 900 : 400 : 400}">{{props.finishedGames[props.games[day].Matches[match].team1]? props.finishedGames[props.games[day].Matches[match].team1][match].GF: ''}}</td>
            <td class='vs'>vs</td>
            <td :style="{ backgroundColor: props.games[day].Matches[match].team2? props.teams[props.games[day].Matches[match].team2].color : 'white', color: props.games[day].Matches[match].team1? props.teams[props.games[day].Matches[match].team2].color === 'black' || props.teams[props.games[day].Matches[match].team2].color === 'blue'? 'white' : 'black' : 'gray', fontWeight: props.finishedGames[props.games[day].Matches[match].team2]? props.finishedGames[props.games[day].Matches[match].team2][match].W? 900 : 400 : 500}">{{props.games[day].Matches[match].team2? props.teams[props.games[day].Matches[match].team2].name: 'TBD'}}</td>
            <td class="score" :style="{fontWeight: props.finishedGames[props.games[day].Matches[match].team2]? props.finishedGames[props.games[day].Matches[match].team2][match].W? 900 : 400 : 400}">{{props.finishedGames[props.games[day].Matches[match].team2]? props.finishedGames[props.games[day].Matches[match].team2][match].GF: ''}}</td>
            <td class='vs'>{{props.games[day].Matches[match].time}}</td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import _ from 'lodash';
  import jsonQuery from 'json-query';
  import Lead from '@/components/Lead.vue';

  const props = defineProps({
      teams: Object,
      players: Object,
      games: Object,
      finishedGames: Object,
      totalScores: Object,
  });

  const reactives = reactive({
      loading: true,
  });

  const cmp = (a, b) => (a > b) - (a < b);

  calculateStats();

  function calculateStats() {
    const finishedGames = jsonQuery('[**][*:beforeToday]', {
      data: props.games,
      locals: {
          beforeToday: function (item) {
              return new Date(item.Date) < new Date();
          }
      }
    });
    // console.log(finishedGames);
    reactives.loading = false;
  }
</script>

<style>
  h1 {
    font-size: 1.6em;
    font-weight: 600;
    background-color: rgba(256, 256, 256, 0.85);
    margin-top: 10px;
  }
  .score {
    background-color: white;
  }
  .vs {
    font-weight: 600;
    background-color: rgba(256, 256, 256, 0.85);
  }
</style>