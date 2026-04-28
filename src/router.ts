import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Footballer from './components/Footballer.vue'
import PlayerList from './components/PlayerList.vue'

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
    path: '/footballer/:id',
    name: 'Footballer',
    component: Footballer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
