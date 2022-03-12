import Home from './views/Home.vue'
import Teams from './views/Teams.vue'
import Input from './views/Input.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  {
    path: '/teams',
    meta: { title: 'Teams' },
    component: Teams,
    props: true,
  },
  { path: '/input', component: Input, meta: { title: 'Input'} },
  { path: '/:path(.*)', redirect: '/' },
]
