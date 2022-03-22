<script setup>
  import { db } from "./firebase";
  import { ref, onValue } from "firebase/database";
  import { reactive, ref as vueRef } from 'vue';
  import Nav from '@/components/Nav.vue'


  const reactives = reactive({
      games: {},
      teams: {},
      players: {},
  })

  loadTeams();
  loadPlayers();
  loadGames();


  async function loadGames(){
      onValue(ref(db, 'winter-21-22-2/Games'), (snapshot) => {
          reactives.games = snapshot.val();
      });
  }

  async function loadTeams(){
      onValue(ref(db, 'winter-21-22-2/Teams'), (snapshot) => {
          reactives.teams = snapshot.val();
      })
  }

  async function loadPlayers(){
      onValue(ref(db, 'winter-21-22-2/Players'), (snapshot) => {
          reactives.players = snapshot.val();
      })
  }
</script>

<style scoped>
.background{
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
main{
  padding-top: 64px;
}

</style>

<template>
  <div class="background" v-bind:style="{ backgroundImage:'url(../public/MPLSSL19.jpg)' }">
    <Nav/>
    <main>
      <router-view
      :games="reactives.games"
      :teams="reactives.teams"
      :players="reactives.players"
      />
    </main>
  </div>
</template>
