<template>
  <div>
    <BasePopup :show="true" :top="50" :width="566" :height="411">
      <slot>
        <div class="main">
          <h3>添加银行卡收款地址</h3>
          <div class="mid">
            <div class="name">
              <h4>姓名</h4>
              <input type="text">
            </div>
            <div class="account">
              <h4>卡号</h4>
              <input type="text">
              <div class="tip">*可查询的账号</div>
            </div>
          </div>
          <div class="bank">
            <h4>开户行</h4>
            <input type="text">
          </div>
          <div class="remark">
            <textarea maxlength="100">

            </textarea>
          </div>
          <button>确定</button>
        </div>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
 import BasePopup from '@/components/common/BasePopup';
  export default {
    data() {
      return {

      }
    },
    components: {
      BasePopup
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base";
  .main
    box-sizing()
    width 100%
    height 100%
    padding 0 60px 0
    backgrouond #FFF
    h3
      position relative
      height 20px
      line-height 20px
      padding-left 12px
      margin-top 24px
      font-size $fz20
      color $col333
      letter-spacing 0.41px
      &::before
        position absolute
        left 0
        top 0
        width 3px
        height 20px
        content ''
        background-color $col422
    .mid
      display flex
      align-content space-between
      margin-top 42px
      .name
        margin-right 30px
      h4
        margin-bottom 10px
      input
        width 208px
        height 40px
        background $col6FA
        border-radius 2px

</style>