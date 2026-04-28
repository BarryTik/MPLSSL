<script setup lang="ts">
  import { inject, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { doc, Firestore, getDoc, collection, getDocs } from 'firebase/firestore'

  interface Team {
    id: string
    name: string
  }

  interface Session {
    year: number | string
    season: string
    part?: number
  }

  const route = useRoute()
  const router = useRouter()
  const db = inject<Firestore>('db')!
  const session = ref<Session | null>(null)
  const teams = ref<Team[]>([])
  const loading = ref(true)
  const loadingTeams = ref(false)
  const error = ref<string | null>(null)
  const errorTeams = ref<string | null>(null)

  const fetchSession = async () => {
    loading.value = true
    error.value = null
    try {
      const sessionId = route.params.id as string
      const docRef = doc(db, 'sessions', sessionId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        session.value = {
          year: data.year || 'Unknown',
          season: data.season || 'Unknown',
          part: data.part || null
        }
        await fetchTeams(sessionId)
      } else {
        error.value = 'Session not found'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching session'
    } finally {
      loading.value = false
    }
  }

  const fetchTeams = async (sessionId: string) => {
    loadingTeams.value = true
    errorTeams.value = null
    try {
      const teamsRef = collection(db, 'sessions', sessionId, 'teams')
      const querySnapshot = await getDocs(teamsRef)
      teams.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unknown'
      }))
    } catch (err) {
      errorTeams.value = err instanceof Error ? err.message : 'Error fetching teams'
    } finally {
      loadingTeams.value = false
    }
  }

  const navigateToTeam = (teamId: string) => {
    router.push({
      name: 'Team',
      params: { sessionId: route.params.id, teamId }
    })
  }

  onMounted(() => {
    fetchSession()
  })
</script>

<template>
  <div class="session">
    <div v-if="loading" class="loading">Loading session...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="session" class="content">
      <h1 class="session-title">{{ session.year }}{{ session.part ? ` - Part ${session.part}` : '' }} - {{ session.season }}</h1>

      <div class="teams-section">
        <h2>Teams</h2>
        <div v-if="loadingTeams" class="loading">Loading teams...</div>
        <div v-else-if="errorTeams" class="error">{{ errorTeams }}</div>
        <div v-else-if="teams.length === 0" class="no-data">No teams found in this session</div>
        <div v-else class="teams-list">
          <div 
            v-for="team in teams" 
            :key="team.id" 
            class="team-item"
            @click="navigateToTeam(team.id)"
          >
            {{ team.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .session {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .loading,
  .error {
    padding: 2rem;
    text-align: center;
    font-size: 1rem;
  }

  .error {
    color: #ef4444;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .session-title {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    color: #1f2937;
  }

  .teams-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #374151;
  }

  .teams-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .team-item {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .team-item:hover {
    border-color: #667eea;
    background-color: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .team-item:hover {
    border-color: #667eea;
    background-color: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .no-data {
    color: #6b7280;
    padding: 1rem;
    text-align: center;
  }
</style>
