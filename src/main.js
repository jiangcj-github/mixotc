// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import jsonBig from 'json-bigint';
import axios from 'axios';
import { DatePicker } from "element-ui";
import '@/stylus/rest.styl'
Vue.config.productionTip = false;

Vue.prototype.jsonBig = jsonBig;
Vue.prototype.axios = axios;

Vue.use(DatePicker);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
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