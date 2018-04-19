<template>
  <div class="add-group-wrap" v-show="groupShow">
    <p class="wrap-title">
      <span>添加群成员</span>
      <i @click="createGroup">确定</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <div class="contacts">
      <img :src="item.src" alt="" v-for="(item, index) in addList" :key="index">
      <input type="text" placeholder="查找联系人">
    </div>
    <ul>
      <li v-for="(content, index) in groupList" :key="index">
        <img class="user-portrait" :src="content.src" alt="">
        <span>{{content.name}}/130***123</span>
        <b class="no-select" @click="checkContact($event, index)"></b>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "add-group",
    props: ['addGroupShow'],
    data() {
      return {
        groupShow: this.addGroupShow,
        noContact: false,
        groupList: [
          {src: '/static/images/calendar.png', name: 'lihh'},
          {src: '/static/images/hint.png', name: 'lihh'},
          // {src: '/static/images/search.png', name: 'lihh'},
          // {src: '/static/images/footlogo.png', name: 'lihh'},
          // {src: '/static/images/huansuan.png', name: 'lihh'},
          // {src: '/static/images/news.png', name: 'lihh'}
        ],
        addList: []
      }
    },
    watch: {
      addGroupShow(state) {
        if (state === true ) {
          this.groupShow = true
        } else  {
          this.groupShow = false
        }
      }
    },
    methods: {
      createGroup() {
        this.WsProxy.send('control', 'create_group',{
          name: '',
          intro: '',
          ids:[],
          uid: this.$store.state.userInfo.uid
        }).then(data=>{
          console.log(id)
        })
      },
      closeGroup() {
        this.$emit('offAddGroup', 'false')
      },
      checkContact(evt, index) {
        if (evt.target.className.indexOf("no-select") == -1) {
          evt.target.className = 'no-select'
          this.addList.splice(this.addList[index].flag, 1)
        } else {
          evt.target.className = 'have-select'
          this.addList.push({src: this.groupList[index].src, flag: index})
        }
        console.log(this.addList)
        if (this.addList.length > 5) return
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .add-group-wrap
    position fixed
    right 125px
    bottom 100px
    width 300px
    height 420px
    background #F4F6FA
    -webkit-box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    .wrap-title
      position relative
      height 40px
      border-bottom 1px solid #E1E1E1
      background  #F4F6FA
      line-height 40px
      span
        margin-left 10px
        margin-right 144px
      i
        color #FFB422
        cursor pointer
      img
        position absolute
        right 12px
        top 15px
        width 10px
        height 10px
        cursor pointer
    .contacts
      height 40px
      background #FFF
      line-height 40px
      margin-bottom 5px
      img
        width 30px
        height 30px
        border-radius 50%
        background aquamarine
        vertical-align middle
        margin-left 5px
      img:first-child
        margin-left 10px
      input
        max-width 60px
        margin-left 10px
    ul
      background #FFF
      height 335px
      overflow-y auto
      li
        height 40px
        line-height 40px
        .user-portrait
          width 30px
          height 30px
          border-radius 50%
          background aquamarine
          vertical-align middle
          margin-left 10px
          margin-right 10px
        span
          font-size 12px
          letter-spacing 0.14px
          margin-right 120px
        b
          display inline-block
          cursor pointer
        .no-select
          width 10px
          height 10px
          border 1px solid #999
          border-radius 50%
        .have-select
          width 12px
          height 12px
          background url("/static/images/slideOk.png") no-repeat
          background-size 12px 12px
</style>

