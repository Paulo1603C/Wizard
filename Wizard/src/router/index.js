import Vue from 'vue'
import VueRouter from 'vue-router'
import FormOTPView from '../views/FormOTPView.vue'
import FormRucView from '../views/FormRucView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: FormOTPView
  },
  {
    path: '/about',
    name: 'about',
    component: FormRucView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
