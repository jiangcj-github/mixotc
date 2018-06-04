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
      <div class="search-box">
        <p :class="{'active-btn': showActive}">
          <input type="text"
                 placeholder="搜索币种"
                 v-model.trim="inputValue"
                 @input="getCoinInfo"
                 @keyup.enter="getCoinsData()"
                 @focus="(showActive=true) && (canCancel=true)"
                 @blur="blurInput"
                 @click="showResult = true"><button @click="getCoinsData()"></button>
          <img src="/static/images/cancel_icon.png" alt="" v-show="canCancel && inputValue" @mousedown="inputValue=''">
        </p>
        <ul class="search-result" v-if="showResult && inputValue"  v-clickoutside="closeSelect">
          <li v-if="!result.length">{{nothingText}}</li>
          <li v-for="(item,index) of result" :key="index" @click="selectResultContent(item)">{{item}}</li>
          <!--@click="selectResultContent(item)"-->
        </ul>
      </div>
      <div class="coin-content">
        <div class="coin-content-top clearfix">
          <div class="coin-content-left clearfix">
            <img :src="coinDataObj.logo" alt="">
            <ol>
              <li>{{coinDataObj.name}}({{coinDataObj.cnName}})</li>
              <li>{{coinDataObj.price && (coinDataObj.price.cny === 0 ? '-' : (coinDataObj.price.cny * 1).format('cny'))}}</li>
              <li>
                <router-link :to="{path:'/transaction', query:{currency: selectCoinList[0] && selectCoinList[0].currency, name: selectCoinList[0] && selectCoinList[0].name, icon: selectCoinList[0] && selectCoinList[0].icon}}">去交易</router-link>
                <!--<span @click="goRecharge">去充币</span>-->
                <!--<router-link to="">去充币</router-link>-->
              </li>
            </ol>
          </div>
          <ul class="coin-content-right clearfix">
            <li><span>市值：</span><b>{{coinDataObj.totalValue && (coinDataObj.totalValue.cny === 0 ? '-' : (coinDataObj.totalValue.cny * 1).format('cny'))}}</b></li>
            <li><span>发行总量：</span><b>{{coinDataObj.totalVolume && coinDataObj.totalVolume.format()}}</b></li>
            <li><span>流通量：</span><b>{{coinDataObj.circulationVolume && coinDataObj.circulationVolume.format()}}</b></li>
            <li><span>发行价格：</span><b>{{coinDataObj.icoPrice && (coinDataObj.icoPrice.cny === 0 ? '-' : (coinDataObj.icoPrice.cny * 1).format('cny'))}}</b></li>
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
        coinDataObj: {}, // 获取币种资料数据
        coinDataList: [], // 筛选所结有数据
        selectCoinList: [], // 筛选币种数组
        inputValue: '', // input值
        selectValue: 'btc',
        result: [], // 模糊搜索结果
        showResult: true, // 控制下拉框显示隐藏
        id: '',
        nothingText: '', // 无搜索结果提示文字
        showActive: false,
        canCancel: false
      }
    },
    async created() {
      this.selectValue = this.$route.query.coin || "btc";
      await this.getCoinInfo()
      this.getCoinsData();
    },
    mounted() {
    },
    methods: {
      async getCoinInfo() {
        this.nothingText = '加载中...'
        this.result = [];
        this.inputValue && (this.selectValue = this.inputValue);
        await this.Proxy.coinSearch({keyword: this.selectValue}).then(res => { // 模糊搜索
          // console.log('币种资料', res)
          // console.log('搜索币种资料', this.selectValue, res)
          if (!res.data.coins) {
            this.nothingText = '暂无数据'
            return
          }
          this.coinDataList = res.data.coins
          res.data.coins && res.data.coins.forEach(v => {
            this.result.push(v.name)
          })
        });
        await this.Proxy.searchTips({word: this.selectValue, app: 0}).then(res => { // 获取币种ID
          this.id = res.data.currency[0].id;
          // console.log('搜索this.selectValue', this.selectValue, this.id )
        }).catch(msg => {
          console.log(msg)
        })
        this.selectCoinList = this.coinDataList
        // console.log(1111, this.coinDataList, this.selectCoinList)
      },


      async selectResultContent(item) { // 根据筛选结果赋值
        this.selectValue = this.inputValue = item;
        this.showResult = false
        await this.Proxy.searchTips({word: this.selectValue, app: 0}).then(res => { // 获取币种ID
          this.id = res.data.currency[0].id;
          this.selectCoinList = this.coinDataList.filter(item => { // 获取图片
            return item.name == this.selectValue
          });
          //console.log('搜索this.selectValue5555', this.selectValue, this.id, this.selectCoinList )
        }).catch(msg => {
          console.log(msg)
        })
        this.getCoinsData()
      },

      async getCoinsData() { // 获取币种资料数据
        //this.inputValue = '';
        await this.Proxy.getCoinDataAll({app: 0, symbolId: this.id, period: '24h'}).then(res => {
          // console.log('资料', res, this.JsonBig.stringify(res.data.price.cny))
          this.coinDataObj = res.data
          this.coinDataObj.logo = `${this.HostUrl.http}image/${this.selectCoinList[0].icon}`
        }).catch(msg => {
          console.log(msg)
        })
      },

      blurInput() {
        this.showActive = false
        this.canCancel = false
      },
      closeSelect() {
        this.showResult = false
      }
      // goRecharge() {
      //   if (!this.$store.state.isLogin) {
      //     this.$store.commit({type: 'changeLoginForm', data: true});
      //     return;
      //   }
      // }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";

  .coin-wrap
    width 100%
    background-color #FFF

  .coin-data
    margin-top 10px
    margin-bottom 40px
    h1
      font-size 12px
      color #333
      letter-spacing 0.25px
      margin-bottom 20px
      a:hover
        color $col422
    /*h1
      font-size $fz20
      font-weight bold
      color $col333
      margin-bottom 56px
      &:before
        display inline-block
        width 3px
        height 20px
        position relative
        top 2px
        left 0
        content ''
        margin-right 9px
        background-color $col422*/
    .search-box
      position relative
      width 456px
      height 30px
      margin-left 382px
      p
        position relative
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
        width 453px
        max-height 200px
        margin-top -4px
        background #FFF
        border 1px solid #EEE
        border-top none
        overflow-y auto
        z-index 2
        li
          font-size 12px
          padding 3px
          cursor pointer
          &:hover
            background-color $col3EB
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
      /*a:last-child*/
      /*padding 5px 10px*/
      /*font-size 13px*/
      /*color #FFB422*/
      /*letter-spacing 0.27px*/
      /*border 1px solid #FFB422*/
      /*border-radius 2px*/
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
