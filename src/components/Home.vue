<script setup lang="ts">
  import mplsslLogo from '../assets/mplssl.png'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function reset() {
    router.push({ name: 'Home' })
  }
  function playerInfo() {
    router.push({ name: 'PlayerList' })
  }
  function sessionInfo() {
    // TODO: Implement session info navigation
  }
</script>

<template>
  <section class="center">
    <div class="hero">
      <img :src="mplsslLogo" class="base" width="170" height="179" alt="" @click="reset"/>
    </div>
    <div class="button-container">
      <button class="stylish-button" @click="sessionInfo">Session Info</button>
      <span class="divider">or</span>
      <button class="stylish-button" @click="playerInfo">Player Info</button>
    </div>
  </section>
</template>

<style scoped>
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  }

  .hero {
    margin-bottom: 2rem;
    cursor: pointer;
  }

  .base {
    transition: transform 0.3s ease;
  }

  .base:hover {
    transform: scale(1.1);
  }

  .button-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .stylish-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .stylish-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .stylish-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .divider {
    color: #999;
    font-size: 0.875rem;
    font-weight: 500;
  }

  p {
    text-align: center;
    font-size: 1.125rem;
    color: #333;
  }
</style>
