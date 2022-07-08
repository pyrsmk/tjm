import { createRouter, createWebHistory } from 'vue-router'
import ProfileListView from '../views/ProfileListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'profile_list',
      path: '/',
      component: ProfileListView
    },
    {
      name: 'new_profile',
      path: '/profiles/new',
      component: () => import('../views/NewProfileView.vue')
    },
    {
      name: 'profile',
      path: '/profile/:id',
      component: () => import('../views/ProfileView.vue')
    },
  ]
})

export default router
