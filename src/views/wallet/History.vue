<template>
  <div class="history">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="5"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <div class="filter">
            <div class="f1">
              <!--搜索条件-->
              <p v-clickoutside="()=>isShowUl0=false" @click="isShowUl0=!isShowUl0">搜索{{ul0[ul0Sel].text}}</p>
              <ul class="drop" v-show="isShowUl0">
                <li v-for="(e,i) in ul0" @click="ul0Sel=i">{{e.text}}</li>
              </ul>
              <input type="text" v-model="srchText" v-clickoutside="()=>isShowTip=false">
              <img src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <button></button>
              <!--模糊搜索结果-->
              <ul v-show="isShowTip && tips.length>0" class="drop">
                <li v-for="(e,i) in tips">
                  <span class="sp1">{{e}}</span><span class="sp2"></span>
                </li>
              </ul>
            </div>
            <div class="f2">
              <DateInterval ref="di"></DateInterval>
            </div>
            <div class="f3">
              <a href="javascript:void(0)" @click="days=1">今天</a>
              <a href="javascript:void(0)" @click="days=7">七天</a>
              <a href="javascript:void(0)" @click="days=30">三十天</a>
            </div>
          </div>
          <div class="thead">
            <div class="time">创建时间</div>
            <div class="type select multi" v-clickoutside="()=>isShowUl1=false">
              <p @click="isShowUl1=!isShowUl1" class="ecli">{{ul1Text}}</p>
              <ul class="drop" v-show="isShowUl1">
                <li v-for="(e,i) in ul1" @click="e.check=!e.check">
                  {{e.text}}
                  <img src="/static/images/selected.png" v-if="e.check">
                  <img src="/static/images/unselect.png" v-else="">
                </li>
              </ul>
            </div>
            <div class="coin select">
              <p @click="isShowUl2=!isShowUl2" v-clickoutside="()=>isShowUl2=false">{{ul2[ul2Sel].text}}</p>
              <ul class="drop" v-show="isShowUl2">
                <li v-for="(e,i) in ul2" @click="ul2Sel=i">{{e.text}}</li>
              </ul>
            </div>
            <div class="addr">对方/地址</div>
            <div class="num">数量及手续费</div>
            <div class="state select">
              <p @click="isShowUl3=!isShowUl3" v-clickoutside="()=>isShowUl3=false">{{ul3[ul3Sel].text}}</p>
              <ul class="drop" v-show="isShowUl3">
                <li v-for="(e,i) in ul3" @click="ul3Sel=i">{{e.text}}</li>
              </ul>
            </div>
            <div class="op">操作</div>
          </div>
          <div v-if="err===0">
            <div class="li" v-for="(e,i) in list">
              <div class="booth">
                <div class="time">
                  <p>2016/03/09</p>
                  <p>13:43</p>
                </div>
                <div class="type in"><p>充币</p></div>
                <div class="coin"><p>BTC</p></div>
                <div class="addr">
                  <p><a href="#" target="_blank">lihh</a></p>
                  <p v-if=""><a href="#" target="_blank"><img src="/static/images/talk.png">联系他</a></p>
                </div>
                <div class="num"><p>+1.12 BTC</p><p>0.00004</p></div>
                <div class="state">
                  <p>待付款</p>
                  <p>待确认</p>
                  <p>申诉中</p>
                </div>
                <div class="op"><p><a href="#">查看</a></p></div>
              </div>
              <div class="bottom">
                <span class="orderId">订单号：123456789098765432</span>
                <span class="remark">备注：希望可以快速放币。。。。。</span>
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
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import DateInterval from "@/components/common/DateInterval";
  import Pagination from "../verify/component/Pagination";
  export default {
    components: {
      Notify,
      LeftBar,
      DateInterval,
      Pagination,
    },
    data() {
      return {

        srchText: "",

        isShowUl0: false,
        ul0Sel: 0,
        ul0: [
          {text:"订单号",value:0},
          {text:"交易对方",value:0},
        ],

        isShowTip: false,
        tips: [1,3,4,54],

        isShowUl1: false,
        ul1: [
          {text:"充币",value:0,check:0},
          {text:"提币",value:1,check:0},
          {text:"购买",value:2,check:0},
          {text:"出售",value:3,check:0},
          {text:"担保-入账",value:4,check:0},
          {text:"担保-出账",value:5,check:0},
          {text:"转账-入账",value:6,check:0},
          {text:"转账-出账",value:7,check:0},
          {text:"红包-入账",value:8,check:0},
          {text:"红包-出账",value:9,check:0},
        ],

        isShowUl2: false,
        ul2Sel: 0,
        ul2: [
          {text:"全部币种",value:0},
          {text:"BTC",value:1},
          {text:"ETH",value:2},
          {text:"LTC",value:3},
        ],

        isShowUl3: false,
        ul3Sel: 0,
        ul3: [
          {text:"全部状态",value:0},
          {text:"待付款",value:1},
          {text:"待确认",value:2},
          {text:"待放币",value:3},
          {text:"申诉中",value:4},
          {text:"完成",value:5},
          {text:"失败-取消",value:6},
          {text:"失败-拒收",value:7},
          {text:"失败-超时",value:8},
        ],

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
  @import "./stylus/history"
</style>
