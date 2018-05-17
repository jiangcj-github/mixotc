<template>
  <div class="accont">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="1"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <div class="asset">
            <p class="l1">
              <span class="big">总资产约：</span>
              <span class="big bright">1.000000</span>
              <span class="small">BTC</span>
              <span class="big">/</span>
              <span class="big bright">666666</span>
              <span class="small">CNY</span>
            </p>
            <p class="l2">
              <span class="quota">24h提币额度：20 BTC</span>
              <span class="used">已用：0 BTC</span>
            </P>
          </div>
          <div class="filter">
            <div class="f1">
              <input type="text" placeholder="搜索币种">
              <img src="/static/images/cancel_icon.png">
              <button @click=""></button>
            </div>
            <div class="f2">
              <span class="radio check r1">隐藏小额资产</span>
              <span class="radio check r2">隐藏0余额币种</span>
              <span class="radio check r3">隐藏非钱包币种</span>
            </div>
          </div>
          <div class="tb-tab">
            <ul>
              <li class="active">mixOTC法币账户</li>
              <li>币币账户</li>
            </ul>
            <button>币币交易</button>
          </div>
          <!--法币账户-->
          <div class="fb" v-if="1">
            <div class="thead">
              <p class="coin">币种</p>
              <p class="name">全称</p>
              <p class="avail sortable">可用余额<i class="sort up"></i></p>
              <p class="frozen sortable">冻结中余额<i class="sort up"></i></p>
              <p class="confirm sortable">确认中余额<i class="sort up"></i></p>
              <p class="total sortable">总额<i class="sort up"></i></p>
              <p class="assess sortable">估值<i class="sort up"></i></p>
              <p class="opera">操作</p>
            </div>
            <div class="li">
              <p class="coin"><img src="">BTC</p>
              <p class="name">Bitcoin</p>
              <p class="avail">0.0001</p>
              <p class="frozen">0.0001</p>
              <p class="confirm">0.0001</p>
              <p class="total">0.0001</p>
              <p class="assess">0.0001</p>
              <p class="opera op1">
                <button>充币</button>
                <button>提币</button>
                <button>交易</button>
              </p>
            </div>
            <div class="li">
              <p class="coin"><img src="">BTC</p>
              <p class="name">Bitcoin</p>
              <p class="avail">0.0001</p>
              <p class="frozen">0.0001</p>
              <p class="confirm">0.0001</p>
              <p class="total">0.0001</p>
              <p class="assess">0.0001</p>
              <p class="opera op2">
                <button>加入钱包</button>
                <a href="#">查看币种资料</a>
              </p>
            </div>
          </div>
          <!--币币账户-->
          <div class="bb" v-else="">
            <div class="thead">
              <p class="coin">币种</p>
              <p class="name">全称</p>
              <p class="avail sortable">可用余额<i class="sort up"></i></p>
              <p class="frozen sortable">冻结中余额<i class="sort up"></i></p>
              <p class="confirm sortable">确认中余额<i class="sort up"></i></p>
              <p class="total sortable">总额<i class="sort up"></i></p>
              <p class="assess sortable">估值<i class="sort up"></i></p>
              <p class="opera">操作</p>
            </div>
            <div class="li">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  export default {
    components: {
      Notify,
      LeftBar,
    },
    data() {
      return {

      }
    },
    methods:{

    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/account"
</style>
