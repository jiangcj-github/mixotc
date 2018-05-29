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
              <div class="select" :class="{disabled:isModify}">
                <p v-show="isModify">{{coins[coinUlSel].text}}</p>
                <p v-show="!isModify" @click="isShowCoinUl=1" v-clickoutside="()=>isShowCoinUl=0">{{coins[coinUlSel].text}}</p>
                <ul class="drop" v-show="isShowCoinUl">
                  <li v-for="(e,i) in coins" @click="coinUlSel=i">{{e.text}}</li>
                </ul>
              </div>
              <a href="javascript:void(0);" @click="isShowForm=0"><img src="/static/images/wallet/spread.png">收起</a>
            </div>
            <div class="form">
              <label>名称：</label>
              <input type="text" class="in1" v-model="formAddrName" ref="formAddrName"
                     @input="onFormAddrNameInput" placeholder="输入地址名称">
              <i>{{formAddrName.length}}/20</i>
              <label>地址：</label>
              <input type="text" class="in2" v-model="formAddr" placeholder="输入地址">
              <a href="javascript:void(0);" class="btn green" :class="{disabled:!canSave}" @click="insertAddr" v-if="!isModify">添加</a>
              <a href="javascript:void(0);" class="btn green" :class="{disabled:!canSave}" @click="updateAddr" v-if="isModify">修改</a>
              <a href="javascript:void(0);" class="btn white" @click="isShowForm=false">取消</a>
            </div>
          </div>
          <!--搜索框-->
          <div class="filter">
            <div class="input-group">
              <!--搜索条件-->
              <input class="input" type="text" v-model="srchText" placeholder="搜索地址/地址名称"
                     v-clickoutside="()=>isShowTip=false" @input="onFuzzyInput">
              <img class="clear" src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <button class="addin" @click="loadLists"><img src="/static/images/search.png"></button>
              <!--模糊搜索结果-->
              <ul v-show="isShowTip" class="drop">
                <li v-for="(e,i) in []">
                  <span class="sp1">{{e}}</span><span class="sp2"></span>
                </li>
              </ul>
            </div>
            <div class="f2" v-show="!isShowForm">
              <a href="javascript:void(0);" @click="onInsert"><img src="/static/images/wallet/fold.png">添加地址</a>
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
            <div class="li" v-for="(e,i) in lists">
              <div class="coin">{{e.coin}}</div>
              <div class="name">{{e.name}}</div>
              <div class="addr">{{e.addr}}</div>
              <div class="op">
                <a href="javascript:void(0);" class="btn green" @click="onEdit(i)">编辑</a>
                <a href="javascript:void(0);" class="btn white" @click="onDel(i)">删除</a>
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
        <!--删除确认弹框-->
        <BasePopup :show="isShowDelConfirm" :width="0" :height="0">
          <div class="pop-confirm">
            <p class="pc-close"><i @click="isShowDelConfirm=false">&times;</i></p>
            <p class="pc-text">确定要删除吗？</p>
            <p class="pc-btns">
              <button class="btn white" @click="isShowDelConfirm=false">取消</button>
              <button class="btn green" @click="deleteAddr">确定</button>
            </p>
          </div>
        </BasePopup>
        <!--提示框-->
        <BasePopup :show="isShowAlert" :width="0" :height="0" v-on:click.native="isShowAlert=false">
          <div class="pop-alert">{{alertText}}</div>
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
  import timeout from "@/js/Timeout.js";
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
        isShowForm: 0,

        isShowCoinUl: 0,
        coinUlSel: 0,
        coins:[{text:"BTC",value:"btc"}],

        formAddrName: "",
        formAddrNameOld: "",
        formAddr: "",

        isShowDelConfirm: false,
        selectId: 0,
        isModify: 0, //0-添加,1-修改

        isShowAlert: false,
        alertText: "",

        ul1:[{text:"全部",value:null},],
        ul1Sel:0,
        isShowUl1: false,

        srchText: "",
        tips: [],
        isShowTip: false,

        lists: [],
        curPage: 1,
        pageSize: 20,
        total: 0,
        err: 0,
      }
    },
    watch:{
      ul1Sel:function(){
        this.loadLists();
      }
    },
    computed:{
      paramCoin(){
        return this.ul1[this.ul1Sel].value;
      },
      canSave(){
        if(this.formAddr.length<=0){
          return false;
        }
        else if(this.formAddrName.length<=0 || this.formAddrName.length>20){
          return false;
        }
        return true;
      }
    },
    methods:{
      showAlert(msg){
        this.alertText=msg;
        this.isShowAlert=true;
        timeout(()=>{
          this.isShowAlert=false;
        },3000);
      },
      onFormAddrNameInput(){
        if(this.formAddrName.length>20){
          this.formAddrName=this.formAddrNameOld;
          this.$refs.formAddrName.value=this.formAddrNameOld;
        }else{
          this.formAddrNameOld=this.formAddrName;
        }
      },
      async init(){
        //加载钱包币种列表
        let data=await this.WsProxy.send("wallet","", {}).catch((msg)=>{
          console.log(msg);
        });
        data && data.forEach((e)=>{
          this.coins.push({text:e.toUpperCase(),value:e.toLowerCase()});
        });
        //加载钱包币种列表
        let data2=await this.WsProxy.send("wallet","", {}).catch((msg)=>{
          console.log(msg);
        });
        data2 && data2.forEach((e)=>{
          this.ul1.push({text:e.toUpperCase(),value:e.toLowerCase()});
        });
        //加载地址
        this.loadLists();
      },
      onFuzzyInput(){
        if(this.srchText.length<=0){
          this.isShowTip=false;
          return;
        }
        this.loadTips();
      },
      loadTips(){
        this.WsProxy.send("wallet","", {

        }).then((data)=>{
          this.parseTips(data);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      parseTips(data){
        this.tips=[];
        data && data.forEach((e)=>{
          this.tips.push({
            name: "name",
            addr: "addr",
          });
        });
      },
      loadLists(){
        this.WsProxy.send("wallet","", {

        }).then((data)=>{
          if(!data||!data.list||data.list.length<=0){
            this.err=1; //无数据
          }else{
            this.err=0;
            this.total=data.count;
            this.parseBills(data.list);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
      },
      parseList(data){
        this.lists=[];
        data && data.forEach((e)=>{
          this.lists.push({
            id: "id",
            coin: "coin",
            name: "addr_name",
            addr: "mn8wXyFvWnRHSksrgZVZcQnJ82kZ4QuqL5".formatAddr(),
            addr2: "",
          });
        })
      },
      onInsert(){
        this.isShowForm=true;
        this.isModify=false;
      },
      onEdit(i){
        this.selectId=i;
        this.formAddrName=this.lists[i].addrName;
        this.formAddr=this.lists[i].addr;
        this.coins.forEach((e,i)=>{
          if(e.value==this.lists[i].coin){
            this.ul1Sel=i;
          }
        });
        this.isModify=true;
        this.isShowForm=true;
      },
      onDel(i){
        this.isShowDelConfirm=true;
        this.selectId=i;
      },
      insertAddr(){
        let coin=this.coins[this.coinUlSel].value;
        let addrName=this.formAddrName;
        let addr=this.formAddr;
        this.WsProxy.send("wallet","add_withdraw_address", {
          coin: coin,
          remark: addrName,
          address: addr,
        }).then((data)=>{
          this.showAlert("添加成功");
        }).catch((msg)=>{
          this.showAlert("添加失败");
        });
      },
      updateAddr(){
        let coin=this.coins[this.coinUlSel].value;
        let addrName=this.formAddrName;
        let addr=this.formAddr;
        this.WsProxy.send("wallet","update_withdraw_address", {
          id: id,
          remark: addrName,
          address: addr,
        }).then((data)=>{
          this.showAlert("更新成功");
        }).catch((msg)=>{
          this.showAlert("更新失败");
        });
      },
      deleteAddr(){
        let e=this.lists[this.selectId];
        this.WsProxy.send("wallet","del_withdraw_address", {
          id: e.id,
          currency: e.coin,
        }).then((data)=>{
          this.showAlert("删除成功");
        }).catch((msg)=>{
          this.showAlert("删除失败");
        });
      },
    },
    mounted(){
      this.init();
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "../common/stylus/common"
  @import "./stylus/common"
  @import "./stylus/address"
</style>
