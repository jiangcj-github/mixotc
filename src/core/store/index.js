import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// import createLogger from "vuex/dist/logger.js";


const STORE = {
  install(app, config) {
    // console.log(config)
    const vuexLocal = new VuexPersistence({
      storage: window.sessionStorage, ...config.plugins
    })


    // config.plugins = []
    return new Vuex.Store({
      state: Object.assign(config.state, {}),
      mutations: Object.assign(config.mutations, {}),
      actions: Object.assign(config.actions, {}),
      getters: Object.assign(config.getters, {}),
      // plugins: [vuexLocal.plugin, createLogger()]
      plugins: [vuexLocal.plugin]
    });
  }
};

export default STORE
