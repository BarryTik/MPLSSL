<script setup lang="ts">
  import mplsslLogo from '../assets/mplssl.png'
  import { ref } from 'vue'

  const view = ref('start')

  function reset() {
    view.value = 'start'
  }
  function playerInfo() {
    view.value = 'loading'
  }
  function sessionInfo() {
    view.value = 'loading'
  }
</script>

<template>
  <section class="center">
    <div class="hero">
      <img :src="mplsslLogo" class="base" width="170" height="179" alt="" v-on:click="reset"/>
    </div>
    <div v-if="view == 'start'">
      <p><code v-on:click="sessionInfo">Session Info</code> or <code v-on:click="playerInfo">Player Info</code></p>
    </div>
    <div v-if="view == 'loading'">
      <p>loading...</p>
    </div>
  </section>
</template>
