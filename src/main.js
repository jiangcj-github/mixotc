// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './store';
import jsonBig from 'json-bigint';
import axios from 'axios';
import client from "./js/client.js";
import storage from "./js/localStorage.js";
import { DatePicker } from "element-ui";
import '@/stylus/rest.styl'

import RouterConfig from "@/config/RouterConfig"//引入路由设置
import ServerConfig from '@/config/ServerConfig' //引入服务器设置
import ProxyConfig from "@/config/ProxyConfig";//引入proxy设置
import PrototypeConfig from '@/config/PrototypeConfig'//引入prototype设置
import LoopTaskConfig from '@/config/LoopTaskConfig'//引入轮循任务设置

import {RUN_APP} from './core'
RUN_APP(App, {RouterConfig, ServerConfig, ProxyConfig, PrototypeConfig, LoopTaskConfig}, [])



Vue.config.productionTip = false;

Vue.prototype.jsonBig = jsonBig;
Vue.prototype.axios = axios;
Vue.prototype.client = client();
Vue.prototype.storage = storage;

Vue.use(DatePicker);
/* eslint-disable no-new */



