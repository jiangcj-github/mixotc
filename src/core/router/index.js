import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const ROUTE = {
  install(config) {
    let router = new Router({
      routes: config.routes
    })

    config.beforeEach && router.beforeEach(config.beforeEach)
    config.beforeResolve && router.beforeResolve(config.beforeResolve)
    config.afterEach && router.afterEach(config.afterEach)

    return router
  }
}

export default ROUTE
