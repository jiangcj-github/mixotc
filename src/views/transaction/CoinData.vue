<template>
  <div class="coin-wrap">
    <div class="coin-data inner">
      <h1>
        <router-link to="/transaction">mixOTC</router-link>
        -
        <router-link to="">币种资料</router-link>
        -
        <span>{{currency}}</span>
      </h1>
      <div class="search-box">
        <p><input type="text"
                  placeholder="搜索币种(按首字母排列)"
                  v-model="inputValue"
                  @input="selectData"
                  @click="showResult = true"><button></button>
          <!--@click="getCoinsData"-->
        </p>
        <ul class="search-result" v-if="showResult && inputValue">
          <li v-if="!result.length">暂无搜索结果</li>
          <li v-for="item of result" :key="item" @click="selectResultContent(item)">{{item}}</li>
        </ul>
      </div>
      <div class="coin-content">
        <div class="coin-content-top clearfix">
          <div class="coin-content-left clearfix">
            <img :src="logo" alt="">
            <ol>
              <li>{{currency}}({{name}})</li>
              <li>$66665.020</li>
              <li>
                <router-link to="/transaction">去交易</router-link>
                <!--<router-link to="">去充币</router-link>-->
              </li>
            </ol>
          </div>
          <ul class="coin-content-right clearfix">
            <li><span>市值：</span><b>$21000000</b></li>
            <li><span>发行总量：</span><b>21000000</b></li>
            <li><span>流通量：</span><b>21000000BTC</b></li>
            <li><span>发行价格：</span><b>$21000000</b></li>
            <li><span>发行日期：</span><b>2009-01-09</b></li>
          </ul>
        </div>
        <div class="coin-content-bottom">
          <h2>币种介绍</h2>
          <h3>{{info}}</h3>
          <p>
            <a :href="officialLink" target="_blank">官网</a>
            <a href="blockLink">区块浏览器</a>
            <a href="whitePaper">白皮书</a>
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
        coinDataList: [], //获取币种资料数据
        selectCoinList: [],
        currency: '', // 币种名
        name: '', // 币种全称
        info: '', // 币种信息
        logo: '', // 币种logo
        officialLink: '', // 官网链接
        blockLink: '', // 区块浏览器
        whitePaper: '', // 白皮书
        inputValue: '', // input值
        selectValue: 'btc',
        result: [], // 模糊搜索结果
        showResult: true, // 控制下拉框显示隐藏
        id: '5adc83398bb78e0cea60266d'
      }
    },
    created() {
      this.getCoinsData()
    },
    mounted() {
    },
    methods: {
      async getCoinsData() { // 获取币种资料数据
        // console.log('内容', this.selectValue)
        this.inputValue = '';
        // await this.Proxy.getCoinData({symbolId: this.id}).then(res => {
        //   console.log(res)
        //   // this.coinDataList = res.data.coins;
        //   // console.log('this.coinDataObject', this.coinDataList);
        //   // this.selectCoinList = this.coinDataList.filter(item => {
        //   //   return item.currency == this.selectValue
        //   // });
        //   // // console.log('选择数组', this.selectCoinList)
        //   // this.currency = this.selectCoinList[0].currency.toUpperCase();
        //   // this.name = this.selectCoinList[0].name;
        //   // this.officialLink = this.selectCoinList[0].link
        // })
        await this.Proxy.fetch(
          {
            url: {
              host: '47.74.244.196',
              port: '8081',
              path: '/v1/currency/detail'
            },
            data: {
              method: 'get',
              params: {app: 0, symbolId: this.id, period: '24h'}
            },
          }).then(res => {
          console.log('资料', res.data, this.JsonBig.stringify(res.data.price.cny), this.JsonBig.stringify(res.data.totalValue.cny))

          this.currency = res.data.name // 简称
          this.name = res.data.cnName // 全称
          this.logo = res.data.logo
          this.info = res.data.description // 描述
          this.whitePaper = res.data.whitePaper // 白皮书地址
        }).catch(msg => {
          console.log(msg)
        })
      },
      async selectData() { // 模糊筛选
        this.result = [];
        this.selectValue = this.inputValue;
        // await this.Proxy.searchTips({word: this.selectValue}).then(res => {
        //   console.log('筛选', res)
        //   res.data.currency && res.data.currency.forEach(v => {
        //     this.result.push(v.name)
        //   })
        // })
        await this.Proxy.fetch({
          url: {
            host: '47.74.244.196',
            port: '8081',
            path: '/v1/home/searchTips/'
          },
          data: {
            method: 'get',
            params: {word: this.selectValue}
          },
        }).then(res => {
          console.log(res)
        }).catch(msg => {
          console.log(msg)
        })
      },
      selectResultContent(item) { // 根据筛选结果赋值
        this.selectValue = this.inputValue = item;
        this.showResult = false
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
    margin-top 40px
    margin-bottom 40px
    h1
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
        background-color $col422
    .search-box
      position relative
      width 456px
      height 30px
      margin-left 382px
      p
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
          background url("/static/images/search_icon.png") #FFB422 no-repeat 27px 7px
          background-size 16px 16px
          border-radius 0 2px 2px 0
      /* 币种筛选下拉框 */
      .search-result
        position absolute
        width 453px
        max-height 300px
        margin-top -4px
        background #FFF
        border 1px solid #EEE
        border-top none
        overflow-y auto
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
          background aquamarine
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


</style>
