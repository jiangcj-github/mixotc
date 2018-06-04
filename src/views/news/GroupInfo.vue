<template>
  <div class="group-info-wrap" v-show="groupInfoShow">
    <p class="wrap-title">
      <span>群信息</span>
      <i @click="quitFlag = true">退出该群</i>
      <img src="/static/images/close_btn_tr2.png" class="close-btn-img" @click="closeGroup">
    </p>
    <ol>
      <li>
        <span>群名称</span>
        <input 
          type="text" 
          v-model="groupName" 
          :placeholder="(!groupInfo || !groupInfo.name || groupInfo.name === $store.state.userInfo.name) ? '编辑群名称' : groupInfo.name"
          @blur="updateGroup"
          maxlength="30"
        />
      </li>
      <li>
        <span>群主</span>
        <img :src="owner.icon ? `${HostUrl.http}image/${owner.icon}` : `/static/images/default_avator.png`" alt="">
        <b>{{owner && owner.name}}</b>
      </li>
    </ol>
    <h1>群成员({{members.length + '/300'}})</h1>
    <div class="operation">
      <img src="/static/images/add_user.png" alt="" @click="openAddGroup">
      <img src="/static/images/del_user.png" alt="" @click="openDelGroup" v-if="isOwner">
    </div>
    <happy-scroll :style="{width:'300px', height:`${members.length > 20 ? 177 : 197 }px`}" resize bigger-move-h="start" hide-horizontal>
      <ul class="clearfix">
        <li v-for="item of showMembers" :key="item.name">
          <img :src="item.icon ? `${HostUrl.http}image/${item.icon}` : `/static/images/default_avator.png`" alt="">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </happy-scroll>
    <div class="more" v-if="showMembers.length > 20">
      <span class="all" v-if="!isAll" @click="isAll = true">查看群成员</span>
      <span class="pickup" v-else @click="isAll = false">收起</span>
    </div>
    <!-- 删除群成员 -->
    <DeletGroup 
      v-if="showDelGroup" 
      :delGroupShow="showDelGroup" 
      @offDelGroup="openDelGroup"
      :members="members"
      :curChat="id"
    >
    </DeletGroup>
    <!-- 新增群成员 -->
    <AddGroup 
      v-if="showAddGroup" 
      :addGroupShow="showAddGroup" 
      @offAddGroup="openAddGroup"
      :curChat="id"
      :groupInfo="groupInfo"
      :isNewGroup="false"
    ></AddGroup>
    <BasePopup
      class="quit-popup"
      :width="235"
      :height="117"
      :top="50"
      :show="quitFlag"
      :wrapStyleObject="popupWrap"
    >
      <slot>
        <div class="contents">
          <p>确定退出？</p>
          <div class="button">
            <button class="cancel" @click="quitFlag = false">取消</button>
            <button class="confirm" @click="quit">确定</button>
          </div>
        </div>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
  import AddGroup from '@/views/news/AddGroup' // 添加群
  import DeletGroup from '@/views/news/DeletGroup' // 删除群成员
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  // import { HappyScroll } from 'vue-happy-scroll'

  export default {
    name: "group-info",
    props: ['checkGroupShow', 'id'],
    data() {
      return {
        isAll: false,
        quitFlag: false,
        groupName: '',
        groupInfoShow: this.checkGroupShow,
        showDelGroup: false,
        showAddGroup: false,
        popupWrap: {
          width: '560px',
          height: '420px',
          right: 0,
          bottom: 0
        }
      }
    },
    components: {
      DeletGroup,
      AddGroup,
      BasePopup,
      // HappyScroll
    },
    async created() {
      await this.fetchGroup()
      this.groupName = this.groupInfo.name
      this.$store.commit({type: 'updateGroupInfo', data: { id : this.id}})
    },
    computed: {
      isOwner() {
        if (!this.owner)  return false;
        return this.owner.name === this.$store.state.userInfo.name
      },
      groupInfo() {
        return this.$store.state.groupList.filter(item => {
          return this.JsonBig.stringify(item.id) === this.id
        })[0]
      },
      owner() {
        if (!this.groupInfo) return false;
        return this.groupInfo.members.filter(item => {
          return this.JsonBig.stringify(this.groupInfo.aid) === this.JsonBig.stringify(item.id); 
        })[0]
      },
      members() {
        if (!this.groupInfo) return [];
        return this.groupInfo.members
      },
      showMembers() {
        if(!this.isAll) {
          return this.members.slice(0,20)
        }
        return this.members
      }
    },
    watch: {
      checkGroupShow(state) {
        if (state === true ) {
          this.groupInfoShow = true
        } else  {
          this.groupInfoShow = false
        }
      }
    },
    methods: {
      async fetchGroup() {
        await this.$store.dispatch({ type: 'getGroupList', ws: this.WsProxy});
      },
      async quit() {
        await this.WsProxy.send('control', 'quit_group', {uid: this.$store.state.userInfo.uid, id: this.JsonBig.parse(this.id)}).then(data => {
          this.quitFlag = false;
          this.closeGroup()
          this.$store.commit({type: 'delChat', data: this.id})
        }).catch(error=>{
          console.log(error)
        })
        this.fetchGroup()
      },
      async updateGroup() {
        if (this.groupName === '') return;
        await this.WsProxy.send('control', 'update_group', 
        {
          Name: this.groupName, 
          id: this.JsonBig.parse(this.id),
        }).then(data => {
          this.$store.commit({'type':'updateGroupInfo', data: {id: this.id, name: this.groupName}})
        }).catch(error=>{
          console.log(error)
        })
      },
      closeGroup() {
        this.$emit('offCheckGroup', 'false')
      },
      openDelGroup(st) {
        if (st === 'false') {
          this.fetchGroup()
          this.showDelGroup = false
        } else {
          this.showDelGroup = true
        }
      },
      openAddGroup(st) {
        if (st === 'false') {
          this.showAddGroup = false
        } else {
          this.showAddGroup = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .group-info-wrap
    position absolute
    right 125px
    bottom 0px
    width 300px
    height 420px
    background #F4F6FA
    -webkit-box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    z-index 1
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
        color #FF794C
        cursor pointer
      img
        position absolute
        right 12px
        top 15px
        width 10px
        height 10px
        cursor pointer
    ol
      background: #FFF
      li
        height 50px
        line-height 50px
        span
          margin-left 10px
          margin-right 10px
          font-size 12px
      li:first-child
        border-bottom 1px solid #E1E1E1
        input
          width 223px
          height 30px
          background #F4F6FA
          padding-left 10px
          border-radius 2px
        ::-webkit-input-placeholder
          color #999
        :-moz-placeholder
          color #999
        ::-moz-placeholder
          color #999
        :-ms-input-placeholder
          color #999
      li:last-child
        span
          margin-right 22px
        img
          width 30px
          height 30px
          margin-right 10px
          // background aquamarine
          border-radius 50%
          vertical-align middle
    h1
      font-size 12px
      margin 10px 0 5px 10px
    .operation
      height 40px
      line-height 40px
      background #FFF
      img
        width 30px
        height 30px
        vertical-align middle
      img:first-child
        margin-left 10px
        margin-right 18px
    ul
      padding 10px 0 0 10px
      li:nth-child(5n)
        margin-right 0
      li
        float left
        width 40px
        text-align center
        margin-right 20px
        margin-bottom 20px
        img
          width 30px
          height 30px
          // background aquamarine
          border-radius 50%
          vertical-align middle
          margin-bottom 5px
        p
          margin 0 auto
          width 37px
          font-size 12px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
    .quit-popup
      .contents
        width 100%
        height 100%
        text-align center
        font-size $fz14
        letter-spacing 0.29px
        p
          padding-top 30px
        .button
          padding-top 30px
          button
            width 80px
            height 30px
            background #FFF
            border 1px solid $col422
            border-radius 2px
            cursor pointer
            &.cancel
              color $col422
              margin-right 20px
            &.confirm
              color #FFF
              background  $col422
    .more
      position absolute
      left 0
      bottom 0
      width 300px
      height 30px
      text-align center
      line-height 30px
      background #FFF
      span
        display inline-block
        position relative
        font-size $fz13
        color $col999
        letter-spacing 0.27px
        &.all::after
          position absolute
          right -11px
          bottom 9px
          content ''
          width 7px
          height 11px
          background url('/static/images/the_arrows copy.png') no-repeat;
        &.pickup::after
          position absolute
          right -16px
          bottom 12px
          content ''
          width 11px
          height 6px
          background url('/static/images/the_arrows copy 3.png') no-repeat;
      &:hover
        span
          color $col333
          cursor pointer
          &.all::after
            background url('/static/images/the_arrows.png') no-repeat;
          &.pickup::after
            background url('/static/images/the_arrows copy 2.png') no-repeat;

</style>


