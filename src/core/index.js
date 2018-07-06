//  import Vue from 'vue'
import Router from "vue-router";
import Vuex from "vuex";

import "regenerator-runtime/runtime"//使用promise

import Route from './router'


import Store from "./store";

import JsonBig from "json-bigint";
Vue.prototype.JsonBig = JsonBig;

import HostUrl from "./hostUrl";
Vue.prototype.HostUrl = HostUrl;

import HttpProxy from './httpProxy' //fetch后台交互
Vue.prototype.Proxy = HttpProxy;

import WebSocket from './webSocket' //websocket交互
Vue.prototype.WebSocket = WebSocket;

import WebSocketProxy from "../api/WebSocketProxy"; //websocket请求
Vue.prototype.WsProxy = new WebSocketProxy(WebSocket);

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

import VueClipboard from "vue-clipboard2";
// Vue.use(VueClipboard);

Vue.prototype.Bus = new Vue();

//原型方法添加
import Prototype from './libs/Prototype'
// import store from "../store";

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

let _beforeUnloadTime = 0,
  _gapTime = 0,
  tabIndex = Number(localStorage["tabIndex"]) ? Number(localStorage["tabIndex"]) : 0,
  isNewTab = false,
  toPath = '',
  isFireFox = navigator.userAgent.indexOf("Firefox") > -1; //是否是火狐浏览器
window.onunload = function() {
  _gapTime = Date.now() - _beforeUnloadTime;
  if (_gapTime <= 5) {
    localStorage.setItem("getSessionStorage", Date.now());
    localStorage.removeItem("tabIndex");
  }

  // else
  //   localStorage['test'] = 'refresh  '+_beforeUnload_time
};
window.onbeforeunload = function() {
  _beforeUnloadTime = Date.now();
  if (isFireFox)
    //火狐关闭执行
    localStorage.removeItem("tabIndex");
};
/**
 * 分辨第一次打开，还是在已经打开的情况下，再次打开一个页面
 * 现在已经做到了，在已经打开一个页面的前提下，再次打开新的页面会在已经打开的页面中触发某个事件
 * 每次打开都会执行相同的js，除了上述情况
 * 新打开的页面都没有sessionStorage，但是都有localStorage
 * 刷新不会删除sessionStorage
 * 监听浏览器关闭事件，可以在标签关闭的时候做一些事情
 */
// 为了简单明了删除了对IE的支持
if (!sessionStorage.length) {
  // 这个调用能触发目标事件，从而达到共享数据的目的
  // console.log(1, 'sessionStorage.length')
  isNewTab = true;
  localStorage.setItem("getSessionStorage", Date.now());
}

const RUN_APP = (App, config, plugin) => {
  // console.log(config)
  /* eslint-disable no-new */

  // 引用vue自定义插件
  plugin && plugin.length && plugin.forEach(v => Vue.use(v))

  //引用vue-router
  Vue.use(Router)
  let router = Route.install(Vue.prototype, config.RouterConfig);

  // 引用vuex
  Vue.use(Vuex)
  let store = Store.install(Vue.prototype, config.StoreConfig);

  store.state.isLogin = false

  Vue.prototype.$store = store;

  config.ServerConfig && config.HttpConfig && config.HttpConfig.useHttp && HttpProxy.install(Vue.prototype, config.ServerConfig, config.HttpConfig.httpList, config.HttpConfig.httpPreHandler, config.HttpConfig.httpAfterHandler);
  // config.ServerConfig && config.WebSocketConfig && config.WebSocketConfig.useWebSocket && WebSocket.install(Vue, config.ServerConfig, config.WebSocketConfig.webSocketList);
  config.StorageConfig && config.StorageConfig.useStorage && Storage.install(Vue.prototype, config.StorageConfig.storageList);
  config.LoopTaskConfig && Object.keys(config.LoopTaskConfig).length && Loop.install(Vue.prototype, config.LoopTaskConfig);
  config.PrototypeConfig && Prototype.install(Vue.prototype, config.PrototypeConfig);

  // console.log(isNewTab, tabIndex)
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    window.scrollTo(0, 0);
    Vue.prototype.toPath = to.path;
    if ((isNewTab && tabIndex)) {
      toPath = to.path;
      next();
      return;
    }
    if (["/transaction", "/", "/homepage", "/helpcenter", "/coinData"].includes(to.path)) {
      next();
      return;
    }
    if (!store.state.token) {
      next({ path: "/transaction" });
      document.title = '交易中心';
      return;
    }
    next();
  });

  let vm = new Vue({
    el: "#app",
    router,
    components: { App },
    template: '<App v-if="!isReload" />',
    store,
    data() {
      return {
        isReload: false
      };
    },
    methods: {
      reload() {
        // console.log('this.isReload', this.isReload)
        this.isReload = true;
        this.$nextTick(() => {
          this.isReload = false;
          // console.log(this.$route.path)
          if (["/transaction", "/", "/homepage", "/helpcenter", "/coinData"].includes(toPath)) {
            return;
          }
          !this.$store.state.token &&
            this.$router.push({
              name: "transaction"
            });
        });
      }
    }
  });

  let changeTabIndex = function() {
    if (localStorage["tabIndex"]) {
      localStorage["tabIndex"] = Number(localStorage["tabIndex"]) + 1;
    }else{
      localStorage["tabIndex"] = 0;
    }
  };

  changeTabIndex();

  window.addEventListener("storage", function(event) {
    // console.log(event.key, !sessionStorage.length);
    if (event.key == "getSessionStorage") {
      // console.log(2, 'getSessionStorage',tabIndex)
      // 已存在的标签页会收到这个事件
      changeTabIndex();
      localStorage.setItem("sessionStorage", JsonBig.stringify(sessionStorage));
      localStorage.removeItem("sessionStorage");
    } else if (event.key == "removeSessionStorage") {
      // 已存在的标签页会收到这个事件
      // 一个页面退出其他页面删除token
      store.commit({ type: "changeToken", data: "" });
    } else if (event.key == "sessionStorage" && isNewTab) {
      // 新开启的标签页会收到这个事件
       //console.log('新开启的标签页')
      let data = JsonBig.parse(event.newValue);
      // console.log(3, 'sessionStorage 0', event.newValue, data)
      for (let key in data) {
        // console.log(3, 'sessionStorage 1', key, data[key])
        // console.log('开始赋值', vm)
        sessionStorage[key] = data[key];
        store.replaceState(JsonBig.parse(sessionStorage[key]));
        store.state.isLogin = false;

        // store.state.unreadNumber = 0;
        // store.state.curChat = ""; //当前聊天
        // store.state.systemMessage = 0; //未读系统消息
        // store.state.chat = [];
        store.state.showChat = false;
        // store.state.messages = { system: [] };

        vm.reload();
      }
      isNewTab = false;
    } else if (event.key == "getToken") {
      // 已存在的标签页会收到这个事件;
      // 一个页面登录，让其他页面获取token
      if (!event.newValue) return;
      let params = JSON.parse(event.newValue);
      store.commit({ type: "changeToken", data: params.token});
      store.commit({ type: "changeCode", data: {
        code: params.code,
        email: params.email,
        phone: params.phone
      }});
      //清除totken
      if(getUrl("token")){
        location = '/';
      }else{
        location.reload();
      }
    }
  });

  let getUrl=function(para){
    let paraArr = window.location.search.substring(1).split('&');
    for(let i = 0;i < paraArr.length;i++){
      if(para == paraArr[i].split('=')[0]){
        return paraArr[i].split('=')[1]
      }
    }
    return false;
  }

};

export {
  RUN_APP
}

