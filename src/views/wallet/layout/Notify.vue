<template>
  <div class="head" v-if="lists.length<=0">
    <h3>mixOTC-钱包</h3>
  </div>
  <div class="notify" v-else="">
    <div class="wrap">
      <h3>mixOTC-钱包</h3>
      <p v-for="(e,i) in lists">
        <span class="p1"><img src="/static/images/wallet/notify.png">消息：充币 {{e.time}}</span>
        <span class="p2 hl">{{e.coin}}：{{e.num}}个</span>
        <span class="p3">当前状态：确认中(<i class="hl">1</i>/5)</span>
      </p>
    </div>
  </div>
</template>
<script>
  import timeout from "@/js/Timeout.js";
  export default {
    data() {
      return {
        lists: [],
      }
    },
    mounted(){
      this.tick();
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
                num: (e.amount + "").formatFixed(6),
                typeId: e.type_id,
                checked: 0,
                checkNum: 0,
              })

            });
            this.loadConfirm();
          }
        }).catch((msg) => {
          console.log(msg);
        });
      },
      //获取列表中的确认进度
      loadConfirm() {
        this.lists.forEach((e)=>{
          this.WsProxy.send("wallet", "get_recharge_checknum", {id: e.typeId}).then((data)=>{
            if (data && data.data) {
              e.checked = data.data.check_num;
              e.checkNum = data.data.should_num;
            }
          }).catch((msg) => {
            console.log(msg);
          });
        });
      },
      tick(){
        this.loadChargeList();
        timeout(()=>{
          this.tick();
        },3000);
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  *{box-sizing:border-box;}

  .head{width:1200px;margin:0 auto;height:40px;line-height:40px;margin-bottom:20px;}
  .head>h3{font-size:12px;margin-left:15px;}

  .notify{background:#FFE4D3;margin-bottom:20px;}
  .notify .wrap{width:1200px;margin:0 auto;text-align:center;height:40px;line-height:40px;position:relative;}
  .notify .wrap>h3{position:absolute;width:180px;left:15px;text-align:left;font-size:12px;}
  .notify .wrap span{font-size:12px;color: #333333;letter-spacing: 0.23px;}
  .notify .wrap .p1{}
  .notify .wrap .p1>img{height:14px;width:auto;vertical-align:-2px;margin-right:8px;}
  .notify .wrap .p2{margin:0 30px;}
  .notify .wrap .p3{}
  .notify .wrap .hl{color:#ff794c;}

</style>
