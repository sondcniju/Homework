import { createRouter, createWebHistory } from "vue-router"
import CandidateDashboard from "../views/CandidateDashboard.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "candidates",
      component: CandidateDashboard,
    },
  ],
})

export default router
