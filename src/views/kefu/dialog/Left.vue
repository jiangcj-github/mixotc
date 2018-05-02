<template>
  <div class="left">
    <div class="head">
      <img src="/static/images/kefu/kefu.png">
      <h3>OTC客服专员1号</h3>
    </div>
    <div class="search">
      <input type="text" title="" placeholder="搜索联系人" v-model="srchText" @input="parseUls">
    </div>
    <happy-scroll color="rgba(100,100,100,0.8)" size="5" resize hide-horizontal
                  bigger-move-h="start" smaller-move-h="start" class="scrollPane">
      <ul class="persons">
        <li v-for="(content, index) in uls" :key="index" @click="onLiClick(index, content.appellant_id)" :class="{active: content.appellant_id === $store.state.serviceNow}">
          <img :src="content.appellant_icon ? `${HostUrl.http}image/${content.appellant_icon}` : `/static/images/default_avator.png`">
          <i v-if="content.unread">{{unreadNum}}</i>
          <div class="pinfo">
            <p class="p1">
              <span class="s1">{{content.appellant_name}}</span>
              <span class="s2">{{content.time}}</span>
            </p>
            <p class="p2">{{content.data}}</p>
          </div>
        </li>
      </ul>
    </happy-scroll>
  </div>
</template>
<script>
  import { HappyScroll } from 'vue-happy-scroll';
  export default {
    components: {
      HappyScroll,
    },
    data() {
      return {
        srchText: "",
        uls: [],
        ulsBuf: [],
        unreadNum: 1
      }
    },
    mounted(){
      this.parseUls();
      this.initData()
      // this.$store.state.serviceData.length ? this.uls =  this.ulsBuf = this.$store.state.serviceData : this.initData() //初始化列表数据
    },
    methods: {
      initData() { // 初始化列表数据
        this.WsProxy.send('control', 'a_get_appeal_users', {
          "id": this.$store.state.userInfo.uid
        }).then(data => {
          console.log('对话列表', data);
          this.uls =  this.ulsBuf = data;
          data.forEach(v => {
            v.appellant_id = this.JsonBig.stringify(v.appellant_id)
            v.id = this.JsonBig.stringify(v.id)
          })
          this.$store.commit({type: 'initServiceData', data: data}); // 获取列表数据存储到vuex中
        }).catch(error=>{
          console.log('错误', error)
        })
      },
      onLiClick(index, id) { // 点击列表
        console.log('aaa', this.uls[index].appellant_id)
        this.WsProxy.send('control', 'a_get_user_appeals', { // 获取点击人资料
          "appellant_id": this.uls[index].appellant_id && this.JsonBig.parse(this.uls[index].appellant_id),
          "appellee_id": this.uls[index].appellee_id && this.JsonBig.parse(this.uls[index].appellee_id)
        }).then(data => {
          console.log('申述人', data);
          data.forEach(v => {
            v.buyer_id = this.JsonBig.stringify(v.buyer_id)
            v.seller_id = this.JsonBig.stringify(v.seller_id)
            v.sid = this.JsonBig.stringify(v.sid)
            v.uid = this.JsonBig.stringify(v.uid)
          })
          this.$store.commit({type: 'getServiceNowtalk', data: this.uls[index]}) // 存储右边聊天人
          this.$store.commit({type: 'changeServiceNowtalk', data: Object.assign({data}, {id: this.JsonBig.stringify(this.uls[index].appellant_id)})}) // 存储右边聊天人员
        }).catch(error=>{
          console.log('错误', error)
        })

      },
      parseUls() { // 搜索输入框
        this.uls = [];
        this.ulsBuf.forEach((v) => {
          if (new RegExp("^.*"+this.srchText+".*$").test(v.appellant_name)) {
            this.uls.push(v);
          }
        });
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .left
    width 250px
    background #333
    border-radius 4px 0 0 4px
    border-right 1px solid #333
    box-sizing border-box
    .head
      height 60px
      display flex
      align-items center
      padding 10px 15px
      box-sizing border-box
      >img
        width 40px
        height 40px
      h3
        margin-left 20px
        font-size 16px
        color #fff
        letter-spacing 0.19px
    .search
      padding 10px 15px
      font-size 12px
      font-size
      >input
        background #222
        border-radius 2px
        width 100%
        height 30px
        color #fff
        padding 0 10px
        box-sizing border-box
        font-size 14px
    .scrollPane
      width 250px
      height 490px
    ul.persons>li
        height 60px
        padding 10px 18px 10px 15px
        box-sizing border-box
        display flex
        align-items center
        cursor pointer
        position relative
        &:hover
          background #3c3737
        &.active
          background #474747
        >img
          width 40px
          height 40px
          margin-right 10px
          border-radius 50%
          flex-shrink 0
        >i
          display inline-block
          line-height 19px
          text-align center
          width 20px
          height 20px
          background #FF794C
          border-radius 50%
          fz10()
          color #FFF
          position absolute
          left 40px
          top 10px
        .pinfo
          flex-grow 1
          min-width 0
          height 100%
          .p1
            line-height 20px
            >span.s1
              color #fff
              font-size 14px
            >span.s2
              font-size 11px
              color #999
              float right
          .p2
            line-height 18px
            margin-top 2px
            color #999
            font-size 11px
            letter-spacing 0.15px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
</style>
