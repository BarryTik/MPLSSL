<template>
    <div>
        <Lead title="Teams"/>
    </div>
    <div class="teams-list">
      <div class="team-list-item" v-for="team in Object.keys(props.teams)" :key="team" v-on:click="routeToTeam(team)" :style="{ backgroundColor: props.teams[team].color, color: props.teams[team].color == 'black' ? 'white': 'black' }"><h2>{{props.teams[team].name}}</h2></div>
    </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import Lead from '@/components/Lead.vue';

  const router = useRouter();

  const props = defineProps({
      teams: Object,
      players: Object,
      games: Object,
      finishedGames: Object,
      totalScores: Object,
  });

  function routeToTeam(team){
    router.push(`/team/${team}`);
  }
</script>

<style>
  .team-list-item {
    border-style: groove;
    border-width: 2px;
    margin: auto;
    margin-top: 5px;
    width: 80vw;
    height: 5vh;
    vertical-align: middle;
    border-radius: 10px;
  }
  .team-list-item h2 {
    padding-left: 4px;
    font-size: 1.6em;
    font-weight: 600;
    background-color: rgba(256, 256, 256, 0.20);
  }
</style>