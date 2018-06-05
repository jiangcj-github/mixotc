<template>
  <div class="kefu">
    <div class="dialog">
      <Left></Left>
      <Right></Right>
    </div>
  </div>
</template>
<script>
  import Left from './dialog/Left';
  import Right from './dialog/Right';

  export default {
    components: {
      Left,
      Right,
    },
    data() {
      return {

      }
    },
    methods: {
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .kefu
    position fixed !important
    width 100%
    height 100%
    background-image url(/static/images/kefu/background.jpg)
    background-size 100% 100%
    display flex
    align-items center
    justify-content center
    margin-top -100px
    .dialog
      height 600px
      width 900px
      background #f4f6fa
      border-radius 4px
      display flex
</style>
