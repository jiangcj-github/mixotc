 <template>
  <div class="homepage inner">
    <div class="navigation">
      <h3><router-link tag="a" to="/">mixOTC</router-link>-<router-link tag="a" :to="'/homepage?uid='+uid">{{info.nickname}}的个人主页</router-link></h3>
    </div>
    <!-- 个人交易信息 -->
    <div class="info-sec">
      <div class="sec1 clearfix">
        <div class="info">
          <div class="avatar"><img :src="info.headimg" alt="">
            <i class="online" :class="{active:isOnline}"></i>
          </div>
          <span class="nickname">{{info.nickname}}</span>
          <span class="tran_num" v-if="isLogin && !isSelf">和他交易过{{info.tradeWidthNum}}次</span>
        </div>
        <div v-if="!isSelf">
          <div v-if="isLogin">
            <div class="trust clearfix">
              <span class="contact isTrust" @click="Bus.$emit('contactSomeone',{id:info.id_str})">
                <img src="/static/images/conversation_icon.png" alt=""><i>联系TA</i>
              </span>
              <button class="btn white" v-if="info.isTrust" @click="cancelTrust">取消信任</button>
              <button class="btn green" v-else="" @click="joinTrust">加入信任</button>
            </div>
          </div>
          <div v-else>
            <div class="trust clearfix">
              <span class="contact isTrust" @click="$store.commit({type:'changeLoginForm', data:true})">
                <img src="/static/images/talk.png" alt=""><i>联系TA</i>
              </span>
              <button class="btn green" @click="$store.commit({type:'changeLoginForm', data:true})">加入信任</button>
            </div>
          </div>
        </div>
      </div>
      <div class="sec2">
        <div class="unit"><label>{{info.orderNum}}</label><span title="担保+订单">交易次数</span></div>
        <div class="unit"><label>{{info.volumn}}</label><span>成交量</span></div>
        <div class="unit"><label>{{info.praiseRate}}</label><span>好评率</span></div>
        <div class="unit"><label>{{info.trustedNum}}</label><span>被信任</span></div>
        <div class="unit"><label>{{info.trustNum}}</label><span>信任</span></div>
        <div class="unit"><label>{{info.securedNum}}</label><span>担保</span></div>
      </div>
    </div>
    <!--Tab项-->
    <ul class="menu-tab">
      <li :class="{active:tab===0}" @click="tab=0">他的发布({{saleNum}})</li>
      <li :class="{active:tab===1}" @click="tab=1">收到的评价({{rateNum}})</li>
    </ul>
    <!--发布列表-->
    <Sales :uid="uid" v-show="tab===0"></Sales>
    <!--评价列表-->
    <Rates :uid="uid" v-show="tab===1"></Rates>
    <!--提示弹框-->
    <Alert ref="alert"></Alert>
  </div>
</template>
<script>
  import Sales from './children/Sales';
  import Rates from './children/Rates';
  import Alert from "../common/widget/Alert";
  export default {
    components: {
      Sales,
      Rates,
      Alert,
    },
    data() {
      return {
        uid: "",                // 用户ID
        isOnline: true,       // 是否在线
        info:{                  // 用户信息
          headimg: "/static/images/default_avator.png",
          nickname: "unknown",
          tradeWidthNum: 0,
          orderNum: 0,
          volumn: "-",
          praiseRate: "-",
          trustedNum: 0,
          trustNum: 0,
          securedNum: 0,
          isTrust: 0,
        },

        tab:0,                 // tab项【0-他的发布，1-他的评价】
        rateNum:0,            // 评价数量
        saleNum:0,            // 广告数量
      }
    },
    computed:{
      trustList(){
        return this.$store.state.trustList.map((item)=>{
          return this.JsonBig.stringify(item);
        });
      },
      isLogin(){
        return this.$store.state.isLogin;
      },
      isSelf(){
        if(!this.isLogin) return false;
        return this.JsonBig.stringify(this.$store.state.userInfo.uid)===this.$route.query.uid;
      },
    },
    mounted(){
      this.uid=this.$route.query.uid;
      this.loadTraderInfo();
      this.Bus.$on("onRateTotalUpdate",(num)=>{
        this.rateNum=num;
      });
      this.Bus.$on("onSaleTotalUpdate",(num)=>{
        this.saleNum=num;
      });
    },
    destroyed(){
      this.Bus.$off("onRateTotalUpdate");
      this.Bus.$off("onSaleTotalUpdate");
    },
    watch:{
      isLogin:function(){
        this.loadTraderInfo();
      }
    },
    methods: {
      joinTrust(){
        let uid= this.JsonBig.parse(this.$route.query.uid) || "";
        let loginUid=this.$store.state.userInfo.uid;
        this.WsProxy.send('otc','new_trust',{uid:loginUid, id:uid, trust:1}).then((data)=>{
          this.$refs.alert.showAlert({content:"加入信任成功"});
          this.info.isTrust=1;
          this.$store.commit({type:"newTrust",data:this.JsonBig.stringify(uid)});
        }).catch((msg)=>{
          this.$refs.alert.showAlert({content:"加入信任失败"});
          console.log(msg);
        });
      },
      cancelTrust(){
        let uid= this.JsonBig.parse(this.$route.query.uid) || "";
        let loginUid=this.$store.state.userInfo.uid;
        this.WsProxy.send('otc','new_trust',{uid:loginUid, id:uid, trust:0}).then((data)=>{
          this.$refs.alert.showAlert({content:"取消信任成功"});
          this.info.isTrust=0;
          this.$store.commit({type:"delTrust",data:this.JsonBig.stringify(uid)});
        }).catch((msg)=>{
          this.$refs.alert.showAlert({content:"取消信任失败"});
          console.log(msg);
        });
      },
      loadTraderInfo(){
        let uid= this.JsonBig.parse(this.$route.query.uid) || "";
        if(this.isLogin){
          let loginUid=this.$store.state.userInfo.uid;
          this.WsProxy.send("otc","trader_info",{id:uid, uid:loginUid}).then((data)=>{
            this.parseInfo(data);
          }).catch((msg)=>{
            console.log(msg);
          });
        }else{
          this.Proxy.hp_tradeInfo({id:uid}).then((data)=>{
            this.parseInfo(data.data);
          }).catch((msg)=>{
            console.log(msg);
          });
        }
      },
      parseInfo(data){
        this.info= {
          id: data.id,
          id_str: this.JsonBig.stringify(data.id),
          nickname: data.name || "-",
          headimg: (data.icon && this.HostUrl.http+"image/"+data.icon) || "/static/images/default_avator.png",
          tradeWidthNum: data.mytrade || 0,
          orderNum: data.trade || 0,
          volumn: data.volumes && data.volumes.toString().formatFixed(6)+"+BTC",
          praiseRate: !data.trade?"-":data.rate+"%",
          trustedNum: data.trusted || 0,
          trustNum: data.trust || 0,
          securedNum: data.secured || 0,
          isTrust: data.is_trust || 0,
        }
      },
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  @import "../common/stylus/common";
  .homepage
    margin-bottom: 40px;
    .info-sec
      box-sizing()
      margin-top 25px
      padding 30px
      background-color #FFF
      .sec1
        display flex
        padding-bottom 20px
        border-bottom 1px solid $col1E1
        .info
          flex-grow 1
          display inline-flex
          height 45px
          line-height 45px
          font-size 14px
          letter-spacing 0.16px
          .avatar
            margin-right 20px
            position relative
            >img
              display inline-block
              width 45px
              height 45px
              border-radius 50%
            .online
              display inline-block
              width 11px
              height 11px
              background: #ccc;
              border: 1px solid #FFFFFF;
              border-radius 100%
              position absolute
              bottom 1px
              right 4px
              &.active
                background #ffb422
          .nickname
            color #333333
          .tran_num
            color #FFB422
            margin-left 100px
        .trust
          display flex
          align-items center
          height 45px
          .contact
            display inline-flex
            padding-left 30px
            margin-right 40px
            cursor pointer
            img
              width 18px
              height auto
              align-self center
            i
              margin-left 7px
              line-height 20px
              letter-spacing 0.23px
              font-size 12px
          .btn
            width 90px
            height 25px
            line-height 23px
      .sec2
        height 60px
        display flex
        align-items center
        justify-content space-around
        margin-top 40px
        .unit
          text-align center
          label
            display block
            line-height 30px
            margin-bottom 10px
            font-size 20px
            color #333333
            letter-spacing 0.23px
            font-weight bold
          span
            display block
            line-height 20px
            font-family NotoSansHans-Regular
            font-size 14px
            color #333333
            letter-spacing 0.16px
    .menu-tab
      margin-top 20px
      height 60px
      background-color #FFF
      padding-left 30px
      border-bottom 1px solid #e1e1e1
      >li
        text-align center
        font-size 16px
        letter-spacing 0.33px
        color #999999
        line-height 58px
        float left
        margin-right 13px
        cursor pointer
        min-width 100px
        &.active
          color #FFB422
          border-bottom 2px solid #FFB422
</style>
