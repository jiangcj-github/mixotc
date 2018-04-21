<template>
  <div class="add-group-wrap" v-show="groupShow">
    <p class="wrap-title">
      <span>添加群成员</span>
      <i @click="createGroup">确定</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <div class="contacts">
      <div class="selected">
        <img :src="item.icon" alt="" v-for="item in addList" :key="item.id">
        <i v-if="ids.length > 5">......</i>
      </div>
      <input type="text" placeholder="查找联系人" v-model="searchText">
    </div>
    <ul>
      <li v-for="(content, index) in groupList" :key="index">
        <img class="user-portrait" :src="content.icon ? `${HostUrl.http}image/${content.icon}` : `/static/images/default_avator.png`" alt="">
        <span>{{content.name}}</span>
        <b :class="{'have-select': ids.includes(JsonBig.stringify(content.id)) }" @click="checkContact(JsonBig.stringify(content.id), content.icon)"></b>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "add-group",
    props: ['addGroupShow','curChat', 'index', 'isNewGroup'],
    data() {
      return {
        initIds:[],
        nowChat: this.curChat,
        searchText: '',
        groupShow: this.addGroupShow,
        noContact: false,
        addList: []
      }
    },
    mounted() {
      if (this.isNewGroup) {
        this.initIds = [this.JsonBig.stringify(this.userInfo.uid), this.nowChat]
        this.addList = [
          { 
            id : this.JsonBig.stringify(this.userInfo.uid),
            icon: this.userInfo.icon ? `${HostUrl.http}image/${item.icon}` : `/static/images/default_avator.png`
          },
          {
            id : this.nowChat,
            icon : this.chat[this.index].icon
          }
        ]
      }
    },
    computed: {
      ids() {
        return this.addList.map(item => {
          return item.id
        })
      },
      groupList() {
        return this.$store.state.friendList.filter(item => {
          return item.name.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText)
        })
      },
      chat() {
        return this.$store.state.chat;
      },
      userInfo() {
        return this.$store.state.userInfo;
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
        let array = [];
      //新建群
        if(this.isNewGroup) {
          array = this.ids.map(item => {
            return this.JsonBig.parse(item)
          })
          this.WsProxy.send('control', 'create_group',{
            name: '',
            intro: '',
            ids: array,
            uid: this.userInfo.uid
          }).then(data => {
            let newChat = {
                id: this.JsonBig.stringify(data.id),
                group: true,
                length: array.length,
                service: false,
                icon: "/static/images/groupChat_icon.png",
                nickName: `${this.JsonBig.stringify(data.id)}((${array.length}))`,
                phone: false,
                email: false,
                unread: 0
            }
            this.$store.commit({'type':'newChat', data: newChat})
            this.closeGroup()
          })
          return;
        }
      // 添加群成员
      },
      closeGroup() {
        this.$emit('offAddGroup', 'false')
      },
      checkContact(id, icon) {
        if (this.initIds.includes(id)) return;
        if(!this.ids.includes(id)) {
          this.addList.unshift({
            id: id,
            icon: icon ? `${this.HostUrl.http}image/${icon}` : `/static/images/default_avator.png`
          })
          return;
        }
        this.ids.includes(id) && (this.addList.splice(this.ids.indexOf(id) ,1))
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
      line-height 40px
      margin-bottom 5px
      .selected
        position relative
        width 200px
        height 40px
        i
          position absolute
          right -20px
          bottom 10px
          line-height 12px
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
        box-sizing()
        display block
        width 100%
        height 40px
        font-size 12px
        padding-left 10px
        &::-webkit-input-placeholder
          color $col9C9
        &::-moz-placeholder
          color $col9C9
        &:-moz-placeholder
          color $col9C9
        &:-ms-input-placeholder
          color $col9C9
    ul
      background #FFF
      height 295px
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
          float right
          margin 14px 10px 0 0
          cursor pointer
          width 10px
          height 10px
          border 1px solid #999
          border-radius 50%
        .have-select
          width 12px
          height 12px
          background url("/static/images/slideOk.png") no-repeat
          background-size 12px 12px
          border none
</style>

