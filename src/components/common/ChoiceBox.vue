<template>
  <div class="choice-box" v-clickoutside="closeSelect" :style="{width: `${widthWrap}px`}" :class="{'is-disabled': showDisabled}">
    <b @click="showChoice()" :class="`${choiceClass}`" :style="{width: `${width}px`}">{{items}}</b>
    <ul v-show="show" :style="{width: `${widthSelect}px`, top: `${top}px`}">
      <li v-for="(content, index) in classify" @click="changeSelect(content, index)" :key="index" :class="{active:(index === selectNum && isActive)}">{{content}}</li>
      <router-link to="/wallet/account" tag="li" v-show="createWallet">创建钱包</router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      classify: Array, //下拉框内容
      title: String, //显示内容
      isExchange: {
        type: Boolean,
        default: true
      }, // 是否替换显示内容
      showDisabled: {
        type: Boolean,
        default: false
      },
      createWallet: { // 是否显示创建钱包
        type: Boolean,
        default: false
      },
      choiceClass: String,
      width: {
        type: Number,
        //default: 70
      },
      top: {
        type: Number,
        default: 20
      },
      widthWrap: {
        type: Number,
        //default: 80
      },
      widthSelect: {
        type: Number,
        default: 80
      },
      selectValue: {
        type: Array,
        default: function () {
          return this.classify
        }
      }, // emit返回值, 默认同下拉框内容一致
      emitValue: String, // emit返回标识
    },
    data() {
      return {
        items: '', // 显示内容
        show: false, // 下拉框显示
        isActive: false, // 下拉框点击状态
        selectNum: 0, // 选择第几个，更改选中状态
      }
    },
    created() {
      this.items = this.title;
      this.Bus.$off('onlySelectEmitValue');
      this.Bus.$off('changeDefault');
    },
    mounted() {
      !this.isExchange && this.Bus.$on('onlySelectEmitValue', selected => {
          this.isActive = false;
          (selected === this.title) && (this.isActive = true)
        }
      );
      this.Bus.$on('changeDefault', (data) => this.isActive = data)
    },
    methods: {
      showChoice() {
        this.show = !this.show;
      },
      closeSelect() {
        this.show = false;
      },
      //选中某项的触发事件
      changeSelect(selected, index) {
        // 从父组件接收的emitValue值，触发emitValue事件，可在其他组件听过$on监听emitValue获取选的的值;
        this.Bus.$emit(this.emitValue, this.selectValue[index]);
        this.show = false;
        // onlySelectEmitValue 由本组件触发，由本组件监听， 目的为了实现互斥
        this.isExchange && (this.items = selected) || this.Bus.$emit('onlySelectEmitValue', selected) && (this.isActive = true) && (this.selectNum = index)
      },
    },
    destroyed() {
      this.Bus.$off('onlySelectEmitValue');
      this.Bus.$off('changeDefault');
    },
    watch: {
      title(newValue, oldValue) {
        this.items = newValue;
      },
      // emitValue(newValue, oldValue) {
      //   this.startValue = newValue;
      // }
    },
  }
</script>
<style scoped type="text/stylus" lang="stylus">
  @import "../../stylus/base.styl"
  .choice-box
    position relative
    display inline-block
    /*margin-right 30px*/
    b
      display inline-block
      padding-right 15px
      font-size $fz13
      color #999
      position relative
      cursor pointer
      &:after
        position absolute
        top 8px
        right 0px
        content ''
        triangle_down(#999)

    .transforB
      position relative
      color #333
      height 40px
      line-height 40px
      padding-left 10px
      border-radius 2px
      background #F4F6FA
      &:after
        position absolute
        top 18px
        right 10px
        content ''
        triangle_down(#333)

    .adB
      position relative
      color #333
      height 38px
      line-height 40px
      padding-left 10px
      background #FFF
      border 1px solid #E1E1E1
      border-radius 2px
      &:after
        position absolute
        top 18px
        right 10px
        content ''
        triangle_down(#FFB422)

    .evaluateB
      box-sizing()
      position relative
      color #999
      height 30px
      line-height 30px
      padding-left 10px
      background #FFF
      border 1px solid #E1E1E1
      border-radius 2px
      &:after
        position absolute
        top 13px
        right 10px
        content ''
        triangle_down(#FFB422)



  ul
      position absolute
      background #FFF
      border 1px solid #E1E1E1
      font-size $fz13
      cursor pointer
      z-index 999
      li
        padding 8px 0 8px 10px
      li:hover
        background #FFF3EB
      .active
        background #FFF3EB


  .is-disabled
    .adB
      background #999
      cursor not-allowed
    ul
      display none



</style>

