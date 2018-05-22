<template>
  <BasePopup class="under-layer"
             :show="underLayer"
             :width=470
             :height=194>
    <p>确定要下架?</p>
    <div>
      <em @click="sureUnder()">确定要下架</em>
      <i @click="closePopup">我再想想</i>
    </div>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "undercarriageLayer",
    props: ['underShow', 'id'],
    data() {
      return {
        underLayer: this.underShow,
      }
    },
    components: {
      BasePopup
    },
    mounted() {
      console.log()
    },
    watch: {
      underShow(state) {
        this.underLayer = state === true ?  true : false
      }
    },
    methods: {
      closePopup() {
        this.$emit('offUnder', 'false')
      },
      sureUnder() {
        this.WsProxy.send('otc','handle_sale',{
          "id": this.id,
          "online": 2 //1在售 2下架
        }).then((data)=>{
          console.log('下架', data)
          window.location.reload()
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .under-layer
    text-align center
    p
      margin 60px 0
    div
      em, i
        display inline-block
        width 160px
        height 40px
        text-align center
        line-height 40px
        cursor pointer
      em
        color #FFB422
        background #FFF
        border 1px solid #FFB422
        border-radius 2px
        margin-right 30px
      i
        color #FFF
        background #FFB422
        border-radius 2px
</style>

