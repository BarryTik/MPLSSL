<script setup>
import { ref } from 'vue';

const counter = ref(0)

setInterval(() => {
  counter.value++
}, 1000)
</script>

<style scoped>
.background{
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

</style>

<template>
  <div class="background" v-bind:style="{ backgroundImage:'url(../public/MPLSSL19.jpg)' }">
    <main>
      <router-view
      />
    </main>
  </div>
</template>
