<script setup>
  import { useRouter } from 'vue-router';

  import Lead from '@/components/Lead.vue'

  const props = defineProps({
      teams: Object,
      players: Object,
      games: Object,
      finishedGames: Object,
      totalScores: Object,
  });

  const router = useRouter();

  function onclick(team){
    router.push(`/team/${team}`);
  }

  const placeArray = ['1st','2nd','3rd','4th','5th','6th','7th','8th']

</script>

<template>
  <div>
    <Lead title="Standings"/>
  </div>
  <div class="standings">
    <table class="bg-gray-50">
      <tr>
        <th>Place</th><th>Team</th><th>W</th><th>L</th><th>T</th><th>Pts</th><th>GF</th><th>GA</th><th>GD</th>
      </tr>
      <tr v-for="(value, key) in props.totalScores" :key="key">
        <td>{{placeArray[key]}}</td><td v-on:click="onclick(value.team)" :style="{fontWeight: (8 - key)* 100, backgroundColor: props.teams[value.team].color, color: props.teams[value.team].color === 'black' || props.teams[value.team].color === 'blue'? 'white': 'black'}">{{props.teams[value.team].name}}</td><td>{{value.W}}</td><td>{{value.L}}</td><td>{{value.T}}</td><td>{{value.Pts}}</td><td>{{value.GF}}</td><td>{{value.GA}}</td><td>{{value.GD}}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

  .standings{
    text-align: center;
  }
</style>
