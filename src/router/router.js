import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login.vue'
Vue.use(VueRouter)

// 创建路由对象
export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
