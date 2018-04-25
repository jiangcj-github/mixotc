<template>
  <ul class="cm">
    <li v-for="(e,i) in cmList" :key="i" @click="clickCi(e)">
      <p class="ci-icon" v-if="e!=null && useIcon">
        <img :src="e.icon"><span>{{e.text}}</span>
      </p>
      <p class="ci" v-else-if="e!=null && !useIcon">
        <span>{{e.text}}</span>
      </p>
      <p class="line" v-else></p>
    </li>
  </ul>
</template>
<script>
  export default {
    props:{
      cmList: {
        type: Object,
        default: ()=>{
          return [
            {key:"date",text:"日期日期的d订单",icon:"/static/images/date_icon.png"},
            {key:"date",text:"日期",icon:"/static/images/date_icon.png"},
            null,
            {key:"date",text:"日期"},
            {key:"date",text:"日期",icon:"/static/images/date_icon.png"},
          ]
        }
      },
      useIcon: {
        type: Boolean,
        default: false,
      },
      onCmItemClick:{type:String,default:"onCmItemClick"},
    },
    methods:{
      clickCi(e){
        this.Bus.$emit(this.onCmItemClick,e);
      }
    }
  };
</script>
<style lang="stylus">
  ul.cm
    background #fff
    width 100px
    border-radius 3px
    box-shadow  0 2px 4px 0 #999
    >li
      line-height 30px
      font-size 14px
      color #333
      cursor pointer
      &:hover
        background #e1e1e1
      &:first-of-type
        border-radius 3px 3px 0 0
      &:last-of-type
        border-radius 0 0 3px 3px
      p
        padding 0 10px
        white-space nowrap
        height 30px
        display flex
        align-items center
        >span
          min-width 0
          overflow hidden
      p.ci
        padding 0 15px
      p.ci-icon
        >span
          margin-left 10px
        >img
          width 14px
          height 14px
          flex-shrink 0
      p.line
        height 1px
        background #ccc
        padding 0
</style>
