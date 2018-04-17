import Router from 'vue-router'

const ROUTE = {
  install(app, config) {
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
