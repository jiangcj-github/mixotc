<template>
  <BasePopup class="del-eva-layer"
             :show="delLayer"
             :width=470
             :height=194>
    <img src="/static/images/close_btn.png" alt="" @click="closePopup">
    <p>是否确定删除?</p>
    <div>
      <em @click="closePopup">取消</em>
      <i @click="sureUnder()">确定</i>
    </div>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "evaluate-layer",
    props: ['delShow'],
    data() {
      return {
        delLayer: this.delShow,
      }
    },
    components: {
      BasePopup
    },
    mounted() {

    },
    watch: {
      delShow(state) {
        this.delLayer = state === true ?  true : false
      }
    },
    methods: {
      closePopup() {
        this.$emit('offDel', 'false')
      },
      sureUnder() {
        // this.WsProxy.send('otc','handle_sale',{
        //   "id": this.id,
        //   "online": 2 //1在售 2下架
        // }).then((data)=>{
        //   console.log('下架', data)
        //   window.location.reload()
        // }).catch((msg)=>{
        //   console.log(msg);
        // });
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base.styl"
  .del-eva-layer
    text-align center
    .content
      position relative
      img
        position absolute
        width 12px
        height 12px
        top 10px
        right 10px
        cursor pointer
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

