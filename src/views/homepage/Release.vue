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
        <div class="trust clearfix">
          <router-link class="contact" to="" tag="span">
            <img :src="require(`@/assets/images/conversation_icon.png`)" alt=""><i>联系TA</i>
          </router-link>
          <router-link class="join-trust" to="" tag="span">
            <i>加入信任</i>
          </router-link>
        </div>
      </div>
      <div class="sec2">
        <div class="unit"><label>123</label><span>订单次数</span></div>
        <div class="unit"><label>1.00+BTC</label><span>历史成交量</span></div>
        <div class="unit"><label>90%</label><span>好评率</span></div>
        <div class="unit"><label>30</label><span>被信任</span></div>
        <div class="unit"><label>10</label><span>信任</span></div>
        <div class="unit"><label>5</label><span>担保</span></div>
      </div>
    </div>
    <!--菜单项tab-->
    <div class="menu-tab">
      <ul class="head">
        <li class="active">他的发布</li>
        <li>收到的评价<i>12234</i></li>
      </ul>
      <ul class="filter">
          <li class="drop-down">
            全部广告
            <ul class="drop">
              <li>全部广告</li>
              <li>购买</li>
              <li>出售</li>
            </ul>
          </li>
          <li class="drop-down">
            全部币种
            <ul class="drop">
              <li>全部币种</li>
              <li>BTC</li>
              <li>ETH</li>
              <li>LTC</li>
              <li>其他</li>
            </ul>
          </li>
      </ul>
    </div>
    <!--发布列表-->
    <div class="release-list">
      <div class="head">
        <span class="time"></span>
        <span class="type">广告类型</span>
        <span class="coin">币种</span>
        <span class="price">报价</span>
        <span class="limit">订单限额</span>
        <span class="pay-method">支付方式</span>
        <span class="pay-time">订单期限</span>
        <span class="operation">操作</span>
      </div>
      <div class="li">
        <div class="booth">
          <span class="time">2016/03/09 13:43:30</span>
          <span class="type">购买</span>
          <span class="coin">BTC</span>
          <span class="price">¥ 123</span>
          <span class="limit">200.00~10000.00</span>
          <span class="pay-method">
            <img :src="require(`@/assets/images/OTC_zhifubao.png`)" alt=""/>
            <img :src="require(`@/assets/images/OTC_wechat.png`)" alt=""/>
            <img :src="require(`@/assets/images/OTC_Bankcard.png`)" alt=""/>
          </span>
          <span class="pay-time">10min</span>
          <span class="operation">
             <router-link class="buy-to" to="" tag="span">
               <i>向他购买</i>
             </router-link>
          </span>
        </div>
        <div class="division"></div>
        <div class="remark">备注：经常在线，可以快速买卖。。。。。</div>
      </div>
      <div class="li">
        <div class="booth">
          <span class="time">2016/03/09 13:43:30</span>
          <span class="type">购买</span>
          <span class="coin">BTC</span>
          <span class="price">¥ 123</span>
          <span class="limit">200.00~10000.00</span>
          <span class="pay-method">
            <img :src="require(`@/assets/images/OTC_zhifubao.png`)" alt=""/>
            <img :src="require(`@/assets/images/OTC_wechat.png`)" alt=""/>
            <img :src="require(`@/assets/images/OTC_Bankcard.png`)" alt=""/>
          </span>
          <span class="pay-time">10min</span>
          <span class="operation">
             <router-link class="buy-to" to="" tag="span">
               <i>向他购买</i>
             </router-link>
          </span>
        </div>
        <div class="division"></div>
        <div class="remark">备注：经常在线，可以快速买卖。。。。。</div>
      </div>
      <div class="li">
        <div class="booth">
          <span class="time">2016/03/09 13:43:30</span>
          <span class="type">购买</span>
          <span class="coin">BTC</span>
          <span class="price">¥ 123</span>
          <span class="limit">200.00~10000.00</span>
          <span class="pay-method">
            <img :src="require(`@/assets/images/OTC_zhifubao.png`)" alt=""/>
            <img :src="require(`@/assets/images/OTC_wechat.png`)" alt=""/>
            <img :src="require(`@/assets/images/OTC_Bankcard.png`)" alt=""/>
          </span>
          <span class="pay-time">10min</span>
          <span class="operation">
             <router-link class="buy-to" to="" tag="span">
               <i>向他购买</i>
             </router-link>
          </span>
        </div>
        <div class="division"></div>
        <div class="remark">备注：经常在线，可以快速买卖。。。。。</div>
      </div>
    </div>

  </div>

</template>
<script>
  export default {
    data() {
      return {
        nickname: 'xin2378',
        tran_num: 3,
      }
    },
    methods: {

    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .homepage
    margin-top 40px
    margin-bottom 40px
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
          .join-trust
            background: #FFB422
            border-radius: 2px
            width 90px
            height 25px
            line-height 25px
            text-align center
            cursor pointer
            i
              font-size: 13px;
              color: #FFFFFF;
              letter-spacing: 0.29px;
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
      .head
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
      .filter
        margin-top 1px
        height 50px
        background-color #FFF
        padding-left 30px
        >li
          float left
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
            .drop
              display none
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


    .release-list
      .head
        height 50px
        line-height 50px
        font-size 13px
        color #999999
        letter-spacing 0.27px
        padding 0 30px
        span
          display inline-block
      .li
        padding 20px 30px 0 30px
        background #fff
        border 1px solid #E1E1E1
        margin-bottom 10px
        span
          display inline-block
        .booth
          font-size 13px
          color #333333
          letter-spacing 0.27px
          height 67px
          line-height 67px
          .type
            color #57A100
          .operation .buy-to
              width 100px
              height 25px
              line-height 25px
              background #FFB422
              border 1px solid #FFB422
              border-radius 2px
              font-size: 13px;
              color: #FFFFFF;
              letter-spacing: 0.27px;
              text-align center
              cursor pointer
        .division
          height 1px
          background: #E1E1E1;
        .remark
          height 50px
          line-height 50px
          font-size: 13px;
          color: #999999;
          letter-spacing: 0.23px;
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
</style>
