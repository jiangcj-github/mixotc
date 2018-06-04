// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue';

import App from './App';

// import { DatePicker } from "element-ui"; // 引入日历组件
// import { Slider } from "element-ui"; // 引入滑块
// import { Switch } from "element-ui"; // 引入开关
import '@/stylus/rest.styl'
import "@/stylus/base.styl"

import BaseFunction from '@/js/BaseFunction'//引入自定义插件
import BasePrototype from '@/js/BasePrototype'//引入自定义原型方法

import StoreConfig from "@/config/StoreConfig"//引入vuex设置
import RouterConfig from "@/config/RouterConfig"//引入路由设置
import ServerConfig from '@/config/ServerConfig' //引入服务器设置
import HttpConfig from "@/config/HttpConfig";//引入HttpConfig设置
import StorageConfig from "@/config/StorageConfig";//引入StorageConfig设置
import PrototypeConfig from '@/config/PrototypeConfig'//引入prototype设置
import LoopTaskConfig from '@/config/LoopTaskConfig'//引入轮循任务设置

import {RUN_APP} from './core'

//注册自定义原型方法
PrototypeConfig.base && BasePrototype.install(PrototypeConfig.base)

RUN_APP(
  App,
  {
    StoreConfig,
    RouterConfig,
    ServerConfig,
    StorageConfig,
    HttpConfig,
    PrototypeConfig: PrototypeConfig.core,
    LoopTaskConfig
  },
  // [DatePicker, Slider, Switch]
);



Vue.config.productionTip = false;


/* eslint-disable no-news */



