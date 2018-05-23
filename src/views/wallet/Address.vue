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
            <div class="input-group">
              <!--搜索条件-->
              <input class="input" type="text" v-model="srchText" v-clickoutside="()=>isShowTip=false" placeholder="搜索地址名称">
              <img class="clear" src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <button class="addin" @click=""><img src="/static/images/search.png"></button>
              <!--模糊搜索结果-->
              <ul v-show="isShowTip" class="drop">
                <li v-for="(e,i) in []">
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
            <div class="th coin select">
              <p @click="isShowUl1=!isShowUl1">币种({{ul1[ul1Sel].text}})</p>
              <ul class="drop" v-show="isShowUl1">
                <li v-for="(e,i) in ul1" @click="ul1Sel=i">{{e.text}}</li>
              </ul>
            </div>
            <div class="th name">名称</div>
            <div class="th addr">地址</div>
            <div class="th op">操作</div>
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

        ul1:[
          {text:"全部",value:null},
        ],
        ul1Sel:0,
        isShowUl1: false,

        srchText: "",
        isShowTip: false,

        list: [1,2,3,4,5,6,7,8,9,10],
        curPage: 1,
        pageSize: 20,
        total: 0,
        err: 0,
      }
    },
    computed:{

    },

    methods:{
      async init(){
        //加载钱包币种列表
        let data=await this.WsProxy.send("wallet","bill_currency_list", {}).catch((msg)=>{
          console.log(msg);
        });
        data && data.forEach((e)=>{
          this.ul2.push({text:e.toUpperCase(),value:e.toLowerCase()});
        });
        // 获取URL传入参数
        let type=this.$route.query.type;        // type
        if(type){
          this.ul1.forEach((e)=>{
            e.check=(e.value==type?1:0);
          });
        }
        let coin=this.$route.query.coin;        // coin
        if(coin){
          coin=coin.toUpperCase();
          let exist=0;
          for(let i=0;i<this.ul2.length;i++){
            if(this.ul2[i].text==coin){
              exist++;
              this.ul2Sel=i;
            }
          }
          if(exist<=0){
            this.ul2.push({text:coin.toUpperCase(),value:e.toLowerCase()});
            this.ul2Sel=this.ul2.length-1;
          }
        }
        //加载账单
        this.loadBills();
      },
    },
    mounted(){
      this.init();
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/common"
  @import "./stylus/address"
</style>
