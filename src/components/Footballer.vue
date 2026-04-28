<script setup lang="ts">
  import { inject, computed, ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { doc, Firestore, query, collectionGroup, where, getDoc, getDocs } from 'firebase/firestore'
  import { useDocument } from 'vuefire'

  interface TeamMember {
    teamName: string
    goals: number
    year: number 
  }

  const route = useRoute()
  const db = inject<Firestore>('db')!
  const teamMembers = ref<TeamMember[]>([])
  const loadingMembers = ref(false)
  
  const { data: footballer, pending: loading, error } = useDocument(
    computed(() => doc(db, 'footballers', route.params.id as string))
  )

  const footballerName = computed(() => footballer.value?.name || null)

  const fetchTeamMembers = async () => {
    loadingMembers.value = true
    try {
      const q = query(
        collectionGroup(db, 'members'),
        where('footballerId', '==', route.params.id as string)
      )
      const querySnapshot = await getDocs(q)
      
      const result: TeamMember[] = []
      for (const memberDoc of querySnapshot.docs) {
        const memberData = memberDoc.data() as Record<string, any>
        const teamPath = memberDoc.ref.parent.parent
        const sessionPath = teamPath?.parent.parent
        
        if (teamPath && sessionPath) {
          const [teamDoc, sessionDoc] = await Promise.all([
            getDoc(teamPath),
            getDoc(sessionPath)
          ])
          if (teamDoc.exists() && sessionDoc.exists()) {
            result.push({
              teamName: teamDoc.data().name || 'Unknown',
              goals: memberData.goals || 0,
              year: sessionDoc.data().year || 'Unknown'
            })
          }
        }
      }
      console.log(result.sort((a, b) => b.year - a.year))
      teamMembers.value = result
    } catch (err) {
      console.error('Error fetching team data:', err)
    } finally {
      loadingMembers.value = false
    }
  }

  onMounted(() => {
    fetchTeamMembers()
  })


</script>

<template>
  <div class="footballer">
    <div v-if="loading" class="loading">Loading footballer...</div>
    <div v-else-if="error" class="error">{{ error.message || 'Error fetching footballer' }}</div>
    <div v-else-if="footballerName" class="content">
      <h2 class="name">{{ footballerName }}</h2>
      
      <div class="teams-section">
        <h3>Teams & Goals</h3>
        <div v-if="loadingMembers" class="loading">Loading teams...</div>
        <div v-else-if="!teamMembers || teamMembers.length === 0" class="no-data">No team memberships found</div>
        <table v-else class="teams-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Team</th>
              <th>Goals</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in teamMembers" :key="index">
              <td>{{ member.year }}</td>
              <td>{{ member.teamName }}</td>
              <td>{{ member.goals }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .footballer {
    padding: 1rem;
  }

  .loading,
  .error {
    font-size: 0.875rem;
  }

  .error {
    color: #ef4444;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .name {
    font-weight: 600;
    font-size: 1.875rem;
    margin: 0;
  }

  .teams-section h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  .teams-table {
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
  }

  .teams-table th,
  .teams-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .teams-table th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  .teams-table tbody tr:hover {
    background-color: #f9fafb;
  }

  .no-data {
    color: #6b7280;
    font-size: 0.875rem;
  }
</style>
