<template>
  <div class="head" v-if="lists.length<=0">
    <h3><a href="/#/">mixOTC</a>-<a href="/#/wallet">钱包</a></h3>
  </div>
  <div class="notify" v-else="">
    <div class="wrap">
      <h3><a href="/#/">mixOTC</a>-<a href="/#/wallet">钱包</a></h3>
      <transition-group name="slide" tag="div" class="msg">
        <p v-for="(e,i) in lists" v-show="i===showIndex" :key="i" class="msg-li">
          <span class="p1"><img src="/static/images/wallet/notify.png">消息：充币 {{e.time}}</span>
          <span class="p2 hl">{{e.coin}}：{{e.num}}个</span>
          <span class="p3">当前状态：确认中(<i class="hl">{{e.checked}}</i>/{{e.checkNum}})</span>
        </p>
      </transition-group>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        lists: [],
        showIndex:0,
      }
    },
    mounted(){
      this.tick();
      this.slide();
    },
    methods: {
      //获取充值确认中列表
      loadChargeList() {
        this.WsProxy.send("wallet", "bills_v2", {
          type: "1",
          state: "1",
          page: 0,
          count: 10,
          sort: 0,
        }).then((data) => {
          if (data && data.bills) {
            this.lists = [];
            data.bills.forEach((e) => {
              this.lists.push({
                time: new Date(e.date * 1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
                coin: e.currency,
                num: e.amount.formatFixed(6),
                typeId: e.type_id,
                checked: 0,
                checkNum: 0,
              });
            });
            this.loadConfirm();
          }
        }).catch((msg) => {
          console.log(msg);
        });
      },
      //获取列表中的确认进度
      loadConfirm() {
        this.lists.forEach((e,i)=>{
          this.WsProxy.send("wallet", "get_recharge_checknum", {id: e.typeId}).then((data)=>{
            if (data) {
              e.checked = data.check_num;
              e.checkNum = data.should_num;
            }
          }).catch((msg) => {
            console.log(msg);
          });
        });
      },
      tick(){
        this.loadChargeList();
        setTimeout(()=>{
          this.tick();
        },5000);
      },
      slide(){
        if(this.lists.length>1){
          if(this.showIndex<this.lists.length-1){
            this.showIndex++;
          }else{
            this.showIndex=0;
          }
        }
        setTimeout(()=>{
          this.slide();
        },3000);
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  *{box-sizing:border-box;}

  .head{width:1200px;margin:10px auto 20px auto;height:20px;line-height:20px;}
  .head>h3{font-size:12px;margin-left:15px;}
  .head>h3>a{}
  .head>h3>a:hover{color:#fea350;}

  .notify{background:#FFE4D3;margin-bottom:20px;}
  .notify .wrap{width:1200px;margin:0 auto;text-align:center;height:40px;line-height:40px;position:relative;}
  .notify .wrap>h3{position:absolute;width:180px;left:15px;text-align:left;font-size:12px;}
  .notify .wrap span{font-size:12px;color: #333333;letter-spacing: 0.23px;}
  .notify .wrap .p1{}
  .notify .wrap .p1>img{height:14px;width:auto;vertical-align:-2px;margin-right:8px;}
  .notify .wrap .p2{margin:0 30px;}
  .notify .wrap .p3{}
  .notify .wrap .hl{color:#ff794c;}
  .notify .wrap .msg{height:40px;overflow:hidden;position:relative;}
  .notify .wrap .msg .msg-li{position:absolute;left:0;top:0;right:0;bottom:0;}

  /*列表过渡*/
  .slide-enter-active,
  .slide-leave-active{
    transition: all 1s;
  }
  .slide-enter{transform: translateY(40px);}
  .slide-leave-to{transform: translateY(-40px);}
</style>
