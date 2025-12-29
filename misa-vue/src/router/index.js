import CandidateView from '@/views/candidate/CandidateView.vue'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'candidate',
      component: CandidateView,
    },
    // {
    //   path: '/about',
    //   name: 'about',
     
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router