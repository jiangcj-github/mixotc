<template>
  <div class="date">
    <el-date-picker
      v-model="value"
      type="date"
      :clearable = "false"
      :picker-options="pickerOptions"
      :placeholder="text"
      @blur="blur">
    </el-date-picker> -
  </div>
</template>

<script>
  export default {
    props:{
      text:{ // 自定义Placeholder值
        type: String,
        default:'开始日期'
      },
      dateUp:{ // 时间上限
        type: String,
        default:'1969-12-31T16:00:00.000Z'
      },
      emitValue: String, // emit返回标识
    },
    data() {
      return {
        value: '',
        pickerOptions: {
          dateUp: this.dateUp,
          disabledDate: (time) => {
            // time.getTime() < new Date(this.limitValue).getTime();
            return time.getTime() > Date.now() || time.getTime() < new Date(this.dateUp) - 0 || time.getTime() < new Date(this.startValueDate).getTime()
          }
        }
      };
    },
    methods: {
      blur() {
        this.Bus.$emit(this.emitValue, this.value);
        console.log(this.emitValue, this.value)``
      }
    }
  };
</script>
<style lang="stylus">
  .date
    .el-date-editor.el-input, .el-date-editor.el-input__inner
      width 100px
    .el-icon-date:before
      content ""
    .el-input--prefix .el-input__inner
      width 100px
      height 30px
      padding 0
      text-align center
      font-size 13px
      letter-spacing 0.15px
      background #FFF
      border 1px solid #E1E1E1
      border-radius 2px
      &::-webkit-input-placeholder
        font-size 13px
        color #999
        letter-spacing 0.15px
      &::-moz-placeholder
        font-size 13px
        color #999
        letter-spacing 0.15px
      &:-moz-placeholder
        font-size 13px
        color #999
        letter-spacing 0.15px
      &:-ms-input-placeholder
        font-size 13px
        color #999
        letter-spacing 0.15px
    .el-input__inner:focus
      background #FFF
      border 1px solid #FFB422
      border-radius 2px
  .el-date-table td.current:not(.disabled) span
    background-color #FFB422
  .el-date-table td.today span
    color #FFB422
</style>
