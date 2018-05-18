<template>
  <div class="address">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="6"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <!--表单-->
          <div v-show="isShowForm">
            <div class="form-head">
              <div class="select">
                <p @click="isShowCoinUl=1" v-clickoutside="()=>isShowCoinUl=0">{{coins[coinUlSel]}}</p>
                <ul class="drop" v-show="isShowCoinUl">
                  <li v-for="(e,i) in coins" @click="coinUlSel=i">{{e}}</li>
                </ul>
              </div>
              <a href="#" @click="isShowForm=0"><img src="/static/images/wallet/spread.png">添加地址</a>
            </div>
            <div class="form">
              <label>名称：</label>
              <input type="text" class="in1">
              <i>1/20</i>
              <label>地址：</label>
              <input type="text" class="in2">
              <a href="#" class="btn green">保存</a>
              <a href="#" class="btn white">取消</a>
            </div>
          </div>
          <!--搜索框-->
          <div class="filter">
            <div class="f1">
              <!--搜索条件-->
              <input type="text" v-model="srchText" v-clickoutside="()=>isShowTip=false" placeholder="搜索地址名称">
              <img src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <button></button>
              <!--模糊搜索结果-->
              <ul v-show="isShowTip && tips.length>0" class="drop">
                <li v-for="(e,i) in tips">
                  <span class="sp1">{{e}}</span><span class="sp2"></span>
                </li>
              </ul>
            </div>
            <div class="f2" v-show="!isShowForm">
              <a href="#" @click="isShowForm=1"><img src="/static/images/wallet/fold.png">添加地址</a>
            </div>
          </div>
          <!--表头-->
          <div class="thead">
            <p class="coin">币种</p>
            <p class="name">名称</p>
            <p class="addr">地址</p>
            <p class="op">操作</p>
          </div>
          <!--请求结果-->
          <div v-if="err===0" class="list">
            <div class="li" v-for="(e,i) in list">
              <div class="coin">BTC</div>
              <div class="name">abc</div>
              <div class="addr">mn8wXyFvWnRHSksrgZVZcQnJ82kZ4QuqL5</div>
              <div class="op">
                <a href="#" class="btn green">编辑</a>
                <a href="#" class="btn white">删除</a>
              </div>
            </div>
            <Pagination :total="total" :pageSize="pageSize" :curPage="curPage"></Pagination>
          </div>
          <div v-else-if="err===1">
            <div class="err no-result">无相应的数据，请重新搜索</div>
          </div>
          <div v-else-if="err===2">
            <div class="err load-failed">网络异常，请重新搜索</div>
          </div>
          <div v-else-if="err===3">
            <div class="err net-error">加载失败，请重新搜索</div>
          </div>
          <div v-else-if="err===4">
            <div class="err loading">加载中...</div>
          </div>
          <div v-else>
            <div class="err empty">无数据</div>
          </div>
        </div>
        <!--确认编辑弹框-->
        <BasePopup>
          <div class="pop">
            <p>确定要取消添加</p>
            <p><button>取消</button><button>确定</button></p>
          </div>
        </BasePopup>

      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import DateInterval from "@/components/common/DateInterval";
  import Pagination from "../verify/component/Pagination";
  import BasePopup from "../../components/common/BasePopup";
  export default {
    components: {
      BasePopup,
      Notify,
      LeftBar,
      DateInterval,
      Pagination,
    },
    data() {
      return {
        isShowForm: 1,

        isShowCoinUl: 0,
        coinUlSel: 0,
        coins: ["BTC","ETH","LTC"],

        srchText: "",

        list: [1,2,3,4,5,6,7,8,9,10],
        curPage: 1,
        pageSize: 20,
        total: 0,
        err: 0,
      }
    },
    computed:{
      ul1Text(){
        let i=0;
        this.ul1.forEach((e)=>{
          if(e.check) i++;
        });
        return i>0?"类型(筛选"+i+"项)":"全部类型";
      },
    },

    methods: {

    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/common"
  @import "./stylus/address"
</style>
