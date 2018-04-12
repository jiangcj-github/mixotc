import Vuex from "vuex";
// import VuexPersistence from "vuex-persist";
import createLogger from "vuex/dist/logger.js";

const STORE = {
  install(app, config) {
    // console.log(config);
    // const vuexLocal = new VuexPersistence({
    //   storage: window.localStorage,
    //   ...config.plugins
    // });
    config.plugins = [createLogger()];
    return new Vuex.Store(config);
  }
};

export default STORE;
