<template>
  <div class="group-info-wrap" v-show="groupInfoShow">
    <p class="wrap-title">
      <span>群信息</span>
      <i @click="quit">退出该群</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <ol>
      <li>
        <span>群名称</span>
        <input 
          type="text" 
          v-model="groupName" 
          :placeholder="(!groupInfo.name || groupInfo.name === $store.state.userInfo.name) ? '编辑群名称' : groupInfo.name"
          @blur="updateGroup"
        />
      </li>
      <li>
        <span>群主</span>
        <img :src="owner.icon ? `${HostUrl.http}image/${owner.icon}` : `/static/images/default_avator.png`" alt="">
        <b>{{owner.name}}</b>
      </li>
    </ol>
    <h1>群成员({{members.length}})</h1>
    <div class="operation">
      <img src="/static/images/add_user.png" alt="" @click="openAddGroup">
      <img src="/static/images/del_user.png" alt="" @click="openDelGroup">
    </div>
    <ul class="clearfix">
      <li v-for="item of members" :key="item.name">
        <img :src="item.icon ? `${HostUrl.http}image/${item.icon}` : `/static/images/default_avator.png`" alt="">
        <p>{{item.name}}</p>
      </li>
    </ul>
    <!-- 删除群成员 -->
    <DeletGroup :delGroupShow="showDelGroup" @offDelGroup="openDelGroup"></DeletGroup>
    <!-- 新增群成员 -->
    <AddGroup 
      v-if="showAddGroup" 
      :addGroupShow="showAddGroup" 
      @offAddGroup="openAddGroup"
      :curChat="id"
      :groupInfo="groupInfo"
      :isNewGroup="false"
    ></AddGroup>
  </div>
</template>

<script>
  import AddGroup from '@/views/news/AddGroup' // 添加群
  import DeletGroup from '@/views/news/DeletGroup' // 删除群成员

  export default {
    name: "group-info",
    props: ['checkGroupShow', 'id'],
    data() {
      return {
        groupName: '',
        groupInfoShow: this.checkGroupShow,
        showDelGroup: false,
        showAddGroup: false
      }
    },
    components: {
      DeletGroup,
      AddGroup
    },
    created() {
      this.fetchGroup()
    },
    computed: {
      isOwner() {
        return this.owner.name === this.$store.state.userInfo.name
      },
      groupInfo() {
        return this.$store.state.groupList.filter(item => {
          return this.JsonBig.stringify(item.id) === this.id
        })[0]
      },
      owner() {
        return this.groupInfo.members.filter(item => {
          return this.JsonBig.stringify(this.groupInfo.aid) === this.JsonBig.stringify(item.id); 
        })[0]
      },
      members() {
        return this.groupInfo.members
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
        await this.WsProxy.send('control', 'group_list', {uid: this.$store.state.userInfo.uid}).then(data => {
          this.$store.commit({type: 'getGroupList', data})
        }).catch(error=>{
          console.log(error)
        })
      },
      async quit() {
        await this.WsProxy.send('control', 'quit_group', {uid: this.$store.state.userInfo.uid, id: this.JsonBig.parse(this.id)}).then(data => {
          this.closeGroup()
          this.$store.commit({type: 'delChat', data: this.id})
        }).catch(error=>{
          console.log(error)
        })
      },
      async updateGroup() {
        if (this.groupName === '') return;
        await this.WsProxy.send('control', 'update_group', 
        {
          Name: this.groupName, 
          id: this.JsonBig.parse(this.id),
        }).then(data => {

        }).catch(error=>{
          console.log(error)
        })
      },
      closeGroup() {
        this.$emit('offCheckGroup', 'false')
      },
      openDelGroup(st) {
        if(!this.isOwner) return;
        if (st === 'false') {
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
    position fixed
    right 125px
    bottom 100px
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
          background aquamarine
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
      margin 10px
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
          background aquamarine
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



</style>


