import Home from './views/Home.vue'
import Standings from './views/Standings.vue'
import Input from './views/Input.vue'
import GoldenBoot from './views/GoldenBoot.vue'
import Team from './views/Team.vue' 
import Subs from './views/Subs.vue'
import Schedule from './views/Schedule.vue'
import About from './views/About.vue'
import Rules from './views/Rules.vue'
import Teams from './views/Teams.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  { path: '/schedule', component: Schedule, meta: { title: 'Schedule' } },
  { path: '/rules', component: Rules, meta: { title: 'Rules' } },
  { path: '/about', component: About, meta: { title: 'About' } },
  { path: '/teams', component: Teams, meta: { title: 'Teams' } },
  {
    path: '/standings',
    meta: { title: 'Standings' },
    component: Standings,
    props: true,
  },
  { path: '/input', component: Input, meta: { title: 'Input'} },
  { path: '/goldenboot', component: GoldenBoot, meta: {title: 'GoldenBoot'} },
  { path: '/team/:team',
    component: Team,
    meta: {title: 'Team'},
    props: route => ({ team: route.params.team }),
  },
  { path: '/subs', component: Subs, meta: {title: 'Subs'} },
  { path: '/:path(.*)', redirect: '/' },
]
