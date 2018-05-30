<template>
  <div class="news-info-right">
    <ul class="title-info clearfix">
      <li class="title-info-name" v-if="curChat">{{curChat === 'system' ? '系统消息' : title}}</li>
      <li class="title-info-select" v-clickoutside="closeSelect" v-if="title && !chat[index].service">
        <img v-if="!chat[index].group" src="/static/images/add_talk.png" class="add-talk-img" @click="showSeletAdd">
        <img v-else src="/static/images/groupchat.png" class="add-talk-img" @click="openGroupInfo(curChat)">
        <div v-show="seletAdd" @click="seletAdd = false">
          <i></i>
          <ul>
            <li @click="openAddFriend" v-if="!isFriend">+好友</li>
            <li @click="openBeliveLayer(chat[index].uid)" v-if="!isTrust">+信任</li>
            <li @click="openAddGroup">+建群</li>
          </ul>
        </div>
      </li>
      <li class="close-btn">
        <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeTalk">
      </li>
    </ul>
    <!-- 聊天信息部分 -->
    <RightContent></RightContent>
    <!-- 底部 -->
    <ol class="input-text clearfix">
      <li>
        <input 
          type="text" 
          :disabled="isDisable" 
          :class="{disable: isDisable}" 
          v-model="sendText" 
          @keyup.enter="sendMs(sendText)" 
          maxlength="100"
        >
      </li>
      <li @click="()=>{
          if(isDisable) return;
          this.$refs.up_img.click()
        }" 
        class="send-image">
        <img src="/static/images/picture_icon.png"  title="发送图片">
        <div style='display:none'>
          <input type='file' ref="up_img" accept="image/png, image/jpeg" @change="uploadImage">
        </div>
        <span>图片</span>
      </li>
      <li>
        <div
          class="money-address"
          v-show="showAddress"
          @click="showAddress = false"
          v-clickoutside="()=>{showAddress && (this.showAddress = false)}"
          >
          <p v-for="(item, index) of mapAddress" :key="index" @click="sendAddress(item.sendText)">
            {{item.text}}
          </p>
        </div>
        <img src="/static/images/address_icon.png" @click.stop="foldAddress">
        <span>收款地址</span>
      </li>
    </ol>
    <!-- 添加好友弹窗 -->
    <AddFriend
      v-if="showAddFriend"
      :addFriendShow="showAddFriend"
      @offAddFriend="openAddFriend"
      :id="curChat"
      :name="infoDiction[chat[index].uid].name"
      :icon="infoDiction[chat[index].uid].icon"
      >
    </AddFriend>
    <!-- 添加群聊弹窗 -->
    <AddGroup
      v-if="showAddGroup"
      :addGroupShow="showAddGroup"
      @offAddGroup="openAddGroup"
      :curChat="curChat"
      :isNewGroup="true"
      ></AddGroup>
    <!-- 添加信任弹窗 -->
    <BasePopup class="belive-layer"
               :show="beliveLayer"
               :width=135
               :height=50
               :top=50
               :wrapStyleObject="beliveWrap"
    >已加信任
    </BasePopup>
    <!-- 无收款地址提示弹窗 -->
    <BasePopup class="address-layer"
               :show="addressLayer"
               :width=135
               :height=50
               :top=50
               :wrapStyleObject="beliveWrap"
               @click.native="addressLayer = false"
    >暂无收款地址
    </BasePopup>
    <!-- 群信息 -->
    <GroupInfo
      v-if="showCheckGroup"
      :id="groupId"
      :checkGroupShow="showCheckGroup"
      @offCheckGroup="openCheckGroup"
    ></GroupInfo>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import AddFriend from '@/views/news/AddFriend' // 添加好友
  import AddGroup from '@/views/news/AddGroup' // 添加群
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import GroupInfo from '@/views/news/GroupInfo' // 查看群
  import { HappyScroll } from 'vue-happy-scroll'
  import RightContent from './right/RightContent.vue';

  export default {
    name: "news-info-right",
    data() {
      return {
        groupId: '',
        isNewGroup: true,
        showAddress: false,
        showCheckGroup: false,
        seletAdd: false,
        showAddFriend: false,
        showAddGroup: false,
        beliveLayer: false,
        addressLayer: false,
        beliveWrap: {
          width: '560px',
          height: '420px',
          right: 0,
          bottom: 0
        },
        timer: null,
        sendText: '',
        userId: this.JsonBig.stringify(this.$store.state.userInfo.uid),
        reqMessage: ''
      }
    },
    components: {
      AddFriend,
      AddGroup,
      BasePopup,
      GroupInfo,
      RightContent,
      HappyScroll
    },
    mounted() {
      this.fetchAddress()//拉取收款地址
      this.beFriend()//监听被加好友
      this.delFriend()//监听被加好友
      this.listenChat()//监听消息
      this.beAddedGroup()//监听被加入群
      //监听其他页面调用聊天窗口
      this.Bus.$on('contactSomeone',({id, msg})=> {
        this.contactSomeone(id, msg)
      });
      this.Bus.$on('addReqInfo',(info)=> {
        this.reqMessage = info;
      });
    },
    destroyed() {
      this.Bus.$off('contactSomeone');
      this.Bus.$off('addReqInfo');
    },
    computed: {
      ...mapGetters([
        'chatIds',
        'friendIds',
        'friendGid',
        'infoDiction',
        'title'
      ]),
      curChat() {
        return this.$store.state.curChat
      },
      chat() {
        return this.$store.state.chat
      },
      index() {
        let idx = '';
        this.chat.forEach((item, index)=>{
          if (item.id === this.curChat) idx = index;
        })
        return idx
      },
      isDisable() {
        if(!this.chatIds.includes(this.curChat)) return true;
        return this.curChat === 'system' || this.curChat === '' ? true  : ((this.chat[this.index] && this.chat[this.index].exists === false) ?  true : false )
      },
      isFriend() {
        let result = false;
        this.$store.state.friendList.forEach(item => {
          this.JsonBig.stringify(item.id) === this.chat[this.index].uid && (result = true)
        })
        return result
      },
      isTrust() {
        return this.$store.state.trustList.includes(this.chat[this.index].uid)
      },
      messages() {
        return this.$store.state.messages[this.curChat] ? this.$store.state.messages[this.curChat] : []
      },
      membersInfo() {
        let obj = {}
        this.messages.forEach(item => {
          if(!obj[item.from]) return;
          obj[item.from] = {
            icon: item.icon,
            name: item.name
          }
        })
        return obj;
      },
      mapCurMembers() {
        let obj = {}
        if(!this.chat[this.index].group && !this.chat[this.index].isSingle) {
          obj[this.curChat] = this.chat[this.index].icon
          return obj;
        }
        this.$store.state.groupList.length && this.$store.state.groupList.filter(item => {
          return this.curChat === this.JsonBig.stringify(item.id)
        })[0].members.forEach(item => {
          obj[this.JsonBig.stringify(item.id)] = {
            icon: item.icon ? `${this.HostUrl.http}image/${item.icon}` : "/static/images/default_avator.png",
            name: item.name
          }
        })
        return obj
      },
      mapAddress(){
        return this.$store.state.moneyAddress.map(item => {
          if(item.type === 1) {
            return {text: `支付宝：${item.number}`, sendText: `收款人:${item.name}<br>支付宝账号:${item.number}`}
          }
          if(item.type === 2) {
            return {text: `微信：${item.number}`, sendText: `收款人:${item.name}<br>微信账号:${item.number}`};
          }
          if(item.type === 4) {
            return {text: `${item.bank + '****' + (item.number.slice(-4))}`, sendText: `收款人:${item.name}<br>银行卡号:${item.number}<br> 开户行:${item.bank}`}
          }
        })
      }
    },
    methods: {
      // 拉取收款地址数据
      async fetchAddress() {
        if(this.showAddress) return;
        await this.$store.dispatch({ type: 'moneyAddress', ws: this.WsProxy})
      },
      async fetchFriendList() {
        await this.$store.dispatch({ type: 'getFriendList', ws: this.WsProxy})
      },
      async contactSomeone(id, msg) {
        if(this.userId === id) {
          alert('不能和自己聊天')
          return;
        }
        let flag = this.chatIds.indexOf(id),
            friendFlag = false;
        await this.fetchFriendList();
        friendFlag = this.friendIds.includes(id);

        // 好友以gid为匹配条件
        if(friendFlag) id = this.friendGid[id];
        friendFlag && (flag = this.chatIds.indexOf(id));
        // 1为群聊（好友实质为群聊），0为单聊
        await this.dealNewChat(id, friendFlag ? 1 : 0);
        // 打开聊天窗口
        this.$store.commit({type: 'changeChatBox', data: true})
        // 不在左侧列表的新联系人需置顶
        if(flag !== -1) {
          this.$store.commit({type: 'chatTop', data: flag})
        }
        // 改变当前聊天框
        this.$store.commit({type: 'changeCurChat', data: {id: id }})
        if (msg) this.sendMs(msg);
      },
      // 不在消息列表的人来消息时的处理
      async dealNewChat(id, flag) {
        !flag && !this.chatIds.includes(id) && await this.WsProxy.send('otc', 'trader_info', {id: this.JsonBig.parse(id)}).then( ({name, phone, email, icon }) => {
          this.$store.commit(
            {type: 'updateStrangerInfo', 
              data: {
                id: id,
                icon: icon ? `${this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                name: name
              }
          })
           this.$store.commit({type: 'newChat', data:{
              id: id,
              uid: id,
              group: false,
              service: false,
              phone: phone,
              email: email,
              moreFlag: false,
              unread: 0
           }})
        })
        flag && !this.chatIds.includes(id) && await this.$store.dispatch({ type: 'getGroupList', ws: this.WsProxy});
        if(this.chatIds.includes(id)) return;
        let group = this.$store.state.groupList.filter(item => {
          return this.friendGid[id] === this.JsonBig.stringify(item.id)
        })[0];
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
          })[0];
          let uid = this.JsonBig.stringify(other.id)
          this.$store.commit({
            type: 'newChat', data:{
              id: this.friendGid[uid],
              uid: uid,
              isSingle: true,
              group: false,
              service: false,
              phone: other.phone,
              email: other.email,
              exists: true,
              moreFlag: this.$store.state.messages[uid] ?  (this.$store.state.messages[uid].length === 0 ? false : true): false,
              unread: 0
            }
          })
        }
      },
      // 监听消息
      listenChat() {
        //聊天信息监听
        let _this = this;
        this.WebSocket.onMessage['sms']={
          async callback(res){
            // op为7单人(陌生人)聊天信息，对象类型, op为6群聊信息，数组第0项
            // 单聊
            if (res.op && res.op === 7) {
              let {id, uid, icon, name, data, type } = res.body;
              let obj = {},
                  messageContent = {
                    text: data.msg && data.msg.br(),
                    image: `${_this.HostUrl.http}file/${data.id}`,
                    audio: `您收到一条语音信息，请在手机端查看`,
                    video: `您收到一条视频信息，请在手机端查看`,
                    gift: `您收到一条红包信息，请在手机端查看`
                  }
                obj = {
                  id: _this.JsonBig.stringify(id),
                  from: _this.JsonBig.stringify(uid), 
                  to: _this.userId,
                  msg:{
                    type: type === 'image' ? 1 : 0,
                    content: messageContent[type]
                  },
                  isLoding: type === 'image' ? true : false, 
                  isFail: false,
                  time: new Date() - 0
                }
                _this.$store.commit({
                  type: 'updateStrangerInfo', data: 
                    {
                      id: _this.JsonBig.stringify(id),
                      icon: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                      name: name
                    }
                })
                await _this.dealNewChat(_this.JsonBig.stringify(uid), 0)
                _this.$store.commit({type: 'addMessages', data:{id: _this.JsonBig.stringify(uid), msg: obj }})
            }
            // 群聊（好友单聊实质为群聊）
            if (Array.isArray(res) && res[0].op === 6) {
              res.forEach(async (ite) => {
                let {id, uid, gid, data, type } = res[0].body;
                let obj = {},
                    messageContent = {
                      text: data.msg && data.msg.br(),
                      image: `${_this.HostUrl.http}file/${data.id}`,
                      audio: `您收到一条语音信息，请在手机端查看`,
                      video: `您收到一条视频信息，请在手机端查看`,
                      gift: `您收到一条红包信息，请在手机端查看`
                    };
                // if (_this.userId === _this.JsonBig.stringify(uid)) return;
                let group = _this.$store.state.groupList.filter(item => {
                  return _this.JsonBig.stringify(gid) === _this.JsonBig.stringify(item.id)
                })[0];
                let other = group.members.filter(item => {
                  return _this.JsonBig.stringify(uid) === _this.JsonBig.stringify(item.id)
                })[0]
                let {icon, name} = other;
                obj = {
                  id: _this.JsonBig.stringify(id),
                  from: _this.JsonBig.stringify(uid), 
                  to: _this.userId,
                  name: name,
                  msg:{
                    type: type === 'image' ? 1 : 0,
                    content: messageContent[type]
                  },
                  isLoding: type === 'image' ? true : false, 
                  isFail: false,
                  time: new Date() - 0
                }
                await _this.dealNewChat(_this.JsonBig.stringify(gid), 1)
                _this.$store.commit({type: 'addMessages', data:{id: _this.JsonBig.stringify(gid), msg: obj }})
              })
            }
          }
        }
      },
      sendAddress(item) {
        this.sendMs(item)
      },
      async foldAddress() {
        if(this.isDisable) return;
        await this.fetchAddress();
        if(this.mapAddress.length === 0) {
          this.addressLayer = true;
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.addressLayer = false
          }, 3000)
          return;
        }
        this.showAddress = true;
      },
      //发送增加本地消息记录
      addStoreMessages(tid, type, content, time) {
        let obj = {
          from: this.userId,
          to: tid,
          name: this.$store.state.userInfo.name,
          msg:{
            type: type,
            content: content
          },
          isLoding: true,
          isFail: false,
          time: time
        }
        this.$store.commit({type: 'addMessages', data:{id: tid, msg: obj }})
      },
      // 发送图片
      async uploadImage() {
        let a = new FormData();
        let chat = this.chat[this.index],
            tid = this.JsonBig.parse(this.curChat),
            file = this.$refs.up_img.files[0],
            time = new Date() - 0;
        a.append("uploadfile", file);
        this.$refs.up_img.value = ''
        this.sendImg(tid, time);
        let icon = await fetch(`${this.HostUrl.http}file/`, {
          method: 'Post',
          body: a
        }).then(res => res.text()).then(res => res).catch(error=>{
          this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:1 }})
          return false;
        })
        if(!icon) return;
        this.$store.commit({type: 'changeImgsrc', data:{id: tid, time: time, src: `${this.HostUrl.http}file/${icon}`}})
        this.WsProxy.sendMessage({
            gid: chat.group || chat.isSingle ? tid : 0,
            tid: tid,
            type: 'image',
            data:{
              uid: this.$store.state.userInfo.uid,
              rid: chat.group || chat.isSingle ? tid : 0,
              tid: tid,
              type: 'image',
              id: icon,
              length: file.size,
              ext: file.type,
            }
          }).then(data => {
            this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:0 }})
          }).catch(error => {
            this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:1 }})
          })
      },
      sendImg(tid, time) {
        this.addStoreMessages(tid, 1, '', time);
      },
      //发送消息
      sendMs(text) {
        if (text.trim() === '') return;
        // 本地store更新消息
        let tid = this.JsonBig.parse(this.curChat),
            chat= this.chat[this.index],
            time = new Date() - 0;
        this.addStoreMessages(tid, 0, text, time)
        this.$store.commit({type: 'chatTop', data: this.index})
        // 发消息
        this.WsProxy.sendMessage({
          gid: chat.group || chat.isSingle ? tid : 0,
          tid: tid,
          data:{
            uid: this.$store.state.userInfo.uid,
            rid: chat.group || chat.isSingle ? tid : 0,
            tid: tid,
            msg: text
          }
        }).then(data => {
          this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:0, mid: this.JsonBig.stringify(data.data.msg_id)}})
        }).catch(error => {
          this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:1 }})
        })
        this.sendText = '';
      },
      // 监听被加入群聊
      beAddedGroup() {
        this.WebSocket.onMessage['add_g_notify'] = {
          callback:async (res) => {
            if (res.body && ["add_g", "cre_g"].includes(res.body.type)) {
              let {id, aid, type, members} = res.body.data;
              let idstr =  this.JsonBig.stringify(id);
              if(this.chatIds.includes(idstr)) this.$store.commit({type: 'beAdd', data: idstr})
              await this.dealNewChat(idstr, 1)
              if(type === 0) {
                let other = members.filter(item => {
                  return this.JsonBig.stringify(item.id) !== this.userId
                })[0];
                //处理加好友后的陌生人对话框
                let idx = '', otherId = this.JsonBig.stringify(other.id);
                this.chat.forEach((item, index)=>{
                  if (item.id === otherId) idx = index;
                })
                if(idx !== '') {
                  this.$store.commit({type: 'delStranger', data:{id: otherId, index: idx }})
                }
                //加好友后的处理
                let obj = {
                  id: 0,
                  from: otherId,
                  to: this.userId,
                  msg:{
                    type: 0,
                    content: this.JsonBig.stringify(aid) === this.userId ? this.reqMessage : '已通过验证，开始对话吧'
                  },
                  isLoding: false,
                  isFail: false,
                  time: new Date() - 0
                }
                this.$store.commit({type: 'addMessages', data:{id: idstr, msg: obj }})
              }
              this.$store.commit({type: 'changeCurChat', data: {id: idstr}})
            }
          }
        }
      },
      // 监听被添加好友
      beFriend(){
        this.WebSocket.onMessage['add_friend'] = {
          callback:async (res) => {
            if (res.body && res.body.type === "add_fd") {
              let {ack, id} = res.body.data;
              if(ack) return;
              await this.fetchFriendList()
            }
          }
        }
      },
      delFriend(){
        this.WebSocket.onMessage['del_fd'] = {
          callback: (res) => {
            if (res.body && res.body.type === 'del_fd') {
              let id = this.JsonBig.stringify(res.body.data.id);
              this.$store.commit({type: 'delFriend', data: { id: this.friendGid[id], index: this.friendIds.indexOf(id)}})
            }
          }
        }
      },
      openGroupInfo(id) {
        this.groupId = id;
        this.showCheckGroup = true
      },
      openCheckGroup(st) {
        if (st === 'false') {
          this.showCheckGroup = false
        } else {
          this.showCheckGroup = true
        }
      },
      closeTalk() {
        this.$store.commit({'type':'changeChatBox', data: false})
      },
      closeSelect() {
        this.seletAdd = false
      },
      showSeletAdd() {
        this.seletAdd = !this.seletAdd
      },
      openAddFriend(st) {
        if (st === 'false') {
          this.showAddFriend = false
        } else {
          this.showAddFriend = true
        }
      },
      openAddGroup(st) {
        if (st === 'false') {
          this.showAddGroup = false
        } else {
          this.showAddGroup = true
        }
      },
      openBeliveLayer(id) {
        this.WsProxy.send('otc','new_trust',{
            uid:this.$store.state.userInfo.uid,
            id: this.JsonBig.parse(id),
            trust:1
          }).then((data)=>{
          this.beliveLayer = true
          clearTimeout(this.timer)
          this.$store.commit({'type':'newTrust', data: id})
          this.timer = setTimeout(() => {
            this.beliveLayer = false
          }, 3000)
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .news-info-right
    position relative
    float right
    width 400px
    height 420px
    background #F4F6FA
    .title-info
      height 40px
      line-height 40px
      background #FFF
      border-bottom 1px solid #E1E1E1
      >li
        float left
      .title-info-name
        overflow hidden
        width 304px
        height 40px
        margin-left 20px
        font-size 14px
        color $col333
        font-weight bold
        text-overflow ellipsis
        white-space nowrap
        letter-spacing 0.16px
      .title-info-select
        img
          vertical-align middle
          cursor pointer
        div
          position absolute
          top 40px
          right 0
          width 80px
          background #333
          border-radius 2px
          i
            position absolute
            top -10px
            left 7px
            display block
            border-width 5px 3px
            border-style solid dashed dashed
            border-color transparent transparent #333
            font-size 0
            line-height 0
          ul
            li
              position relative
              height 25px
              padding-left 34px
              line-height 25px
              font-size 12px
              color #FFF
              z-index 99
              background #333
              cursor pointer
            li:hover
              background #474747
            li:nth-child(1)  
              border-radius 2px 2px 0 0
            li:nth-child(3)  
              border-radius  0 0 2px 2px
            li:nth-child(1):before
              position absolute
              top 6px
              left 10px
              width 13px
              height 13px
              background url("/static/images/add_friend.png")
              background-size 13px 13px
              content ''
            li:nth-child(2):before
              position absolute
              top 6px
              left 10px
              width 12px
              height 13px
              background url("/static/images/trust.png")
              background-size 12px 13px
              content ''
            li:nth-child(3):before
              position absolute
              top 6px
              left 10px
              width 13px
              height 14px
              background url("/static/images/creat_group.png")
              background-size 13px 14px
              content ''
      .close-btn
        float right
        margin-right 24px
        img
          width 10px
          height 10px
          cursor pointer
          vertical-align middle
    .input-text
      position absolute
      bottom 0
      left 0
      width 400px
      padding 7px 0 3px
      background #FFF
      -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
      box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
      li
        position relative
        float left
        text-align center
        img
          cursor pointer
        &.send-image
          cursor pointer
        .money-address
          position absolute
          bottom 45px
          right 12px
          width 150px
          color #FFF
          font-size $fz12
          letter-spacing: 0.14px;
          border-radius 2px
          background $col333
          &::after
            position absolute
            bottom -6px
            right 12px
            content ''
            border-top 7px solid $col333
            border-left 6px solid transparent
            border-right 6px solid transparent
          p
            height 25px
            padding 0 3px
            line-height 25px
            color #FFF
            cursor pointer
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            &:hover
              background #474747
        span
          display block
          margin-top -3px
          color #999
          letter-spacing 0.09px
          transform scale(0.55)
      li:nth-child(1)
        margin-right 15px
        margin-left 5px
        input
          width 274px
          height 33px
          padding-left 10px
          font-size 12px
          border 1px solid #FFB422
          &.disable
            border-color $col1E1
      li:nth-child(2)
        width 30px
        img
          width 20px
          height 18px
      li:nth-child(3)
        width 60px
        img
          width 19.4px
          height 19px
  /*弹窗*/
  .belive-layer, .address-layer
    text-align center
    line-height 50px
    font-size 12px
</style>
