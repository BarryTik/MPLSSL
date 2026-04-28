<script setup lang="ts">
  import { inject, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { doc, Firestore, getDoc, collection, getDocs } from 'firebase/firestore'

  interface TeamMember {
    id: string
    name: string
    goals: number
    footballerId: string
  }

  interface Team {
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
  const team = ref<Team | null>(null)
  const session = ref<Session | null>(null)
  const members = ref<TeamMember[]>([])
  const loading = ref(true)
  const loadingMembers = ref(false)
  const error = ref<string | null>(null)
  const errorMembers = ref<string | null>(null)

  const fetchTeam = async () => {
    loading.value = true
    error.value = null
    try {
      const sessionId = route.params.sessionId as string
      const teamId = route.params.teamId as string

      // Fetch session data
      const sessionRef = doc(db, 'sessions', sessionId)
      const sessionSnap = await getDoc(sessionRef)
      if (sessionSnap.exists()) {
        const data = sessionSnap.data()
        session.value = {
          year: data.year || 'Unknown',
          season: data.season || 'Unknown',
          part: data.part || null
        }
      }

      // Fetch team data
      const teamRef = doc(db, 'sessions', sessionId, 'teams', teamId)
      const teamSnap = await getDoc(teamRef)
      if (teamSnap.exists()) {
        team.value = {
          name: teamSnap.data().name || 'Unknown'
        }
        await fetchMembers(sessionId, teamId)
      } else {
        error.value = 'Team not found'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching team'
    } finally {
      loading.value = false
    }
  }

  const fetchMembers = async (sessionId: string, teamId: string) => {
    loadingMembers.value = true
    errorMembers.value = null
    try {
      const membersRef = collection(db, 'sessions', sessionId, 'teams', teamId, 'members')
      const querySnapshot = await getDocs(membersRef)
      const memberPromises = querySnapshot.docs.map(async (memberDoc) => {
        const memberData = memberDoc.data()
        const footballerId = memberData.footballerId
        const goals = memberData.goals || 0

        // Fetch footballer data to get the name
        let footballerName = 'Unknown'
        try {
          const footballerRef = doc(db, 'footballers', footballerId)
          const footballerSnap = await getDoc(footballerRef)
          if (footballerSnap.exists()) {
            footballerName = footballerSnap.data().name || 'Unknown'
          }
        } catch (err) {
          console.error('Error fetching footballer:', err)
        }

        return {
          id: memberDoc.id,
          name: footballerName,
          goals,
          footballerId
        }
      })

      members.value = (await Promise.all(memberPromises)).sort((a, b) => b.goals - a.goals)
    } catch (err) {
      errorMembers.value = err instanceof Error ? err.message : 'Error fetching members'
    } finally {
      loadingMembers.value = false
    }
  }

  const navigateToFootballer = (footballerId: string) => {
    router.push({ name: 'Footballer', params: { id: footballerId } })
  }

  onMounted(() => {
    fetchTeam()
  })
</script>

<template>
  <div class="team">
    <div v-if="loading" class="loading">Loading team...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="team && session" class="content">
      <div class="header">
        <h1 class="team-name">{{ team.name }}</h1>
        <p class="session-info">
          {{ session.year }}{{ session.part ? ` - Part ${session.part}` : '' }} - {{ session.season }}
        </p>
      </div>

      <div class="members-section">
        <h2>Team Members</h2>
        <div v-if="loadingMembers" class="loading">Loading members...</div>
        <div v-else-if="errorMembers" class="error">{{ errorMembers }}</div>
        <div v-else-if="members.length === 0" class="no-data">No members found in this team</div>
        <div v-else class="members-list">
          <div 
            v-for="member in members" 
            :key="member.id" 
            class="member-item"
            @click="navigateToFootballer(member.footballerId)"
          >
            <div class="member-name">{{ member.name }}</div>
            <div class="member-goals">{{ member.goals }} goal{{ member.goals !== 1 ? 's' : '' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .team {
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

  .header {
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1.5rem;
  }

  .team-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #1f2937;
  }

  .session-info {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  .members-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #374151;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .member-item {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .member-item:hover {
    border-color: #667eea;
    background-color: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .member-name {
    font-weight: 500;
    color: #1f2937;
  }

  .member-goals {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .no-data {
    color: #6b7280;
    padding: 1rem;
    text-align: center;
  }
</style>
