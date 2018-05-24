<template>
  <div class="wrap" v-if="show" :style="wrapStyleObject">
    <div class="content" :style="{width: `${width}px`, height: `${height}px`, top: `${top}%`}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 292
      },
      height: {
        type: Number,
        default: 94
      },
      top: {
        type: Number,
        default: 29.4
      },
      wrapStyleObject: {
        type: Object,
        default() {
          return {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .wrap
    position fixed
    background rgba(0, 0, 0, 0.4)
    z-index 3000
    .content
      position absolute
      left 50%
      transform translateX(-50%) translateY(-50%)
      -ms-transform translateX(-50%) translateY(-50%)
      -moz-transform translateX(-50%) translateY(-50%)
      -webkit-transform translateX(-50%) translateY(-50%)
      -o-transform translateX(-50%) translateY(-50%)
      background #FFF
      border-radius 2px
</style>
