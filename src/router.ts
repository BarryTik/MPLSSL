import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Footballer from './components/Footballer.vue'
import PlayerList from './components/PlayerList.vue'
import Session from './components/Session.vue'
import SessionList from './components/SessionList.vue'
import Team from './components/Team.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/players',
    name: 'PlayerList',
    component: PlayerList
  },
  {
    path: '/sessions',
    name: 'SessionList',
    component: SessionList
  },
  {
    path: '/footballer/:id',
    name: 'Footballer',
    component: Footballer
  },
  {
    path: '/session/:id',
    name: 'Session',
    component: Session
  },
  {
    path: '/session/:sessionId/team/:teamId',
    name: 'Team',
    component: Team
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
