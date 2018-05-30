<template>
  <div class="di" ref="di">
    <img src="/static/images/date_icon.png" class="di-icon">
    <el-date-picker
      class="di-input"
      v-model="date1"
      :picker-options="opt1"
      @input="onInput1"
      @blur="onBlur1"
      placeholder="开始日期">
    </el-date-picker>
    <span class="di-to">-</span>
    <el-date-picker
      class="di-input"
      v-model="date2"
      :picker-options="opt2"
      @input="onInput2"
      @blur="onBlur2"
      placeholder="截止日期">
    </el-date-picker>
  </div>
</template>
<script>
  export default {
    props:{

      //时间改变时触发(包括起始时间或结束时间)
      onDiChange:{type:String,default:"onDiChange"},
      //起始时间改变时触发
      onDiStartChange:{type:String,default:"onDiStartChange"},
      //结束时间改变时触发
      onDiEndChange:{type:String,default:"onDiEndChange"},
      //输入时间时触发(包括起始时间和结束时间)
      onDiInput:{type:String,default:"onDiInput"},
      //输入起始时间时触发
      onDiStartInput:{type:String,default:"onDiStartInput"},
      //输入结束时间时触发
      onDiEndInput:{type:String,default:"onDiEndInput"},
      //失去焦点时触发(包括起始时间框和结束时间框)
      onDiBlur:{type:String,default:"onDiBlur"},
      //起始时间失去焦点时触发
      onDiStartBlur:{type:String,default:"onDiStartBlur"},
      //结束时间失去焦点时触发
      onDiEndBlur:{type:String,default:"onDiEndBlur"},

      //时间区间的最小值(毫秒)
      min:{type:Number,default:Date.parse("1960/01/01")},
      //时间区间的最大值(毫秒)
      max:{type:Number,default:Date.parse("2050/01/01")}

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
    },
    computed:{
      paramDate1:function () {
        if(this.date1){
          return Math.floor(new Date(this.date1).getTime()/1000);
        }
        return null;
      },
      paramDate2:function() {
        if(this.date2){
          return Math.floor(new Date(this.date2).getTime()/1000)+24*3600-1;
        }
        return null;
      }
    },
    watch:{
      date1:function(){
        this.Bus.$emit(this.onDiStartChange,this.date1);
        this.Bus.$emit(this.onDiChange,this.date1,this.date2);
      },
      date2:function(){
        this.Bus.$emit(this.onDiEndChange,this.date2);
        this.Bus.$emit(this.onDiChange,this.date1,this.date2);
      }
    },
    methods:{
      onInput1(){
        this.Bus.$emit(this.onDiStartInput,this.date1);
        this.Bus.$emit(this.onDiInput,this.date1,this.date2);
      },
      onInput2(){
        this.Bus.$emit(this.onDiEndInput,this.date2);
        this.Bus.$emit(this.onDiInput,this.date1,this.date2);
      },
      onBlur1(){
        this.Bus.$emit(this.onDiStartBlur,this.date1);
        this.Bus.$emit(this.onDiBlur,this.date1,this.date2);
      },
      onBlur2(){
        this.Bus.$emit(this.onDiEndBlur,this.date2);
        this.Bus.$emit(this.onDiBlur,this.date1,this.date2);
      },
      //设置n天前
      setDays(n){
        let date2=new Date(new Date().toDateString());
        this.date2=date2;
        this.date1=new Date(date2.getTime()-24*60*60*1000*(n-1));
      },
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
    .el-input__inner:focus
      background #FFF
      border 1px solid #FFB422
       border-radius 2px
  .el-date-table td.current:not(.disabled) span
    background-color #FFB422
  .el-date-table td.today span
    color #FFB422
</style>
