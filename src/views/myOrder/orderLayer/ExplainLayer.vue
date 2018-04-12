<template>
  <BasePopup class="explain-layer"
             :show="explainLayer"
             :width=470
             :height=194>
    <img src="/static/images/close_btn.png" alt="" @click="closePopup">
    <p>请先与对方联系，核实对方是否放币</p>
    <div>
      <em>申诉</em>
      <i>联系对方</i>
    </div>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "explain-layer",
    props: ['explainShow'],
    data() {
      return {
        explainLayer: this.explainShow
      }
    },
    components: {
      BasePopup
    },
    watch: {
      explainShow(state) {
        state === true ? this.explainLayer = true : this.explainLayer = false
      }
    },
    methods: {
      closePopup() {
        this.$emit('offExplain', 'false')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .explain-layer
    text-align center
    img
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 442.6px
      cursor pointer
    p
      margin 32.4px 0 60px
    div
      em, i
        display inline-block
        width 160px
        height 40px
        text-align center
        line-height 40px
        cursor pointer
      em
        color #FFB422
        background #FFF
        border 1px solid #FFB422
        border-radius 2px
        margin-right 30px
      i
        color #FFF
        background #FFB422
        border-radius 2px
</style>

