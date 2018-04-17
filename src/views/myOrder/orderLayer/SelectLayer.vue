<template>
  <BasePopup class="select-layer"
             :show="selectLayer"
             :width=470
             :height=194>
    <img src="/static/images/close_btn.png" alt="" @click="closePopup">
    <p>{{contentInfo}}</p>
    <div>
      <em @click="leftOperate()">{{leftContent}}</em>
      <i @click="rightOperate()">{{rightContent}}</i>
    </div>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "explain-layer",
    props: ['selectShow', 'type', 'contentInfo', 'leftContent', 'rightContent', 'id', 'info'],
    data() {
      return {
        selectLayer: this.selectShow,
      }
    },
    components: {
      BasePopup
    },
    mounted() {
      console.log()
    },
    watch: {
      selectShow(state) {
        state === true ? this.selectLayer = true : this.selectLayer = false
      }
    },
    methods: {
      closePopup() {
        this.$emit('offSelet', 'false')
      },
      rightOperate() {
        console.log('this.type', this.type)
        console.log('this.id', this.id)
        switch(this.type) {
          case 4: // 取消订单
            this.WsProxy.send('otc','cancel_order',{
              id:this.id
            }).then((data)=>{
              console.log('cancel', data)
            }).catch((msg)=>{
              console.log(msg);
            });
            window.location.reload()
            // this.$emit('offSelet', 'false')
            break;
          case 7:  // 申述
            this.$emit('offSelet', 'false')
            this.$store.commit({'type':'changeChatBox', data: true})
            break;
          case 9:  // 撤销申述
            this.WsProxy.send('otc','update_order',{
              "id": this.id,
              "state": 2, // 1 等待买家付款; 2 卖家确认收款／等待卖家发货; 3申诉中; 4 已取消; 5 已超时; 6交易完成; 7 买家评价; 8 卖家评价; 9 双方已评
              "info": this.info
            }).then((data)=>{
              console.log('撤销申述', data)
            }).catch((msg)=>{
              console.log(msg);
            });
            // window.location.reload()
            //this.$emit('offSelet', 'false')
            break;
        }
      },
      leftOperate() {
        if (this.type == 7) {
          this.WsProxy.send('otc','update_order',{
            "id": this.id,
            "state": 3, // 1 等待买家付款; 2 卖家确认收款／等待卖家发货; 3申诉中; 4 已取消; 5 已超时; 6交易完成; 7 买家评价; 8 卖家评价; 9 双方已评
            "info": this.info
          }).then((data)=>{
            console.log('申述', data)
          }).catch((msg)=>{
            console.log(msg);
          });
          window.location.reload()
          // this.$emit('offSelet', 'false')
        } else {
          this.$emit('offSelet', 'false')
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .select-layer
    text-align center
    img
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 442.6px
      cursor pointer
    p
      margin 32.4px 0 60px
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

