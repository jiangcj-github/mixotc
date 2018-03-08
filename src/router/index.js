import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Expression from '@/components/chatRoom/Expression'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/expression',
      component: Expression
    }
  ]
});
