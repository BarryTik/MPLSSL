import Home from './views/Home.vue'
import Standings from './views/Standings.vue'
import Input from './views/Input.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/standings',
    meta: { title: 'Standings' },
    component: Standings,
    props: true,
  },
  { path: '/input', component: Input, meta: { title: 'Input'} },
  { path: '/:path(.*)', redirect: '/' },
]
