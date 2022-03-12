<script setup>
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { reactive, ref as vueRef } from 'vue';

import Lead from '@/components/Lead.vue'


const reactives = reactive({
  loading: true,
  teams: "init",
  games: "init",
})


loadData();

async function loadTeams(){
  onValue(ref(db, 'winter-21-22-2/Teams'), (snapshot) => {
    reactives.teams = snapshot.val();
    // console.log(JSON.parse(JSON.stringify(reactives.teams)));
  });
}

async function loadGames(){
  onValue(ref(db, 'winter-21-22-2/Games'), (snapshot) => {
    reactives.games = snapshot.val();
    console.log(JSON.parse(JSON.stringify(reactives.games)));
  });
}

async function loadData(){
  loadTeams().then(()=> {
      loadGames().then(()=>{
        //calculateStats
        //sortTeams
        reactives.loading = false;
      });
  });

}

function findCaptains(team){
  let captians = [];
  team.forEach(player  => {
    if (player.Captain) {
      captians.push(player.Name);
    }
  });
  return captians
}

function calculateStats(games){
  games.forEach(day => {
    if (day.Matches[0].score1 !== "Home") {
      console.log(day.Date);
    }
  });
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
        <th>Place</th><th>Team</th><th>W</th><th>L</th><th>T</th><th>Pts</th><th>GF</th><th>GA</th><th>GD</th><th>Captains</th><th>Paid</th>
      </tr>
      <tr v-for="(value, key) in JSON.parse(JSON.stringify(reactives.teams))" :key="key">
        <td>place</td><td>{{key}}</td><td>w</td><td>l</td><td>t</td><td>pts</td><td>gf</td><td>ga</td><td>gd</td>
        <td>{{findCaptains(value.Players)}}</td>
        <td>paid</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

  .standings{
    text-align: center;
  }
</style>
