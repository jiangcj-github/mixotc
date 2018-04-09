 <template>
  <div class="homepage inner">
    <h2>mixOTC-{{nickname}}的个人主页</h2>
    <!-- 个人交易信息 -->
    <div class="info-sec">
      <div class="sec1 clearfix">
        <div class="info">
          <div class="avatar"><img src="" alt=""><i class="is-online"></i></div>
          <span class="nickname">{{nickname}}</span>
          <span class="tran_num">和他交易过{{tran_num}}次</span>
        </div>
        <div class="trust clearfix" v-if="is_trust">
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
        <div class="unit"><label>{{order_num}}</label><span>订单次数</span></div>
        <div class="unit"><label>{{volumn}}</label><span>历史成交量</span></div>
        <div class="unit"><label>{{praise_rate}}</label><span>好评率</span></div>
        <div class="unit"><label>{{be_trusted}}</label><span>被信任</span></div>
        <div class="unit"><label>{{trust}}</label><span>信任</span></div>
        <div class="unit"><label>{{guarantee}}</label><span>担保</span></div>
      </div>
    </div>
    <!--取消信任弹框-->
    <BasePopup :show="cancel_trust_pop">
      <div class="pop">取消信任成功<i class="close" @click="hideTrustPopup">&times;</i></div>
    </BasePopup>
    <!--菜单项tab-->
    <ul class="menu-tab">
        <li :class="{active:tab==0}" @click="toggleTab(0)">他的发布</li>
        <li :class="{active:tab==1}" @click="toggleTab(1)">收到的评价<i>&nbsp;{{evaluate_num}}</i></li>
    </ul>
    <!--发布列表-->
    <div class="release-list" v-show="tab==0">
      <div class="filter">
        <a class="drop-down" @click="toggleFilterTypes" @blur="hideFilterTypes" href="javascript:void(0)">
          {{flt_types[flt_type_sel].text}}
          <ul v-show="flt_type_show" class="drop">
            <li @click="selectFilterType(i)" v-for="(e,i) in flt_types">{{e.text}}</li>
          </ul>
        </a>
        <a class="drop-down" @click="toggleFilterCoins" @blur="hideFilterCoins" href="javascript:void(0)">
          {{flt_coins[flt_coin_sel].text}}
          <ul v-show="flt_coin_show" class="drop">
            <li @click="selectFilterCoin(i)" v-for="(e,i) in flt_coins">{{e.text}}</li>
          </ul>
        </a>
      </div>
      <ul class="head">
        <li class="time"></li>
        <li class="type">广告类型</li>
        <li class="coin">币种</li>
        <li class="price">报价</li>
        <li class="limit">订单限额</li>
        <li class="pay-method">支付方式</li>
        <li class="pay-time">订单期限</li>
        <li class="operation">操作</li>
      </ul>
      <ReleaseListItem v-for="(item,i) in releases" :key="i" :item="item"></ReleaseListItem>
      <Pagination :total="75" emitValue='changeReleasePage'></Pagination>
    </div>
    <!--评价列表-->
    <div class="evaluate-list" v-show="tab==1">
      <EvaluateListItem v-for="(item,i) in evaluates" :key="i" :item="item"></EvaluateListItem>
      <Pagination :total="20" emitValue='changeEvaluatePage' class="page-bar"></Pagination>
    </div>
  </div>
</template>
<script>
  import ReleaseListItem from './children/ReleaseListItem';
  import EvaluateListItem from './children/EvaluateListItem';
  import Pagination from '@/components/common/Pagination';
  import BasePopup from '@/components/common/BasePopup';

  export default {
    components: {
      ReleaseListItem,
      EvaluateListItem,
      Pagination,
      BasePopup
    },
    data() {
      return {
        uid:'xxxx',
        self_uid:'xxxx',

        nickname: 'xin2378',
        tran_num: 3,
        is_trust: false,
        order_num:100,
        volumn:1+'+BTC',
        praise_rate:90+'%',
        be_trusted:100,
        trust:100,
        guarantee:100,
        evaluate_num:100,
        pay_methods:[
          {key:'zfb',str:'支付宝',img:''},
          {key:'wx',str:'微信',img:''},
          {key:'yhk',str:'银行卡',img:''},
        ],
        releases:[
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
          {time:'2016/03/09 13:43:30',type:'购买',coin:'BTC',price:'123',currency:'¥',min_limit:200,max_limit:1000,pay_method:[0,1,2],deadline:'10min',remark:'经常在线，可以快速买卖。。。。。'},
        ],
        evaluates:[
          {time:'2016/03/08 23:57:03',text:'速度一般～～～～其实有点慢，价钱也不是很低！！！！',judge:'好评',heart_num:4,nickname:'xin2378',headimg:''},
          {time:'2016/03/08 23:57:03',text:'速度一般～～～～其实有点慢，价钱也不是很低！！！！',judge:'好评',heart_num:4,nickname:'xin2378',headimg:''},
          {time:'2016/03/08 23:57:03',text:'速度一般～～～～其实有点慢，价钱也不是很低！！！！',judge:'好评',heart_num:4,nickname:'xin2378',headimg:''},
          {time:'2016/03/08 23:57:03',text:'速度一般～～～～其实有点慢，价钱也不是很低！！！！',judge:'好评',heart_num:4,nickname:'xin2378',headimg:''},
          {time:'2016/03/08 23:57:03',text:'速度一般～～～～其实有点慢，价钱也不是很低！！！！',judge:'好评',heart_num:4,nickname:'xin2378',headimg:''},
          {time:'2016/03/08 23:57:03',text:'速度一般～～～～其实有点慢，价钱也不是很低！！！！',judge:'好评',heart_num:4,nickname:'xin2378',headimg:''},
        ],

        flt_types:[
          {text:'全部广告',value:''},
          {text:'购买',value:''},
          {text:'出售',value:''},
        ],
        flt_type_sel:0,
        flt_type_show:false,
        flt_coins:[
          {text:'全部币种',value:''},
          {text:'BTC',value:''},
          {text:'ETH',value:''},
          {text:'LTC',value:''},
          {text:'其他',value:''},
        ],
        flt_coin_sel:0,
        flt_coin_show:false,
        tab:0,
        cancel_trust_pop:false,
      }
    },
    mounted() {
      this.Bus.$on('changeReleasePage',(p) => {
        console.log(p);
      });
      this.Bus.$on('changeEvaluatePage',(p) => {
        console.log(p);
      });
    },
    methods: {
      toggleFilterTypes(){
        this.flt_type_show=!this.flt_type_show;
      },
      hideFilterTypes(){
        this.flt_type_show=false;
      },
      selectFilterType(i){
        this.flt_type_sel=i;
      },
      toggleFilterCoins(){
        this.flt_coin_show=!this.flt_coin_show;
      },
      hideFilterCoins(){
        this.flt_coin_show=false;
      },
      selectFilterCoin(i){
        this.flt_coin_sel=i;
      },
      toggleTab(i){
        this.tab=i;
      },
      joinTrust(){
        this.is_trust=true;
      },
      cancelTrust(){
        this.is_trust=false;
        this.cancel_trust_pop=true;
      },
      hideTrustPopup(){
        this.cancel_trust_pop=false;
      }
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
            .is-online
              display inline-block
              width 11px
              height 11px
              background: #FFB422;
              border: 1px solid #FFFFFF;
              border-radius 100%
              position absolute
              bottom 1px
              right 4px
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
      >li
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
    .release-list
      .head
        height 50px
        line-height 50px
        font-size 13px
        color #999999
        letter-spacing 0.27px
        padding 0 30px
        >li
          display inline-block
      .filter
        margin-top 1px
        height 50px
        background-color #FFF
        padding-left 30px
        >a
          display inline-block
          line-height 50px
          font-size 13px
          letter-spacing 0.27px
          width 65px
          text-align center
          &.drop-down
            position relative
            margin-right 45px
            cursor pointer
            &::after
              content ''
              display block
              width 0
              height 0
              border-top 5px solid #333333
              border-left 5px solid transparent
              border-right 5px solid transparent
              position absolute
              right -15px
              top 50%
              margin-top -3px
            &:hover .drop
              display block
            .drop
              position absolute
              top 40px
              left 0
              background #FFFFFF
              border 1px solid #E1E1E1
              width 80px
              z-index 1000
              >li
                float none
                text-align center
                height 30px
                line-height 30px
                &:hover
                  background #FFF3EB
      .time
        width 200px
      .type
        width 100px
      .coin
        width 100px
      .price
        width 100px
      .limit
        width 200px
      .pay-method
        width 150px
      .pay-time
        width 100px
      .operation
        width 150px
    .evaluate-list
      margin-bottom 0
      .page-bar
        margin-top 20px
</style>
