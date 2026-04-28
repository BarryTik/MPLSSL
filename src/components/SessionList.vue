<script setup lang="ts">
  import { inject, ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { Firestore, collection, getDocs } from 'firebase/firestore'

  interface Session {
    id: string
    year: number | string
    season: string
    part?: number | string
  }

  const router = useRouter()
  const db = inject<Firestore>('db')!
  const sessions = ref<Session[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchSessions = async () => {
    loading.value = true
    error.value = null
    try {
      const querySnapshot = await getDocs(collection(db, 'sessions'))
      sessions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        year: doc.data().year || 'Unknown',
        season: doc.data().season || 'Unknown',
        part: doc.data().part
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching sessions'
    } finally {
      loading.value = false
    }
  }

  const sortedSessions = computed(() => {
    return [...sessions.value].sort((a, b) => {
      const yearA = typeof a.year === 'string' ? parseInt(a.year) : a.year
      const yearB = typeof b.year === 'string' ? parseInt(b.year) : b.year
      
      if (yearA !== yearB) {
        return yearB - yearA
      }
      
      const partA = a.part ? (typeof a.part === 'string' ? parseInt(a.part) : a.part) : 0
      const partB = b.part ? (typeof b.part === 'string' ? parseInt(b.part) : b.part) : 0
      
      return partB - partA
    })
  })

  const navigateToSession = (id: string) => {
    router.push({ name: 'Session', params: { id } })
  }

  onMounted(() => {
    fetchSessions()
  })
</script>

<template>
  <div class="session-list">
    <h1>Sessions</h1>

    <div v-if="loading" class="loading">Loading sessions...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="sessions.length === 0" class="no-results">
      No sessions found
    </div>
    <div v-else class="sessions-container">
      <div
        v-for="session in sortedSessions"
        :key="session.id"
        class="session-card"
        @click="navigateToSession(session.id)"
      >
        <div class="session-year">{{ session.year }}</div>
        <div class="session-season">{{ session.season }}</div>
        <div v-if="session.part" class="session-part">Part {{ session.part }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .session-list {
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

  .sessions-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .session-card {
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .session-card:hover {
    border-color: #667eea;
    background-color: #f9fafb;
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .session-card:active {
    transform: translateY(-2px);
  }

  .session-year {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
  }

  .session-season {
    font-size: 1rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .session-part {
    font-size: 0.875rem;
    color: #9ca3af;
    margin-top: 0.5rem;
    font-weight: 500;
  }
</style>
