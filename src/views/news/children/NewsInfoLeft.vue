<template>
  <div class="news-info-left">
    <div class="search-box">
      <input type="text" placeholder="查找昵称/账号" v-model="searchText" @blur="doSearch" @input="input" @keyup.enter="doSearch"/>
      <img src="/static/images/search_gray.png"/>
    </div>
      <happy-scroll style="width:159px;height:325px" resize bigger-move-h="start" hide-horizontal>
        <div class="wrap">
          <ul class="firend-list" v-if="!search">
            <li v-for="content in userList" :key="content.id" :class="{cur: content.id === $store.state.curChat}" @click="selectChat(content.id)">
              <img :src="content.icon" alt="" class="head-portrait">
              <b v-if="content.unread"></b>
              <span>{{content.nickName}}{{content.length ? `(${content.length})` : ''}}</span>
              <img src="/static/images/close_btn.png" alt="" class="close-head" @click.stop="delUser(content.id)">
            </li>
          </ul>
          <ul class="firend-list" v-else>
            <li v-for="(content) in searchRange" :key="content.id" :class="{cur: content.id === $store.state.curChat}" @click="newChat(content)">
              <img :src="content.icon" alt="" class="head-portrait">
              <span>{{content.nickName}}{{content.length ? `(${content.length})` : ''}}</span>
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
        searchRange: [],
        userId: this.JsonBig.stringify(this.$store.state.userInfo.uid)
      }
    },
    mounted() {
      this.initData()
      this.listenChat()//监听消息
      this.reqFriend()//监听好友请求
      this.beKickGroup()//监听被踢出群
      this.quitGroup()//监听退群
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
      },
      friendGid() {
        let obj = {};
        this.$store.state.groupList.forEach( item =>{
          if(item.type !== 0) return;
          item.members.forEach(itm=>{
            let id = this.JsonBig.stringify(itm.id);
            if(id !== this.JsonBig.stringify(this.$store.state.userInfo.uid)) {
              obj[id] = this.JsonBig.stringify(item.id);
            }
          })
        })
        return obj
      },
      friendIds() {
        return this.$store.state.friendList.map(item => {
          return this.JsonBig.stringify(item.id)
        })
      }
    },
    components: {
      HappyScroll
    },
    methods: {
      async fetchGroup() {
        await this.WsProxy.send('control', 'group_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          if(!data) data = []
          this.$store.commit({type: 'getGroupList', data})
        }).catch(error=>{
          console.log(error)
        })
      },
      //初始化拉取加工数据
      async initData() {
        let result = [];
        //拉取好友列表
        // console.log('sdfsdfdsfsdf', this.WebSocket.ws.readyState)
        await this.WsProxy.send('control', 'friend_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          if(!data) data = []
          this.$store.commit({type: 'getFriendList', data})
        }).catch(error=>{
          console.log(error)
        })
        //拉取群組列表
        await this.fetchGroup();
        //拉取近十天对话列表
        let linkman = await this.WsProxy.send('control', 'recent_contact', {uid: this.$store.state.userInfo.uid}).then(data => {
          if(!data.contacts) return [];
          return data.contacts
        }).catch(error=>{
          console.log(error)
        })
        //加工数据
        linkman && linkman.forEach(item => {
          let group = null;
          if (item.gid) {
            group = this.$store.state.groupList.filter(group => {
              return this.JsonBig.stringify(item.gid) === this.JsonBig.stringify(group.id)
            })[0]
            if(group.type === 1){
              result.push({
                mid: item.mid ? this.JsonBig.stringify(item.mid) : 0,
                id: this.JsonBig.stringify(item.gid),
                group: true,
                length: group.members.length,
                service: false,
                icon: "/static/images/groupChat_icon.png",
                nickName: !group.name ? group.members.map(item =>{
                  return item.name
                }).join('、') : `${group.name}`,
                phone: false,
                email: false,
                unread: 0,
                moreFlag: true,
                exists: true//踢出群聊的标志
              });
            }else {
              let other = group.members.filter( item => {
                return this.JsonBig.stringify(item.id) !== this.userId
              })[0]
              let uid = this.JsonBig.stringify(other.id)
              result.push({
                mid: item.mid ? this.JsonBig.stringify(item.mid) : 0,
                id: this.friendGid[uid],
                uid: uid,
                isSingle: true,
                group: false,
                service: false,
                icon: other.icon ? `${this.HostUrl.http}image/${other.icon}` : "/static/images/default_avator.png",
                nickName: other.name,
                phone: other.phone,
                email: other.email,
                moreFlag: true,
                unread: 0
              }); 
            }
          }else if (item.is_peer_admin){
            result.push({
              mid: item.mid ? this.JsonBig.stringify(item.mid) : 0,
              id: this.JsonBig.stringify(item.uid),
              group: false,
              service: true,
              icon: "/static/images/service_icon.png",
              nickName: '客服',
              phone: false,
              email: false,
              moreFlag: true,
              unread: 0
            }); 
          }else {
            let id = this.JsonBig.stringify(item.uid);
            if (this.friendIds.includes(id) || this.userId === id) return;
            result.push({
              mid: item.mid ? this.JsonBig.stringify(item.mid) : 0,
              id: id,
              uid: id,
              group: false,
              service: false,
              icon: item.icon ? `${this.HostUrl.http}image/${item.icon}` : "/static/images/default_avator.png",
              nickName: item.name,
              phone: item.phone,
              email: item.email,
              moreFlag: true,
              unread: 0
            }); 
          }
        })
        linkman && this.$store.commit({type: 'changeChat', data: result});
      },
      // 不在消息列表的人来消息时的处理
      async dealNewChat(id, flag) {
        !flag && !this.chatIds.includes(id) && await this.WsProxy.send('otc', 'trader_info', {id: this.JsonBig.parse(id)}).then( ({name, phone, email, icon }) => {
           this.$store.commit({type: 'newChat', data:{
              id: id,
              group: false,
              service: false,
              icon: icon ? `${this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
              nickName: name,
              phone: phone,
              email: email,
              moreFlag: false,
              unread: 0
           }})
        })
        // console.log(this.chatIds.includes(id));
        flag && !this.chatIds.includes(id) && await this.WsProxy.send('control', 'group_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          this.$store.commit({type: 'getGroupList', data})
          let group = this.$store.state.groupList.filter(item => {
            return this.friendGid[id] === this.JsonBig.stringify(item.id)
          })[0]
          !group && (group = this.$store.state.groupList.filter(item => {
            return id === this.JsonBig.stringify(item.id)
          })[0])
          if(group.type === 1){
              this.$store.commit({type: 'newChat', data:{
                id: this.JsonBig.stringify(group.id),
                group: true,
                length: group.members.length,
                service: false,
                icon: "/static/images/groupChat_icon.png",
                nickName: !group.name ? group.members.map(item =>{
                  return item.name
                }).join('、') : `${group.name}`,
                phone: false,
                email: false,
                unread: 0,
                moreFlag: false,
                exists: true
              }})
            }else {
              let other = group.members.filter( item => {
                return this.JsonBig.stringify(item.id) !== this.userId
              })[0]
              let uid = this.JsonBig.stringify(other.id)
              this.$store.commit({type: 'newChat', data:{
                id: this.friendGid[uid],
                uid: uid,
                isSingle: true,
                group: false,
                service: false,
                icon: other.icon ? `${this.HostUrl.http}image/${other.icon}` : "/static/images/default_avator.png",
                nickName: other.name,
                phone: other.phone,
                email: other.email,
                moreFlag: this.$store.state.messages[uid] ?  (this.$store.state.messages[uid].length === 0 ? false : true): false,
                unread: 0
              }})
            }
          }).catch(error=>{
            console.log(error)
        })
      },
      // 监听系统消息(请求加好友)
      reqFriend(){
        this.WebSocket.onMessage['req_friend'] = {
          callback:(res) => {
            // console.log('sdfaasadfadsfasf', res)
            if (res.body && res.body.type === "req_fd") {
              let {id, info, icon, name} = res.body.data;
              const obj = {
                sid: this.JsonBig.stringify(res.body.id), 
                id: this.JsonBig.stringify(id),
                info: info,
                icon: icon,
                name: name,
                isDeal: false
              }
              this.$store.commit({type:'newSystemMes', data: obj})
            }
          }
        }
      },
      //监听被踢出群
      beKickGroup() {
         this.WebSocket.onMessage['kick_g_notify'] = {
          callback:async (res) => {
            if (res.body && res.body.type === 'kick_g') {
              let {id} = res.body.data;
              this.$store.commit({type: 'beKick', data: this.JsonBig.stringify(id)})
            }
          }
        }
      },
      //监听退群
      async quitGroup() {
        this.WebSocket.onMessage['quit_group'] = {
          callback:async (res) => {
            if (res.body && res.body.type === 'quit_g') {
              let {id, uid} = res.body.data;
              if(this.JsonBig.stringify(uid) === this.userId) return;
              await this.fetchGroup();
              this.$store.commit({type: 'updateGroupInfo', data: this.JsonBig.stringify(id)})
            }
          }
        }
      },
      // 监听消息
      listenChat() {
        //聊天信息监听
        let _this = this;
        this.WebSocket.onMessage['sms']={
          async callback(res){
            // op为7单人聊天信息，对象类型, op为6群聊信息，数组第0项
            // 单聊
            if (res.op && res.op === 7) {
              let {id, uid, icon, name, data, type } = res.body;
              let obj = {}
              
              // 文字
              if (type === 'text') {
                obj = {
                  id: _this.JsonBig.stringify(id),
                  from: _this.JsonBig.stringify(uid), 
                  to: _this.userId,
                  icon: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                  msg:{
                    type: 0,
                    content: data.msg
                  },
                  isLoding: false, 
                  isFail: false,
                  time: new Date() - 0
                }
                _this.$store.commit({type: 'addMessages', data:{id: _this.JsonBig.stringify(uid), msg: obj }})
                await _this.dealNewChat(_this.JsonBig.stringify(uid), 0)
                return;
              }
              // 图片
              obj = {
                  id: _this.JsonBig.stringify(id),
                  from: _this.JsonBig.stringify(uid), 
                  to: _this.userId,
                  icon: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                  msg:{
                    type: 1,
                    content: `${_this.HostUrl.http}file/${data.id}`
                  },
                  isLoding: true, 
                  isFail: false,
                  time: new Date() - 0
                }
                _this.$store.commit({type: 'addMessages', data:{id: _this.JsonBig.stringify(uid), msg: obj }})
                await _this.dealNewChat(_this.JsonBig.stringify(uid), 0)
            };
            // 群聊
            if (Array.isArray(res) && res[0].op === 6) { 
              let {id, uid, gid, data, type } = res[0].body;
              let obj = {};
            if (_this.userId === _this.JsonBig.stringify(uid)) return;
              let other = _this.$store.state.groupList.filter(item => {
                return _this.JsonBig.stringify(gid) === _this.JsonBig.stringify(item.id)
              })[0].members.filter(item => {
                return _this.JsonBig.stringify(uid) === _this.JsonBig.stringify(item.id)
              })[0]
              let {icon, name} = other;
              if (type === 'text') {
                obj = {
                  id: _this.JsonBig.stringify(id),
                  from: _this.JsonBig.stringify(uid), 
                  to: _this.userId,
                  name: name,
                  icon: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                  msg:{
                    type: 0,
                    content: data.msg
                  },
                  isLoding: false, 
                  isFail: false,
                  time: new Date() - 0
                }
                _this.$store.commit({type: 'addMessages', data:{id: _this.JsonBig.stringify(gid), msg: obj }})
                await _this.dealNewChat(_this.JsonBig.stringify(gid), 1)
                return;
              }
              //图片
              obj = {
                  id: _this.JsonBig.stringify(id),
                  from: _this.JsonBig.stringify(uid), 
                  to: _this.userId,
                  icon: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                  msg:{
                    type: 1,
                    content: `${_this.HostUrl.http}file/${data.id}`
                  },
                  isLoding: true, 
                  isFail: false,
                  time: new Date() - 0
                }
                _this.$store.commit({type: 'addMessages', data:{id: _this.JsonBig.stringify(gid), msg: obj }})
                await _this.dealNewChat(_this.JsonBig.stringify(gid), 1)
            }
          }
        }
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
          let id = this.friendGid[this.JsonBig.stringify(item.id)]
          if (this.chatIds.includes(id)) return;
          if (item.name.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText)) {
            result.push({
              id: id,
              uid: this.JsonBig.stringify(item.id),
              isSingle: true,
              group: false,
              service: false,
              icon: item.icon ? `${this.HostUrl.http}image/${item.icon}` : "/static/images/default_avator.png",
              nickName: item.name,
              phone: item.phone,
              email: item.email,
              moreFlag: true,
              unread: 0
            });
          }
        })
        //群组
        this.$store.state.groupList.forEach(item => {
          if (this.chatIds.includes(this.JsonBig.stringify(item.id))) return;
          if ( item.type === 1 && (item.name.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText) || this.JsonBig.stringify(item.id).includes(this.searchText))) {
            result.push({
              id: this.JsonBig.stringify(item.id),
              group: true,
              service: false,
              length: item.members.length,
              icon: "/static/images/groupChat_icon.png",
              nickName: !item.name ? item.members.map(item =>{
                return item.name
              }).join('、') : `${item.name}`,
              phone: false,
              email: false,
              unread: 0,
              moreFlag: false,
              exists: true
            });
          }
        })
      this.searchRange = result
      },
      delUser(id) {
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
          box-sizing()
          width 150px
          height 30px
          font-size $fz13
          padding-left 10px
          padding-right 30px
          background #F4F6FA
          border-radius 2px 2px 2px 0
          margin-left 5px
          placeholder()
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
