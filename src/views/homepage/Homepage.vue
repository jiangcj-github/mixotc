 <template>
  <div class="homepage inner">
    <h2>mixOTC-{{trade_info.nickname}}的个人主页</h2>
    <!-- 个人交易信息 -->
    <div class="info-sec">
      <div class="sec1 clearfix">
        <div class="info">
          <div class="avatar"><img src="" alt=""><i class="is-online"></i></div>
          <span class="nickname">{{trade_info.nickname}}</span>
          <span class="tran_num">和他交易过{{trade_info.trade_with_num}}次</span>
        </div>
        <div class="trust clearfix" v-if="trade_info.is_trust">
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
        <div class="unit"><label>{{trade_info.order_num}}</label><span>订单次数</span></div>
        <div class="unit"><label>{{trade_info.volumn}}</label><span>历史成交量</span></div>
        <div class="unit"><label>{{trade_info.praise_rate}}</label><span>好评率</span></div>
        <div class="unit"><label>{{trade_info.trusted_num}}</label><span>被信任</span></div>
        <div class="unit"><label>{{trade_info.trust_num}}</label><span>信任</span></div>
        <div class="unit"><label>{{trade_info.secured_num}}</label><span>担保</span></div>
      </div>
    </div>
    <!--取消信任弹框-->
    <BasePopup :show="show_untrust_pop">
      <div class="pop">取消信任成功<i class="close" @click="show_untrust_pop=false">&times;</i></div>
    </BasePopup>
    <!--菜单项tab-->
    <ul class="menu-tab">
        <li :class="{active:tab==0}" @click="tab=0">他的发布</li>
        <li :class="{active:tab==1}" @click="tab=1">收到的评价<i>&nbsp;{{rates_num}}</i></li>
    </ul>
    <!--发布列表-->
    <div class="release-list" v-show="tab==0">
      <div class="filter">
        <a class="drop-down" @click="ft_type_show=!ft_type_show" @blur="ft_type_show=false" href="javascript:void(0)">
          {{ft_types[ft_type_sel].text}}
          <ul v-show="ft_type_show" class="drop">
            <li @click="ft_type_sel=i" v-for="(e,i) in ft_types" :key="i">{{e.text}}</li>
          </ul>
        </a>
        <a class="drop-down" @click="ft_coin_show=!ft_coin_show" @blur="ft_coin_show=false" href="javascript:void(0)">
          {{ft_coins[ft_coin_sel].text}}
          <ul v-show="ft_coin_show" class="drop">
            <li @click="ft_coin_sel=i" v-for="(e,i) in ft_coins" :key="i">{{e.text}}</li>
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
      <ReleaseListItem v-for="(item,i) in sales" :key="i" :data="item"></ReleaseListItem>
      <Pagination :total="sales_num" :pageSize="sales_pgsize" emitValue='changeSalesPage'></Pagination>
    </div>
    <!--评价列表-->
    <div class="evaluate-list" v-show="tab==1">
      <EvaluateListItem v-for="(item,i) in rates" :key="i" :data="item"></EvaluateListItem>
      <Pagination :total="rates_num" :pageSize="rates_pgsize" emitValue='changeRatesPage' class="page-bar"></Pagination>
    </div>
  </div>
</template>
<script>
  import ReleaseListItem from './children/ReleaseListItem';
  import EvaluateListItem from './children/EvaluateListItem';
  import Pagination from '@/components/common/Pagination';
  import BasePopup from '@/components/common/BasePopup';
  import WebSocketProxy from '@/api/WebSocketProxy.js';

  export default {
    components: {
      ReleaseListItem,
      EvaluateListItem,
      Pagination,
      BasePopup
    },
    data() {
      return {
        proxy: new WebSocketProxy(this.WebSocket),

        login_uid: this.JsonBig.parse('197102307060486144'),
        uid: this.JsonBig.parse('197113028456484864'),

        trade_info2:{},

        sales2:[],
        sales_num:1,
        sales_pgsize:1,

        rates2:[],
        rates_num:1,
        rates_pgsize:1,

        ft_types:[
          {text:'全部广告',value:''},
          {text:'购买',value:''},
          {text:'出售',value:''},
        ],
        ft_type_sel:0,
        ft_type_show:false,  //下拉框-发布类型

        ft_coins:[
          {text:'全部币种',value:''},
          {text:'BTC',value:''},
          {text:'ETH',value:''},
          {text:'LTC',value:''},
          {text:'其他',value:''},
        ],
        ft_coin_sel:0,
        ft_coin_show:false,  //下拉框-币种

        tab:0,  //他的发布，他的评价
        show_untrust_pop:false,
      }
    },
    computed:{
      trade_info(){
        let o=this.trade_info2;
        return {
          nickname: o.name || 'unknown',
          headimg: o.icon || '/static/images/default_avator.png',
          trade_with_num: o.mytrade || 0,
          order_num: o.trade || 0,
          volumn: "10+BTC" || "0+BTC",
          praise_rate: (o.rate || 0) +"%",
          trusted_num: 100 || 0,
          trust_num: o.trust || 0,
          secured_num: 100 || 0,
          is_trust: o.is_trust || false,
        }
      },
      sales(){
        let arr=[];
        this.sales2.forEach(function(item) {
          arr.push({
            create: new Date(item.create).dateHandle("yyyy/MM/dd hh:mm:ss"),
            type: {1:"购买",2:"出售"}[item.type+""],
            currency: item.currency.toUpperCase(),
            price: {"CNY":"¥"}[item.money.toUpperCase()]+" "+item.price,
            minmax: item.min+"~"+item.max,
            pays: item.payments,
            dead: item.limit+"min",
            info: item.info,
          });
        });
        return arr;
      },
      rates(){
        let arr=[];
        this.rates2.forEach(function(item) {
          arr.push({
            comment: item.comment,
            date: new Date(item.date).dateHandle("yyyy/MM/dd hh:mm:ss"),
            credit: item.credit,
            transit: {1:"差评",2:"中评",3:"好评"}[item.transit],
            icon: item.icon,
            name: item.name,
          });
        });
        return arr;
      }
    },
    mounted() {
      //this.login_uid=this.JsonBig.stringify(this.$store.state.userInfo.uid);
      this.proxy.send('otc','trader_info',{uid:this.login_uid, id:this.uid}).then((data)=>{
        this.trade_info2=data;
      });
      this.proxy.send('otc','his_sales',{id:this.login_uid, origin:0}).then((data)=>{
        this.sales2=data.sales;
        this.sales_num=1;
        this.sales_pgsize=data.count;
      });
      this.proxy.send('otc','rates',{id:this.uid, origin:0}).then((data)=>{
        this.rates2=data.rates;
        this.rates_num=1;
        this.rates_pgsize=data.count;
      });
      //翻页事件
      this.Bus.$on('changeSalesPage',(p) => {
        this.proxy.send('otc','his_sales',{id:this.login_uid, origin:p}).then((data)=>{
          this.sales2=data.sales;
          this.sales_num=100;
          this.sales_pgsize=data.count;
        });
      });
      this.Bus.$on('changeRatesPage',(p) => {
        this.proxy.send('otc','rates',{id:this.uid, origin:p}).then((data)=>{
          this.rates2=data.rates;
          this.rates_num=1;
          this.rates_pgsize=data.count;
        });
      });
    },
    methods: {
      joinTrust(){
        this.proxy.send('otc','new_trust',{uid:this.login_uid, id:this.uid}).then((data)=>{
          this.trade_info2.is_trust=true;
        })
      },
      cancelTrust(){
        this.proxy.send('otc','new_trust',{uid:this.login_uid, id:this.uid}).then((data)=>{
          this.show_untrust_pop=true;
          this.trade_info2.is_trust=false;
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
            &:hover
              background #f1a45c
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
