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
        <h1>{{day}}</h1>
        <table>
          <tr v-for="match in props.games[day].Matches" :key="match">
            <td :style="{ backgroundColor: match? match.team1 ? props.teams[match.team1].color : 'white' : 'white', color: match? match.team1 ? props.teams[match.team1].color === 'black' || props.teams[match.team1].color === 'blue'? 'white' : 'black' : 'gray' : 'gray'}">{{match? match.team1 ? props.teams[match.team1].name : 'TBD' : 'tbd'}}</td>
            <td class="score">{{match? match.team1 ? 1 : '' : ''}}</td>
            <td class='vs'>vs</td>
            <td :style="{ backgroundColor: match? match.team1 ? props.teams[match.team2].color : 'white' : 'white', color: match? match.team2 ? props.teams[match.team2].color === 'black' || props.teams[match.team2].color === 'blue'? 'white' : 'black' : 'gray' : 'gray'}">{{match? match.team2 ? props.teams[match.team2].name : 'TBD' : 'tbd'}}</td>
            <td class="score">{{match? match.team2 ? 2 : '' : ''}}</td>
            <td class='vs'>{{match? match.time : ''}}</td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import _ from 'lodash';
  import Lead from '@/components/Lead.vue'

  const props = defineProps({
      teams: Object,
      players: Object,
      games: Object
  });

  const reactives = reactive({
      loading: false,
  });

  const cmp = (a, b) => (a > b) - (a < b);

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