<template>
  <div class="di">
    <img src="/static/images/date_icon.png" class="di-icon">
    <el-date-picker v-model="date1" :picker-options="opt1" placeholder="开始日期" class="di-input"></el-date-picker>
    <span class="di-to">-</span>
    <el-date-picker v-model="date2" :picker-options="opt2" placeholder="截止日期" class="di-input"></el-date-picker>
  </div>
</template>
<script>
  export default {
    props:{
      min:{type: Number ,default: 0},
      max:{type: Number ,default: Date.now()},
    },
    data() {
      return {
        date1: "",
        date2: "",
        opt1: {
          disabledDate: (time) => {
            return time.getTime() > this.max || time.getTime() < this.min || (this.date2 && time > this.date2)
          }
        },
        opt2: {
          disabledDate: (time) => {
            return time.getTime() > this.max || time.getTime() < this.min || (this.date1 && time < this.date1);
          }
        },
      };
    }
  };
</script>
<style lang="stylus">
  .di
    display inline-flex
    align-items center
    .di-icon
      margin-right 10px
    .di-to
      width 15px
      text-align center
    .di-input
      width 100px
      text-align center
      input
        padding 0
        height 30px
        line-height 28px
        border 1px solid #E1E1E1
        border-radius 2px
        text-align center
        font-size 13px
        letter-spacing 0
        &::placeholder
          color #999
          font-size 13px
          letter-spacing 0.15px
      span
        display none
</style>
