<template>
  <div class="slider">
    <span class="min-span">{{minText}}</span>
    <el-slider
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
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
      step:{
        type: Number,
        default: 1
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
      },
      disabled: {
        type: Boolean,
        default: false
      },
      selectSliderValue: String,
      choiceValue: {
        type: Number,
        default: 0
      }
    },
    created(){
      // console.log('created', this.max, this.choiceValue)
    },
    mounted() {
    },
    watch: {
      choiceValue(data) {
        // console.log('choiceValue watch', data)
        this.sliderValue = data
      }
    },
    data() {
      return {
        sliderValue: this.choiceValue
      };
    },
    methods: {
      changeInput(data) {
        this.sliderValue = this.step === 1 && (!/^d+$/.test(data) ? Math.round(data) : data) || ((data.toString().replace(/^(\d+)\.(\d{0,6})\d*$/g, "$1" + '.' + '$2'))*1)
        //console.log('data3473744702345', data, this.sliderValue)
        this.Bus.$emit(this.selectSliderValue, this.sliderValue);
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
      color #999 !important
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
      width 90px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
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
          width 120px
          height 40px
          padding 0 50px 0 10px
          color #333
          background #FFF
          border 1px solid #E1E1E1
          border-radius 2px
          line-height 40px
          text-align left

      .is-disabled
        .el-input__inner
          color #999
          background #F4F6FA
</style>
