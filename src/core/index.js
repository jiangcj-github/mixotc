import Vue from 'vue'

import "regenerator-runtime/runtime"//使用promise

import Router from './router'

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
Vue.directive('clickoutside', {
  bind: function (el, binding, vode) {
    // console.log('1234566', el, binding);
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

Vue.directive("defaultClick", {
  bind: function(el, binding) {
    function documentHandle(e){
      if(el.contains(e.target)){
        return;
      }
      binding.value()
    }
    el.mid = documentHandle;
    document.addEventListener("click", documentHandle);
  },
  unbind: function(el, binding) {
    document.removeEventListener("click", el.mid);
  }
});

const RUN_APP = (App, config, plugin) => {
  // console.log(config)
  /* eslint-disable no-new */
  let router = Router.install(config.RouterConfig)
  config.ServerConfig && config.ProxyConfig && config.ProxyConfig.useHttp && HttpProxy.install(config.ServerConfig, config.ProxyConfig.httpConfig.httpProxyList, config.ProxyConfig.httpConfig.httpFilter)
  config.ServerConfig && config.ProxyConfig && config.ProxyConfig.useWebSocket && WebSocket.install(config.ServerConfig, config.ProxyConfig.webSocketConfig)
  config.ProxyConfig && config.ProxyConfig.useStorage && Storage.install(config.ProxyConfig.storageConfig)
  config.LoopTaskConfig && Object.keys(config.LoopTaskConfig).length && Loop.install(config.LoopTaskConfig)
  config.PrototypeConfig && Prototype.install(config.PrototypeConfig)

  plugin && plugin.length && plugin.forEach(v => Vue.use(v))

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

