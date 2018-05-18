<template>
  <div class="slider">
    <span class="min-span">{{minText}}</span>
    <el-slider
      v-model="sliderValue"
      :min="min"
      :max="max"
      :show-input-controls="false"
      @change="changeInput"
      show-input>
    </el-slider>
    <b>{{inputText}}</b>
    <span class="max-span">{{maxText}}</span>
  </div>
</template>

<script>
  export default {
    props:{
      min:{
        type: Number,
        default: 10
      },
      max:{
        type: Number,
        default: 30
      },
      inputText: {
        type: String,
        default: '分钟'
      },
      minText: {
        type: String,
        default: '10min'
      },
      maxText: {
        type: String,
        default: '30min'
      }
    },
    data() {
      return {
        sliderValue: 0
      };
    },
    methods: {
      changeInput(data) {
        ! /^d+$/.test(data) ?  this.sliderValue = Math.floor(data) : this.sliderValue = data
        console.log(111, this.sliderValue)
      }
    }
  };
</script>

<style lang="stylus">
  .slider
    position relative
    b
      position absolute
      right 330px
      top 10px
      font-size 13px
      color #999
      z-index 2
    span
      display inline-block
      width 55px
      font-size 13px
      color #999
    .min-span
      position relative
      top -15px
    .max-span
      position absolute
      left 400px
      top 10px
  .el-slider
    display inline-block
    .show-input
      width 325px
      margin-right 235px
    .el-slider__runway
      height 1px
      margin-top 20px
    .el-slider__bar
      height 1px
      background-color #FFB422
    .el-slider__button-wrapper
      height 31.5px
    .el-slider__button
      width 10px
      height 10px
      border none
      background-color #FFB422
    .el-slider__input
      width 120px
      margin-top 0
      .el-input--small
        .el-input__inner
          height 40px
          padding 0 10px
          background #FFF
          border 1px solid #E1E1E1
          border-radius 2px
          line-height 40px
          text-align left
</style>
