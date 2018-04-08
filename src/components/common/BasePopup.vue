<template>
  <div class="wrap" v-if="show">
    <div class="content" :style="{width: `${width}px`, height: `${height}px`}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number,
        default: 292
      },
      height: {
        type: Number,
        default: 94
      }
    }
  }
</script>

<style scoped lang="stylus">
  .wrap
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.4)
    z-index 1000
    .content
      position absolute
      top 29.17%
      left 50%
      transform translateX(-50%)
      -ms-transform translateX(-50%)
      -moz-transform translateX(-50%)
      -webkit-transform translateX(-50%)
      -o-transform translateX(-50%)
      background #FFF
      border-radius 2px
</style>
