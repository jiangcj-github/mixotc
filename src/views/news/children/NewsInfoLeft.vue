<template>
  <div class="news-info-left">
    <div class="search-box">
      <input type="text" placeholder="查找昵称／账号" v-model="searchText" @blur="doSearch" @input="input" @keyup.enter="doSearch"/>
      <img src="/static/images/search_gray.png"/>
    </div>
      <happy-scroll style="width:159px;height:325px" resize bigger-move-h="start">
        <div class="wrap">
          <ul class="firend-list" v-if="!search">
            <li v-for="content in userList" :key="content.id" :class="{cur: content.id === $store.state.curChat}" @click="selectChat(content.id)">
              <img :src="content.icon" alt="" class="head-portrait">
              <b v-if="content.unread"></b>
              <span>{{content.nickName}}</span>
              <img src="/static/images/close_btn.png" alt="" class="close-head" @click.stop="delUser(content.id)">
            </li>
          </ul>
          <ul class="firend-list" v-else>
            <li v-for="(content) in searchRange" :key="content.id" :class="{cur: content.id === $store.state.curChat}" @click="newChat(content)">
              <img :src="content.icon" alt="" class="head-portrait">
              <span>{{content.nickName}}</span>
            </li>
          </ul>
        </div>
      </happy-scroll>
    <div class="other-item">
      <div class="img system">
        <b v-if="$store.state.systemMessage"></b>
        <img src="/static/images/notice_icon.png" @click="toSystem">
      </div>
      <div class="img phone-img">
        <img src="/static/images/phoneicon.png">
        <p>
          <img src="/static/images/QRcode.png" alt="">
          <span><i>下载APP沟通更方便</i></span>
        </p>
      </div>
    </div>
    <!-- 查看群 -->
    
  </div>
</template>

<script>
  import { HappyScroll } from 'vue-happy-scroll'
  export default {
    name: "new-info-left",
    data() {
      return {
        search: false,
        searchText: '',
        searchRange: []
      }
    },
    mounted() {
      this.initData()
      document.querySelector('.news-info-left .happy-scroll-container').className = 'happy-scroll-container import';
    },
    computed: {
      userList() {
        return this.$store.state.chat
      },
      chatIds() {
        return this.$store.state.chat.map(item => {
          return item.id
        })
      }
    },
    components: {
      HappyScroll
    },
    methods: {
      //初始化拉取加工数据
      async initData() {
        let result = [];
        //拉取好友列表
        await this.WsProxy.send('control', 'friend_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          this.$store.commit({type: 'getFriendList', data})
        }).catch(error=>{
          console.log(error)
        })
        //拉取群組列表
        await this.WsProxy.send('control', 'group_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          this.$store.commit({type: 'getGroupList', data})
        }).catch(error=>{
          console.log(error)
        })
        //拉取近十天对话列表
        let linkman = await this.WsProxy.send('control', 'recent_contact', {uid: this.$store.state.userInfo.uid}).then(data => {
          console.log(data)
          return data
        }).catch(error=>{
          console.log(error)
        })
        //加工数据
        linkman.contacts && linkman.contacts.forEach(item => {
          let length = 0;
          if (item.gid) {
            this.$store.state.groupList.forEach(group => {
              if (this.JsonBig.stringify(item.gid) === this.JsonBig.stringify(group.id)) {
                length = group.members.length
              }
            })
            result.push({
              id: this.JsonBig.stringify(item.gid),
              group: true,
              length: length,
              service: false,
              icon: "/static/images/groupChat_icon.png",
              nickName: (!item.name || item.name === this.$store.state.userInfo.name) ? `${this.JsonBig.stringify(item.gid)}(${length})` : `${item.name}(${length})`,
              phone: false,
              email: false,
              unread: 0
            });
          }else if (item.is_peer_admin){
            result.push({
              id: this.JsonBig.stringify(item.uid),
              group: false,
              service: true,
              icon: "/static/images/service_icon.png",
              nickName: '客服',
              phone: false,
              email: false,
              unread: 0
            }); 
          }else {
            result.push({
              id: this.JsonBig.stringify(item.uid),
              group: false,
              service: false,
              icon: item.icon ? `${this.HostUrl.http}image/${item.icon}` : "/static/images/default_avator.png",
              nickName: item.name,
              phone: item.phone,
              email: item.email,
              unread: 0
            }); 
          }
        })
        this.$store.commit({type: 'changeChat', data: result});
      },
      //搜索框
      input() {
        this.searchText === '' && (this.search = false)
      },
      doSearch() {
        if(this.searchText === '') return;
        this.search = true;
        this.searchLinkman()
      },
      //切换至系统消息界面
      toSystem() {
        this.$store.commit({type: 'changeCurChat', data: {id: 'system'}})
      },
      selectChat(id, index) {
        this.$store.commit({type: 'changeCurChat', data: {id}})
      },
      //处理搜索范围，联系人列表，好友，群组
      searchLinkman() {
        let result = [];
        //联系人列表
        this.$store.state.chat.forEach(item => {
          if (item.nickName.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText)) {
            result.push(item);
          }
        })
        //好友
        this.$store.state.friendList.forEach(item => {
          if (this.chatIds.includes(this.JsonBig.stringify(item.id)) || item.type === 0) return;
          if (item.name.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText)) {
            result.push({
              id: this.JsonBig.stringify(item.id),
              group: false,
              service: false,
              icon: item.icon ? `${this.HostUrl.http}image/${item.icon}` : "/static/images/default_avator.png",
              nickName: item.name,
              phone: item.phone,
              email: item.email,
              unread: 0
            });
          }
        })
        //群组
        this.$store.state.groupList.forEach(item => {
          if (this.chatIds.includes(this.JsonBig.stringify(item.id))) return;
          if (item.name.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText) || this.JsonBig.stringify(item.id).includes(this.searchText)) {
            result.push({
              id: this.JsonBig.stringify(item.id),
              group: true,
              service: false,
              length: item.members.length,
              icon: "/static/images/groupChat_icon.png",
              nickName: (!item.name || item.name === this.$store.state.userInfo.name) ? `${this.JsonBig.stringify(item.id)}(${item.members.length})` : `${item.name}(${item.members.length})`,
              phone: false,
              email: false,
              unread: 0
            });
          }
        })
      this.searchRange = result
      console.log(result)
      },
      delUser(id) {
        // 删除联系人列表项接口尚未完成
        // this.WsProxy.send('control', 'delete_group', {uid:this.$store.state.userInfo.uid, id: this.JsonBig.parse(id)}).then(data => {
        //   console.log('deletgroup',data)
        // }).catch(error=>{
        //   console.log(error)
        // })
        this.$store.commit({type: 'delChat', data: id})
      },
      newChat(chat) {
        this.search = false
        if (this.chatIds.includes(chat.id)) {
          this.$store.commit({type: 'changeCurChat', data: {id:chat.id}})
          return;
        }
        this.$store.commit({type: 'newChat', data: chat})
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
    
    .news-info-left
      position relative
      float left
      width 159px
      height 420px
      background #FFF
      border-right 1px solid #E1E1E1
      .search-box
        position relative
        height 40px
        line-height 40px
        border-bottom 1px solid #E1E1E1
        input
          width 140px
          height 30px
          padding-left 10px
          background #F4F6FA
          border-radius 2px 2px 2px 0
          margin-left 5px
        img
          position absolute
          top 12px
          right 15px
          width 18px
          height 18px
      .wrap
        width 159px
        .firend-list
          background #FFF
          margin-bottom 5px
          li
            position relative
            height 42px
            line-height 42px
            cursor pointer
            &:hover, &.cur
              background-color $col6FA
              .close-head
                display block
                width 5.7px
                height 5.7px
            b
              position absolute
              left 27px
              top 7px
              width 9px
              height 9px
              background $col94C
              border-radius 50%
            img
              vertical-align middle
            .head-portrait
              width 30px
              height 30px
              background aquamarine
              border-radius 50%
              margin 0 10px 0 5px
            .close-head
              display none
              position absolute
              top 18px
              right 8px
              width 5px
              height 5px
              cursor pointer
            span
              display inline-block
              width 90px
              font-size 12px
              margin-right 5px
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
              vertical-align middle
      .other-item
        position absolute
        left 0
        bottom 0
        width 123px
        height 36px
        padding 8px 0 6px
        padding-left 36px
        -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
        box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
        b
          position absolute
          left 57px
          top 8px
          width 9px
          height 9px
          background $col94C
          border-radius 50%
        .img
          display inline-block
          width 30px
          height 30px
          vertical-align middle
          cursor pointer
          &.system
            margin-right 37px
        .phone-img
          position relative
          width 16px
          height 24px
          &:hover
            p
              display block
          p
            display none
            position absolute
            top -112px
            right -26px
            width 80px
            height 100px
            text-align center
            background #FFF
            box-shadow -2px -2px 8px 0 rgba(51,51,51,0.30)
            img
              display block
              margin 7px auto 1px
              width 70px
              height 70px
            span
              float left
              width 100%
              margin-left 5px
              i
                display inline-block
                width 100%
                white-space nowrap
                fz8()
                color $col333
                letter-spacing 0.09px

</style>
