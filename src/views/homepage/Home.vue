 <template>
  <div class="homepage inner">
    <h2>mixOTC-{{info.nickname}}的个人主页</h2>
    <!-- 个人交易信息 -->
    <div class="info-sec">
      <div class="sec1 clearfix">
        <div class="info">
          <div class="avatar"><img :src="info.headimg" alt="">
            <i class="online" :class="{active:isOnline}"></i>
          </div>
          <span class="nickname">{{info.nickname}}</span>
          <span class="tran_num">和他交易过{{info.tradeWidthNum}}次</span>
        </div>
        <div class="trust clearfix" v-if="info.isTrust">
          <router-link class="contact isTrust" to="" tag="span">
            <img src="/static/images/conversation_icon.png" alt=""><i>联系TA</i>
          </router-link>
          <span class="join-trust isTrust" @click="cancelTrust">
            <i>取消信任</i>
          </span>
        </div>
        <div class="trust clearfix" v-else>
          <span class="contact">
            <img src="/static/images/conversation_icon.png" alt=""><i>联系TA</i>
          </span>
          <span class="join-trust" @click="joinTrust">
            <i>加入信任</i>
          </span>
        </div>
      </div>
      <div class="sec2">
        <div class="unit"><label>{{info.orderNum}}</label><span>订单次数</span></div>
        <div class="unit"><label>{{info.volumn}}</label><span>历史成交量</span></div>
        <div class="unit"><label>{{info.praiseRate}}</label><span>好评率</span></div>
        <div class="unit"><label>{{info.trustedNum}}</label><span>被信任</span></div>
        <div class="unit"><label>{{info.trustNum}}</label><span>信任</span></div>
        <div class="unit"><label>{{info.securedNum}}</label><span>担保</span></div>
      </div>
    </div>
    <!--取消信任弹框-->
    <BasePopup :show="showUntrustPop">
      <div class="pop">取消信任成功</div>
    </BasePopup>
    <!--菜单项tab-->
    <ul class="menu-tab">
        <li :class="{active:tab==0}" @click="tab=0">他的发布</li>
        <li :class="{active:tab==1}" @click="tab=1">收到的评价<i v-if="ratesNum>0">({{ratesNum}})</i></li>
    </ul>
    <!--发布列表-->
    <Sales :uid="uid" v-show="tab==0"></Sales>
    <!--评价列表-->
    <Rates :uid="uid" v-show="tab==1" totalChange="ratesNumChange"></Rates>
  </div>
</template>
<script>
  import Sales from './children/Sales';
  import Rates from './children/Rates';
  import BasePopup from '@/components/common/BasePopup';

  export default {
    components: {
      Sales,
      Rates,
      BasePopup
    },
    data() {
      return {
        loginUid: "",
        uid: "",

        isOnline: true,
        infoOrg:{},
        ratesNum: 0,

        tab:0,  //他的发布，他的评价
        showUntrustPop:false,
      }
    },
    computed:{
      info(){
        let o=this.infoOrg;
        return {
          nickname: o.name || 'unknown',
          headimg: o.icon || '/static/images/default_avator.png',
          tradeWidthNum: o.mytrade || 0,
          orderNum: o.order || 0,
          volumn: (o.volumes || 0)+"+BTC",
          praiseRate: (o.rate || 0) +"%",
          trustedNum: o.trusted || 0,
          trustNum: o.trust || 0,
          securedNum: o.secured || 0,
          isTrust: o.is_trust || false,
        }
      },
    },
    mounted() {
      this.loginUid= this.$store.state.userInfo.uid || "";
      this.uid= this.JsonBig.parse(this.$route.query.uid) || "";
      this.loadTraderInfo();
      this.Bus.$on('ratesNumChange',(num) => {
        this.ratesNum=num;
      });
    },
    methods: {
      joinTrust(){
        this.WsProxy.send('otc','new_trust',{uid:this.loginUid, id:this.uid, trust:1}).then((data)=>{
          this.infoOrg.is_trust=true;
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      cancelTrust(){
        this.WsProxy.send('otc','new_trust',{uid:this.loginUid, id:this.uid, trust:0}).then((data)=>{
          this.showUntrustPop=true;
          setInterval(()=>{
            this.showUntrustPop=false;
          },1000);
          this.infoOrg.is_trust=false;
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadTraderInfo(){
        this.WsProxy.send('otc','trader_info',{
          uid:this.loginUid,
          id:this.uid
        }).then((data)=>{
          this.infoOrg=data;
        }).catch((msg)=>{
          console.log(msg);
        });
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .homepage
    margin-top: 40px;
    margin-bottom: 40px;
    h2
      height 30px
      padding-left 5px
      line-height 30px
      font-size $fz20
      font-weight bold
      color $col333
      letter-spacing 0.41px
      &::before
        display inline-block
        position relative
        top 2px
        left 0
        content ''
        width 3px
        height 20px
        margin-right 10px
        background-color $col422
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
            display inline-block
            width 45px
            height 45px
            margin-right 20px
            border-radius 50%
            background-color skyblue
            position relative
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
              width 20px
              height 20px
            i
              margin-left 10px
              line-height 20px
              letter-spacing 0.23px
              fz11()
            &.isTrust
              color #FFB422
          .join-trust
            background: #FFB422
            border-radius: 2px
            width 90px
            height 25px
            line-height 25px
            text-align center
            cursor pointer
            color: #FFFFFF;
            border 1px solid #FFB422
            &:hover
              background #fea350
            i
              font-size: 13px;
              letter-spacing: 0.29px;
            &.isTrust
              background #fff
              color #FFB422
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
    .pop
      width 100%
      height 100%
      display flex
      justify-content center
      align-items center
      font-size: 14px
      color #333333
      letter-spacing 0.29px
      position relative
      .close
        position absolute
        top 0
        right 0
        font-size 20px
        cursor pointer
        display inline-block
        line-height 24px
        width 24px
        text-align center
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
