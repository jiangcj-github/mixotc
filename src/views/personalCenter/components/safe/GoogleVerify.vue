<template>
  <div>
    <BasePopup :show="true" :top="52" :width="1006" :height="444">
      <slot>
        <div class="main">
          <h4>开启谷歌验证</h4>
          <img class="close-btn" src="/static/images/close_btn_tr2.png" alt="" @click="Bus.$emit(emitValue)">
          <ul class="section clearfix">
            <li class="first">
              <img src="/static/images/personal/google_1.png" alt="" width="32px" height="32px">
              <div class="details">
                
              </div>
            </li>
            <li class="second">
              <img src="/static/images/personal/google_2.png" alt="" width="32px" height="32px">
            </li>
            <li class="third">
              <img src="/static/images/personal/google_3.png" alt="" width="32px" height="32px">
            </li>
          </ul>
        </div>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
import BasePopup from '@/components/common/BasePopup';
  export default {
    props:['emitValue'],
    data(){
      return {
        password1: '',
        password2: '',
        messageWord: '',
        // googleWord: ''
      }
    },
    components: {
      BasePopup
    },
    methods: {
    
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
  .main
    box-sizing()
    position relative
    width 100%
    height 100%
    padding 20px 0 0 60px
    .close-btn
      position absolute
      right 15px
      top 15px
      cursor pointer  
    h4
      position relative
      padding-left 12px
      font-size $fz20
      letter-spacing 0.41px
      font-weight bold
      &::before
        position absolute
        top 3px
        left 0
        content ''
        width 3px
        height 20px
        background $col422
    .section
      padding-top 40px
      li
        float left
        width 300px

</style>