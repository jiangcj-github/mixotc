import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import JsonBig from 'json-bigint'
import createLogger from "vuex/dist/logger.js";

// 为了简单明了删除了对IE的支持
(function () {
  if (!sessionStorage.length) {
    // 这个调用能触发目标事件，从而达到共享数据的目的
    // console.log(1, 'sessionStorage.length')
    localStorage.setItem('getSessionStorage', Date.now());
  }
})();

const STORE = {
  install(app, config) {
    // console.log(config)
    const vuexLocal = new VuexPersistence({
      storage: window.sessionStorage, ...config.plugins
    })

    const testPlugin = store => {
      // 该事件是核心
      window.addEventListener('storage', function (event) {
        console.log(event.key)
        if (event.key == 'getSessionStorage') {
          // console.log(2, 'getSessionStorage')
          // 已存在的标签页会收到这个事件
          localStorage.setItem('sessionStorage', JsonBig.stringify(sessionStorage));
          localStorage.removeItem('sessionStorage');

        }else if (event.key == "removeSessionStorage") {
          // 已存在的标签页会收到这个事件
          // 一个页面退出其他页面删除token
          store.commit({ type: "changeToken", data: "" });
          // let data = JsonBig.parse(event.newValue)
          // console.log(data);
          // console.log(3, 'sessionStorage 0', event.newValue, data)
          // for (let key in sessionStorage) {
          //   // console.log(3, 'sessionStorage 1', key, data[key])
          //   console.log(JsonBig.parse(sessionStorage[key]));
            // store.replaceState(JsonBig.parse(sessionStorage[key]));
          // }
        }
        else if (event.key == 'sessionStorage' && !sessionStorage.length) {
          // 新开启的标签页会收到这个事件

          let data = JsonBig.parse(event.newValue)
          // console.log(3, 'sessionStorage 0', event.newValue, data)
          for (let key in data) {
            // console.log(3, 'sessionStorage 1', key, data[key])
            sessionStorage[key] = data[key];
            store.replaceState(JsonBig.parse(sessionStorage[key]))
          }
        }
        else if (event.key == 'getToken') {
          // 已存在的标签页会收到这个事件;
          // 一个页面登录，让其他页面获取token
          if(!event.newValue) return;
          console.log('dfgdfasgadfsgadfg', event.newValue);
          store.commit({ type: "changeToken", data: event.newValue });
        }
      });
    }

    // config.plugins = []
    return new Vuex.Store({
      state: Object.assign(config.state, {}),
      mutations: Object.assign(config.mutations, {}),
      actions: Object.assign(config.actions, {}),
      plugins: [vuexLocal.plugin, testPlugin, createLogger()]
    })
  }
};

export default STORE