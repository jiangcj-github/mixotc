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
    <happy-scroll style="width:399px;height:325px" :resize="true" bigger-move-h="end" smaller-move-h="end" hide-horizontal class="main-content">
      <div class="wrap">
        <!-- 空白消息框 -->
        <div class="blank" v-if="!title && curChat !== 'system'"></div>
        <!-- 聊天消息框 -->
        <div class="news-info-talk clearfix" v-if="title && curChat !== 'system'">
          <p class="more-info" v-if="chat[index].moreFlag" @click="fetchMore(10, 1)">查看更多消息</p>
          <p class="more-info" v-else></p>
          <div class="messages clearfix" v-for="(item, index) of messages" :key="item.id ? item.id :item.time">
            <p class="time-info" v-if="index > 0 && dealTime(messages[index-1].time, item.time)">{{dealTime(messages[index-1].time, item.time)}}</p>
            <div :class="{'left-people': item.from !== JsonBig.stringify($store.state.userInfo.uid), 'right-people': item.from === JsonBig.stringify($store.state.userInfo.uid)}">
              <img class="avator" :src="item.icon" alt="" @click="toHomepage(item.from)">
              <p>
                <i></i>
                <span v-if="item.msg.type === 1" class="images">
                  <img
                    :src="item.msg.content"
                    alt=""
                    @load="imgLoad(curChat, item.time)"
                    @error="imgError(curChat, item.time, item.msg.content)"
                    @click="showBigPicture(!item.isLoding && !item.isFail, item.msg.content)"
                  >
                </span>
                <span v-if="item.msg.type === 0" v-html="item.msg.content" class="msg-text"></span>
                <img src="/static/images/loding.png" class="lodingFlag" v-if="item.isLoding">
                <img src="/static/images/hint.png" class="failFlag" v-if="!item.isLoding && item.isFail">
              </p>
            </div>
          </div>
        </div>
          <!-- 系统消息 -->
        <div class="system-info" v-if="curChat === 'system'">
          <div v-for="item of $store.state.messages['system']" :key="item.sid">
            <img :src="item.icon ? `${HostUrl.http}image/${item.icon}` : '/static/images/default_avator.png'" alt="">
            <ul>
              <li>{{item.name}}</li>
              <li>{{item.info}}</li>
            </ul>
            <button 
              @click="addFriend(item.id, item.info ? item.info : `我是${item.name},申请添加你为好友`)"
              :disabled="friendIds.includes(item.id)"
            >
              {{friendIds.includes(item.id) ? '已同意' : '同意'}}
            </button>
          </div>
        </div>
      </div>
    </happy-scroll>
    <!-- 底部 -->
    <ol class="input-text clearfix">
      <li>
        <input type="text" :disabled="isDisable" :class="{disable: isDisable}" v-model="sendText" @keyup.enter="sendMs(sendText)">
      </li>
      <li @click="()=>{
          if(isDisable) return;
          this.$refs.up_img.click()
        }" 
        class="send-image"
      >
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
    <!-- 大图展示 -->
    <div class="big-img" v-if="showBig">
      <span>
        <img
          src="/static/images/close_btn_tr.png"
          ref="bigPic"
          alt=""
          @click="()=>{this.showBigSrc = ''; this.showBig = false}"
          >
        </span>
      <div class="picture">
        <img v-if="showBigSrc" :src="showBigSrc" alt="">
      </div>
    </div>
    <!-- 添加好友弹窗 -->
    <AddFriend
      v-if="showAddFriend"
      :addFriendShow="showAddFriend"
      @offAddFriend="openAddFriend"
      :id="curChat"
      :name="chat[index].nickName"
      :icon="chat[index].icon"
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
  import AddFriend from '@/views/news/AddFriend' // 添加好友
  import AddGroup from '@/views/news/AddGroup' // 添加群
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import GroupInfo from '@/views/news/GroupInfo' // 查看群
  import { HappyScroll } from 'vue-happy-scroll'

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
        sendFile: '',
        showBig: false,
        showBigSrc: '',
        userId: this.JsonBig.stringify(this.$store.state.userInfo.uid),
        reqMessage: ''
      }
    },
    components: {
      AddFriend,
      AddGroup,
      BasePopup,
      GroupInfo,
      HappyScroll
    },
    mounted() {
      // this.WsProxy.send('control', 'del_friend', {gid: this.JsonBig.parse('212274182791106560') , id: this.JsonBig.parse('208353226179743744')}).then(data => {
      //     console.log('del_friend', data)
      //   }).catch(error=>{
      //     console.log(error)
      //   })
      this.beFriend()//监听被加好友
      this.beAddedGroup()//监听被加入群
      //监听其他页面调用聊天窗口
      this.Bus.$on('contactSomeone',({id, msg})=> {
        this.contactSomeone(id, msg)
      });
    },
    destroyed() {
      this.Bus.$off('contactSomeone');
    },
    computed: {
      title() {
        let result = '';
        this.$store.state.chat.forEach(item=> {
          if (item.id === this.$store.state.curChat) {
            result = item.nickName
            item.length && (result += `(${item.length})`)
          }
        })
        return result
      },
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
      chatIds() {
        return this.$store.state.chat.map(item=>{
          return item.id;
        })
      },
      mapCurMembers() {
        let obj = {}
        if(!this.chat[this.index].group && !this.chat[this.index].isSingle) {
          obj[this.curChat] = this.chat[this.index].icon
          return obj;
        }
        this.$store.state.groupList.filter(item => {
          return this.curChat === this.JsonBig.stringify(item.id)
        })[0].members.forEach(item => {
          obj[this.JsonBig.stringify(item.id)] = item.icon ? `${this.HostUrl.http}image/${item.icon}` : "/static/images/default_avator.png"
        })
        return obj
      },
      mapAddress(){
        return this.$store.state.moneyAddress.map(item => {
           if(item.type === 1) {
              return {text: `支付宝:${item.number}`, sendText: `收款人:${item.name}<br>支付宝账号:${item.number}`}
            }
            if(item.type === 2) {
              return {text: `微信:${item.number}`, sendText: `收款人:${item.name}<br>微信账号:${item.number}`};
            }
            if(item.type === 4) {
              return {text: `${item.bank + '****' + (item.number.slice(-4))}`, sendText: `收款人：${item.name}<br>银行卡号:${item.number}<br> 开户行:${item.bank}`}
            }
        })
      },
      friendIds() {
        return this.$store.state.friendList.map(item => {
          return this.JsonBig.stringify(item.id)
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
    },
    methods: {
      async fetchFriendList() {
         await this.WsProxy.send('control', 'friend_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          if(!data) data = []
          this.$store.commit({type: 'getFriendList', data})
        }).catch(error=>{
          console.log(error)
        })
      },
      //其余页面入口-联系他
      async contactSomeone(id, msg) {
        let flag = this.chatIds.indexOf(id),
            friendFlag = false;
        await this.fetchFriendList();
        friendFlag = this.friendIds.includes(id);
        if(friendFlag) id = this.friendGid[id];
        await this.dealNewChat(id, friendFlag ? 1 : 0);
        this.$store.commit({type: 'changeChatBox', data: true})
        if (flag !== -1 ) {
          this.$store.commit({type: 'chatTop', data: flag})
        };
        this.$store.commit({type: 'changeCurChat', data: {id: id }})
        if (msg) this.sendMs(msg);
      },
      //更多消息
      async fetchMore(num, flag) {
        if(this.index === '') return;
        let result = [];
        let chat = this.chat[this.index];
        if(flag && this.messages[0] && !this.messages[0].id) {
          this.$store.commit({type: 'changeMoreFlag', data:{id: this.curChat, flag: false }})
          return;
        }
        await this.WsProxy.send('control', 'get_history_msgs', {
          peer_id:  chat.group || chat.isSingle ? 0 : this.JsonBig.parse(this.curChat),
          group_id: chat.group || chat.isSingle ? this.JsonBig.parse(this.curChat) : 0,
          last_msg_id: this.messages[0] && this.messages[0].id ? this.JsonBig.parse(this.messages[0].id) : 0,
          is_peer_admin: this.chat[this.index].service ? 1 : 0,
          count: num
        }).then(data => {
          (!data.msgs || data.msgs.length < num) && this.$store.commit({type: 'changeMoreFlag', data:{id: this.curChat, flag: false }})
          if (!data.msgs) return;
          let uid = this.JsonBig.stringify(this.$store.state.userInfo.uid),
              icon = this.$store.state.userInfo.icon;

          data.msgs.forEach(item => {
            let sender_id = this.JsonBig.stringify(item.sender_id),
                create_time = item.create_time * 1000;
            result.push({
              id: this.JsonBig.stringify(item.id),
              from: sender_id === uid ? uid : sender_id,
              to: sender_id === uid ? this.curChat : uid,
              icon: sender_id === uid ? (icon ? `${this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png") : this.mapCurMembers[sender_id],
              msg:{
                type: item.type === 'image' ? 1 : 0,
                content: item.type === 'image' ? `${this.HostUrl.http}file/${item.data.id}` : item.data.msg
              },
              isLoding: item.type === 'image' ? true : false,
              isFail: false,
              time: create_time
            })
          })
        })
        this.$store.commit({type: 'moreMessage', data:result })
      },
      showBigPicture(flag, src) {
        if (!flag) return;
        this.showBigSrc = src;
        this.showBig = true;
      },
      sendAddress(item) {
        this.sendMs(item)
      },
      foldAddress() {
        if(this.isDisable) return;
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
      toHomepage(id) {
        this.$router.push({ name: 'homepage', query: { uid: id }})
      },
      imgLoad(tid, time) {
        this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:0 }})
      },
      imgError(tid, time, src) {
        if (src === '') return;
        this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:1 }})
      },
      // 处理是否显示消息时间
      dealTime(time1, time2) {
        if(time2 - time1 < 180000) return false;
        return time2.formatTime()
      },
      //发送增加本地消息记录
      addStoreMessages(tid, type, content, time) {
        let obj = {
          from: this.JsonBig.stringify(this.$store.state.userInfo.uid),
          to: tid,
          icon: this.$store.state.userInfo.icon ? `${this.HostUrl.http}image/${this.$store.state.userInfo.icon}` : "/static/images/default_avator.png",
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
        flag && !this.chatIds.includes(id) && await this.WsProxy.send('control', 'group_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          this.$store.commit({type: 'getGroupList', data})
          // console.log(this.friendGid[id])
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
              console.log(uid, this.$store.state.messages)
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
          this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:0 }})
        }).catch(error => {
          this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:1 }})
        })
        this.sendText = '';
      },
      // 同意好友请求
      async addFriend(id, info) {
        this.reqMessage = info;
        await this.WsProxy.send('control', 'add_friend', {
          ack: 0,
          id: this.JsonBig.parse(id)
        }).then(data => {})
        await this.fetchFriendList()
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
      // 监听被加入群聊
      beAddedGroup() {
        this.WebSocket.onMessage['add_g_notify'] = {
          callback:async (res) => {
            if (res.body && ["add_g", "cre_g"].includes(res.body.type)) {
              let {id, aid, type, members} = res.body.data;
              await this.dealNewChat(this.JsonBig.stringify(id), 1)
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
                let icon = other.icon;
                let obj = {
                  id: 0,
                  from: this.JsonBig.stringify(id),
                  to: this.userId,
                  icon: icon ? `${this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                  msg:{
                    type: 0,
                    content: this.JsonBig.stringify(aid) === this.userId ? this.reqMessage : '已通过验证，开始对话吧'
                  },
                  isLoding: false,
                  isFail: false,
                  time: new Date() - 0
                }
                this.$store.commit({type: 'addMessages', data:{id: id, msg: obj }})
              }
              this.$store.commit({type: 'changeCurChat', data: {id: this.JsonBig.stringify(id)}})
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
    },
    watch: {
      curChat:{
        handler(curvalue){
          let messages = this.$store.state.messages[curvalue];
          if (!messages || messages && messages.length === 0) {
            this.fetchMore(3)
          }
        },
        immediate: true
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
              border-radius 2px
            li:hover
              background #474747
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
    .news-info-talk
      width 399px
      text-align center
      .more-info
        font-size 12px
        color #FF794C
        padding-top 10px
        margin-bottom 5px
        cursor pointer
      .time-info
        display inline-block
        padding 0px 5px
        margin 0 auto
        margin-bottom 20px
        font-size 12px
        background #E1E1E1
        border-radius 2px
        color #999
      div
        width 390px
        font-size 12px
        margin-bottom 15px
        img
          width 30px
          height 30px
          border-radius 50%
          vertical-align top
        p
          display inline-block
          position relative
          span
            display inline-block
            max-width 250px
            padding 5px
            border-radius 2px
            margin-top 2px
            word-wrap break-word
            &.images
              width 90px
              height 60px
              img
                width 100%
                height 100%
                border-radius 0
                cursor url('/static/images/bigger.ico'), auto;
          i
            position absolute
            top 9px
            display block
            border-width 5px 8px
            border-style solid dashed dashed
            font-size 0
            line-height 0
      .messages
        width 100%
        margin 0
        .lodingFlag, .failFlag
          position absolute
          width 12px
          height 12px
        .lodingFlag
          animation mymove 1.5s linear infinite;
          -webkit-animation mymove 1.5s linear infinite;
      .left-people
        float left
        margin-left 10px
        text-align left
        .lodingFlag, .failFlag
          right -22px
          top 50%
          margin-top -6px
        .avator
          // background aquamarine
          margin-right 10px
          cursor pointer
        span
          background #E1E1E1
        i
          left -16px
          border-color transparent #E1E1E1 transparent transparent
      .right-people
        float right
        margin-right 10px
        text-align right
        .lodingFlag, .failFlag
          left -22px
          top 50%
          margin-top -6px
        .avator
          float right
          // background aquamarine
          cursor pointer
          margin-left 10px
        span
          float right
          text-align left
          margin-right 10px
          background #FFB422
        i
          right -6px
          border-color transparent transparent transparent #FFB422
    .blank
      width 399px
      padding-top 10px
      text-align center
    .system-info
      width 399px
      max-height 320px
      padding-top 10px
      div
        display flex
        align-items center
        width 345px
        height 37px
        padding 12px 20px 11px 15px
        background #FFF
        margin 10px auto 0
        img
          width 37px
          height 37px
          border-radius 50%
          // background aquamarine
          margin-right 16px
        button
          width 56px
          height 24px
          background #FFB422
          border-radius 2px
          color #FFF
          margin-left 46px
          cursor pointer
        ul
          li
            width 190px
          li:first-child
            font-size 14px
          li:last-child
            font-size 12px
            color #999
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
          top -81px
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
            line-height 25px
            color #FFF
            cursor pointer
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
    .big-img
      box-sizing()
      position absolute
      left -400px
      top 0
      width 400px
      height 420px
      padding 44px 20px 0 20px
      background $col6FA
      box-shadow -2px -2px 8px 0 rgba(51, 51, 51, 0.30)
      span
        position absolute
        top 15px
        right 23.5px
        img
          width 10px
          height 10px
          cursor pointer
      .picture
        width 100%
        height 100%
        overflow auto
        text-align center
        vertical-align middle
        img
          max-width 100%
          height auto
          position relative
          left 0
          top 50%
          transform translateY(-50%)
          -ms-transform translateY(-50%)
          -moz-transform translateY(-50%)
          -webkit-transform translateY(-50%)
          -o-transform translateY(-50%)

  /*弹窗*/
  .belive-layer, .address-layer
    text-align center
    line-height 50px
    font-size 12px
</style>
