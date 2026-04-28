<script setup lang="ts">
  import { inject, ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Firestore, collection, getDocs, orderBy, query } from 'firebase/firestore'

  interface Footballer {
    id: string
    name: string
  }

  const router = useRouter()
  const db = inject<Firestore>('db')!
  const footballers = ref<Footballer[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const fetchFootballers = async () => {
    loading.value = true
    error.value = null
    try {
      const collectionRef = collection(db, 'footballers')
      const q = query(collectionRef, orderBy('name'))
      const querySnapshot = await getDocs(q)
      footballers.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unknown'
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching footballers'
    } finally {
      loading.value = false
    }
  }

  const filteredFootballers = computed(() => {
    if (!searchQuery.value) {
      return footballers.value
    }
    return footballers.value.filter(footballer =>
      footballer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const navigateToFootballer = (id: string) => {
    router.push({ name: 'Footballer', params: { id } })
  }

  onMounted(() => {
    fetchFootballers()
  })
</script>

<template>
  <div class="player-list">
    <h1>Players</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search players by name..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">Loading footballers...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredFootballers.length === 0" class="no-results">
      No footballers found
    </div>
    <div v-else class="footballers-container">
      <div
        v-for="footballer in filteredFootballers"
        :key="footballer.id"
        class="footballer-card"
        @click="navigateToFootballer(footballer.id)"
      >
        {{ footballer.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .player-list {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #1f2937;
  }

  .search-container {
    margin-bottom: 2rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .loading,
  .error,
  .no-results {
    text-align: center;
    padding: 2rem;
    font-size: 1rem;
  }

  .error {
    color: #ef4444;
  }

  .no-results {
    color: #6b7280;
  }

  .footballers-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .footballer-card {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fff;
  }

  .footballer-card:hover {
    border-color: #667eea;
    background-color: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .footballer-card:active {
    transform: translateY(0);
  }
</style>
