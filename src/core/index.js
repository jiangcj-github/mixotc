import Vue from 'vue'

import "regenerator-runtime/runtime"//使用promise

import Router from './router'

import JsonBig from "json-bigint";

Vue.prototype.JsonBig = JsonBig;

import HttpProxy from './httpProxy' //fetch后台交互
Vue.prototype.Proxy = HttpProxy;

import WebSocket from './webSocket' //websocket交互
Vue.prototype.WebSocket = WebSocket;

import Storage from './storage' //localStorage交互
Vue.prototype.Storage = Storage;

import Loop from './loop' //localStorage交互
Vue.prototype.Loop = Loop;

import AsyncAll from './libs/AsyncAll' //同步多个异步请求
Vue.prototype.AsyncAll = AsyncAll

import Sleep from './libs/Sleep' //同步多个异步请求
Vue.prototype.Sleep = Sleep

import Logger from './libs/Logger' //自定义logger
Vue.prototype.Logger = Logger


Vue.prototype.Bus = new Vue();

//原型方法添加
import Prototype from './libs/Prototype'
import store from "../store";

Vue.config.productionTip = false;
// 点击外部区域消失
Vue.directive('clickoutside', {
  bind: function (el, binding, vode) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false
      }
      if (binding.expression) {
        binding.value(e);
      }
    }

    el.wfy = documentHandler;
    document.addEventListener('click', documentHandler)
  },
  unbind: function (el, binding) {
    document.removeEventListener('click', el.wfy);
    delete el.wfy
  }
});
// focus指令
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el, para) {
    // 聚焦元素
    // console.log('11111',para.value)
    para.value && el.focus()
  },
  //也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
  //有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
  update: function (el, para) {
    para.value && el.focus()
  }
});
const RUN_APP = (App, config, plugin) => {
  // console.log(config)
  /* eslint-disable no-new */

  // 引用vue自定义插件
  plugin && plugin.length && plugin.forEach(v => Vue.use(v))

  //引用vue-router
  Vue.use(Router)
  let router = Router.install(config.RouterConfig)

  //引用vuex
  // Vue.use(Vuex)
  // let store = Store.install(Vue, config.StoreConfig)

  config.ServerConfig && config.HttpConfig && config.HttpConfig.useHttp && HttpProxy.install(Vue, config.ServerConfig, config.HttpConfig.httpList, config.HttpConfig.httpPreHandler, config.HttpConfig.httpAfterHandler);
  // config.ServerConfig && config.WebSocketConfig && config.WebSocketConfig.useWebSocket && WebSocket.install(Vue, config.ServerConfig, config.WebSocketConfig.webSocketList);
  config.StorageConfig && config.StorageConfig.useStorage && Storage.install(config.StorageConfig.storageList);
  config.LoopTaskConfig && Object.keys(config.LoopTaskConfig).length && Loop.install(config.LoopTaskConfig);
  config.PrototypeConfig && Prototype.install(config.PrototypeConfig);

router.beforeEach((to, from, next) => {
  if (to.path === "/transaction" || to.path === "/") {
    next();
    return;
  } 
  if (!store.state.isLogin) {
    next({path: "/transaction"});
    return;
  }
  next()
})

  new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
  });
};

export {
  RUN_APP
}

