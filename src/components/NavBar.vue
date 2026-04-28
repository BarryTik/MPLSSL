<script setup lang="ts">
  import { useRouter, useRoute } from 'vue-router'
  import mplsslLogo from '../assets/mplssl.png'

  const router = useRouter()
  const route = useRoute()

  const goHome = () => {
    router.push({ name: 'Home' })
  }

  const isHomePage = () => route.name === 'Home'
</script>

<template>
  <nav v-if="!isHomePage()" class="navbar">
    <div class="nav-content">
      <img 
        :src="mplsslLogo" 
        alt="MPLSSL" 
        class="navbar-logo"
        @click="goHome"
      />
    </div>
  </nav>
</template>

<style scoped>
  .navbar {
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  .navbar-logo {
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .navbar-logo:hover {
    transform: scale(1.1);
  }
</style>
