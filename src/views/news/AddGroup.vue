<template>
  <div class="add-group-wrap" v-show="groupShow">
    <p class="wrap-title">
      <span>添加群成员</span>
      <i @click="createGroup">确定</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <div class="contacts" :style="{paddingLeft: `${ids.length > 5 ? (75 + 3*35) + 12 : (75 + (ids.length > 2 ? ids.length - 2 : 0)*35)}px`}">
      <div class="selected">
        <div class="imgs">
          <img :src="item.icon" alt="" v-for="item in addList" :key="item.id">
        </div>
        <i v-if="ids.length > 5">...</i>
      </div>
      <input type="text" placeholder="查找联系人" v-model="searchText">
    </div>
    <ul>
      <li v-for="(content, index) in groupList" :key="index">
        <img class="user-portrait" :src="content.icon ? `${HostUrl.http}image/${content.icon}` : `/static/images/default_avator.png`" alt="">
        <span>{{content.name}}</span>
        <b 
          :class="{
            'have-select': ids.includes(JsonBig.stringify(content.id)) && !initIds.includes(JsonBig.stringify(content.id)),
            'disable-selected': initIds.includes(JsonBig.stringify(content.id))
            }" 
          @click="checkContact(JsonBig.stringify(content.id), content.icon)"
        ></b>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "add-group",
    props: {
      addGroupShow: Boolean,
      curChat: String,
      isNewGroup: Boolean,
      groupInfo: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        startId: 0, //添加群成员时截取数组时，判断索引位置所需的id
        initIds:[],
        nowChat: this.curChat,
        searchText: '',
        groupShow: this.addGroupShow,
        addList: []
      }
    },
    mounted() {
      //新建群
      if (this.isNewGroup) {
        this.initIds = [this.JsonBig.stringify(this.userInfo.uid), this.nowChat];
        this.addList = [
          { 
            id : this.JsonBig.stringify(this.userInfo.uid),
            icon: this.userInfo.icon ? `${this.HostUrl.http}image/${this.userInfo.icon}` : `/static/images/default_avator.png`
          },
          {
            id : this.nowChat,
            icon : this.chat[this.index].icon
          }
        ]
        return;
      }
      //添加群成员
      this.initIds = this.groupInfo.members.reverse().map(item => {
        return this.JsonBig.stringify(item.id)
      })
      this.addList = this.groupInfo.members.reverse().map(item => {
        return { 
            id : this.JsonBig.stringify(item.id),
            icon: item.icon ? `${this.HostUrl.http}image/${item.icon}` : `/static/images/default_avator.png`
          }
      })
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
      },
      index() {
        let idx = '';
        this.chat.forEach((item, index)=>{
          if (item.id === this.nowChat) idx = index;
        })
        return idx
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
       async fetchGroup() {
        await this.WsProxy.send('control', 'group_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          this.$store.commit({type: 'getGroupList', data})
        }).catch(error=>{
          console.log(error)
        })
      },
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
              nickName: `${this.JsonBig.stringify(data.id)}`,
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
        array = this.ids.filter(item => {
            return !this.initIds.includes(item)
          }).map(item => {
            return this.JsonBig.parse(item);
          })
        if (!array.length) {
          this.closeGroup()
          return;
        };
        this.WsProxy.send('control', 'add_g_member',{
          id: this.JsonBig.parse(this.nowChat),
          ids: array,
          uid: this.userInfo.uid
        }).then(data => {
          this.fetchGroup()
          this.$store.commit({'type':'updateGroupInfo', data: {id: this.nowChat, length: this.ids.length}})
          this.closeGroup()
        })
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
      position relative
      height 40px
      background-color #FFF
      line-height 40px
      margin-bottom 5px
      .selected
        position absolute
        top 0
        left 0
        .imgs
          overflow hidden
          max-width 180px
          height 40px
          text-overflow ellipsis
          white-space nowrap
        i
          position absolute
          right -13px
          bottom 5px
          line-height 12px
        img
          width 30px
          height 30px
          border-radius 50%
          // background aquamarine
          vertical-align middle
          margin-left 5px
        img:first-child
          margin-left 10px
      input
        box-sizing()
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
      height 334px
      overflow-y auto
      li
        height 40px
        line-height 40px
        .user-portrait
          width 30px
          height 30px
          border-radius 50%
          // background aquamarine
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
        .disable-selected
          width 12px
          height 12px
          background url("/static/images/disable_select.png") no-repeat
          background-size 12px 12px
          border none
</style>

