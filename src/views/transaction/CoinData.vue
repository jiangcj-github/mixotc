<template>
  <div class="coin-wrap">
    <div class="coin-data inner">
      <h1>
        <router-link to="/transaction">mixOTC</router-link>
        -
        <router-link to="/coinData">币种资料</router-link>
        -
        <span>{{coinDataObj.name}}</span>
      </h1>
      <div class="search-box" v-clickoutside="closeSelect">
        <p :class="{'active-btn': showActive}">
          <input type="text"
                 placeholder="搜索币种"
                 v-model.trim="inputValue"
                 @input="getCoinInfo"
                 @keyup.enter="getCoinsData"
                 @focus="focusInput"
                 @blur="blurInput"><button @click="getCoinsData()"></button>
          <img src="/static/images/cancel_icon.png" alt="" v-show="canCancel && inputValue" @mousedown="inputValue=''">
        </p>
        <ul class="search-result" v-if="showResult">
          <li v-if="!result.length">{{nothingText}}</li>
          <!--<li v-for="(item,index) of result" :key="index" @click="selectResultContent(item)">{{item}}</li>-->
          <li v-for="(item,index) of result" :key="index" @click="selectResultContent(index)">
            <img :src="`${HostUrl.http}image/${item.icon}`">
            <span>{{item.currency}}</span>
            <b>{{item.name}}</b>
          </li>
        </ul>
      </div>
      <div class="coin-content">
        <div class="coin-content-top clearfix">
          <div class="coin-content-left clearfix">
            <img :src="coinDataObj.logo" alt="">
            <ol>
              <li>{{coinDataObj.name && coinDataObj.name.toUpperCase()}}({{coinDataObj.cnName}})</li>
              <li>{{coinDataObj.price && (coinDataObj.price.cny === 0 ? '-' : (coinDataObj.price.cny * 1).format('cny'))}}</li>
              <li>
                <router-link :to="{path:'/transaction', query:{currency: resultObj.currency, name: resultObj.name, icon: resultObj.icon}}">去交易</router-link>
                <span @click="goRecharge">去充币</span>
              </li>
            </ol>
          </div>
          <ul class="coin-content-right clearfix">
            <li><span>市值：</span><b>{{coinDataObj.totalValueCN && (coinDataObj.totalValueCN === 0 ? '-' : (coinDataObj.totalValueCN * 1).format('cny'))}}</b></li>
            <li><span>发行总量：</span><b>{{coinDataObj.totalVolume && coinDataObj.totalVolume.format()}}</b></li>
            <li><span>流通量：</span><b>{{coinDataObj.circulationVolume && coinDataObj.circulationVolume.format()}}</b></li>
            <li><span>发行价格：</span><b>{{coinDataObj.icoPriceCN && (coinDataObj.icoPriceCN === 0 ? '-' : (coinDataObj.icoPriceCN * 1).format('cny'))}}</b></li>
            <li><span>发行日期：</span><b>{{coinDataObj.releaseTime && coinDataObj.releaseTime.toDate('yyyy/MM/dd')}}</b></li>
          </ul>
        </div>
        <div class="coin-content-bottom">
          <h2>币种介绍</h2>
          <h3>{{coinDataObj.description}}</h3>
          <p>
            <a :href="coinDataObj.webSite && coinDataObj.webSite[0]" target="_blank">官网</a>
            <a :href="coinDataObj.blockSites && coinDataObj.blockSites[0]" target="_blank">区块浏览器</a>
            <a :href="coinDataObj.whitePaper" target="_blank">白皮书</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "coin-data",
    data() {
      return {
        coinDataObj: {}, // 获取币种资料数据-交易所接口
        inputValue: '', // input值
        result: [], // 模糊搜索结果
        resultObj: {}, //币种选择结果-otc接口
        showResult: false, // 控制下拉框显示隐藏
        nothingText: '', // 无搜索结果提示文字
        showActive: false,
        canCancel: false
      }
    },
    async created() {
      this.inputValue = this.$route.query.coin || "btc";
      await this.getCoinInfo();
      this.getCoinsData();
    },
    mounted() {
    },
    methods: {
      async getCoinInfo() {
        this.nothingText = '加载中...';
        this.result = [];
        await this.Proxy.coinSearch({keyword: this.inputValue}).then(res => { // 模糊搜索
          if (!res.data.coins || res.data.coins.length<=0) {
            this.nothingText = '暂无数据';
            return
          }
          this.result = res.data.coins;
        });
      },

      async selectResultContent(i) { // 根据筛选结果赋值
        this.inputValue = this.result[i].currency;
        this.getCoinsData();
      },

      async getCoinsData() { // 获取币种资料数据
        let obj=this.result.filter(e=>e.currency.toLowerCase()===this.inputValue.toLowerCase())[0];
        obj = obj || this.result[0] || {name: "Bitcoin", icon: "B012F109359B4872", currency: "btc",};
        this.resultObj = obj;
        this.inputValue = obj.currency;
        this.showResult = false;
        await this.Proxy.getCoinDataAll({action: 'ci', data:{cf:obj.currency.toLowerCase()}}).then(res => {
          this.coinDataObj = res.data
          this.coinDataObj.logo = `${this.HostUrl.http}image/${this.resultObj.icon}`
        }).catch(msg => {
          console.log(msg)
        })
      },
      focusInput() {
        this.canCancel = true;
        this.showActive = true;
        this.showResult = true;
        this.getCoinInfo();
      },
      blurInput() {
        this.showActive = false;
        this.canCancel = false;
      },
      closeSelect() {
        this.showResult = false;
      },
      goRecharge() {
        if (!this.$store.state.isLogin) {
          this.$store.commit({type: 'changeLoginForm', data: true});
          return;
        }
        this.$router.push({path: '/wallet/charge', query: {coin: this.coinDataObj.name.toLowerCase()}})
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";

  .coin-wrap
    width 100%
    height 100%
    background-color #FFF

  .coin-data
    height 100%
    margin-top 10px
    margin-bottom 40px
    h1
      font-size 12px
      color #333
      letter-spacing 0.25px
      margin-bottom 20px
      a:hover
        color $col422
    .search-box
      position relative
      width 456px
      height 30px
      margin-left 382px
      p
        position relative
        height 30px
        input
          width 374px
          height 28px
          padding-left 10px
          border 1px solid #E1E1E1
          border-right none
          border-radius 2px 0 0 2px
          vertical-align top
        button
          width 70px
          height 30px
          background url("/static/images/search_icon.png") #E1E1E1 no-repeat 27px 7px
          background-size 16px 16px
          border-radius 0 2px 2px 0
          cursor pointer
        img
          position absolute
          right 80px
          top 9px
          cursor pointer
      .active-btn
        input
          border 1px solid $col422
        button
          background url("/static/images/search_icon.png") $col422 no-repeat 27px 7px
      /* 币种筛选下拉框 */
      .search-result
        position absolute
        width 454px
        max-height 240px
        margin-top 0
        background #FFF
        border 1px solid #EEE
        border-top none
        overflow-y auto
        z-index 2
        li
          height 30px
          line-height 30px
          font-size 14px
          padding 0 12px
          cursor pointer
          &:hover
            background-color $col3EB
          img
            width 20px
            height 20px
            margin-right 5px
            vertical-align -5px
          span
            display inline-block
            margin-right 5px
          b
            font-size 12px
            color #999
    .coin-content
      margin-top 58px
      margin-left 70px
      .coin-content-top
        margin-bottom 40px
      .coin-content-left
        float left
        &:before
          display inline-block
          width 1px
          height 100px
          position relative
          top 0
          left 0
          content ''
          margin-right 30px
          background-color #EEE
        img
          float left
          width 66px
          height 66px
          border-radius 50%
          margin-right 30px
        ol
          float left
          margin-right 31px
          li:first-child
            font-size 18px
            margin-bottom 20px
          li:nth-child(2)
            font-size 28px
            color #FFB422
            letter-spacing 0.3px
            margin-bottom 26px
          li:last-child
            a:first-child
              font-size 13px
              color #FFB422
              letter-spacing 0.27px
              text-decoration underline
              margin-right 20px
              &:hover
                color $col350
            span
              padding 2px 5px
              font-size 13px
              color #FFB422
              letter-spacing 0.27px
              border 1px solid #FFB422
              border-radius 2px
              cursor pointer
              &:hover
                background #FFB422
                color #FFF
      .coin-content-right
        float left
        width 630px
        li
          float left
          width 210px
          margin-bottom 28px

      .coin-content-bottom
        h2
          margin-bottom 20px
          font-size 20px
          letter-spacing 0.23px
        h3
          font-size 14px
          letter-spacing 0.16px
          line-height 20px
          margin-bottom 40px
        p
          a
            display inline-block
            padding 10px 25px
            margin-right 20px
            background #FFB422
            color #FFF
            border-radius 2px
            &:hover
              background $col350


</style>
