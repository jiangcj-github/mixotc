<template>
  <div class="delet-group-wrap" v-show="groupShow">
    <p class="wrap-title">
      <span>删除群成员</span>
      <i @click="doDelete">确定</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <div class="search_user">
      <input type="text" placeholder="查找昵称/账号" v-model="searchText" @blur="search" @input="input" @keyup.enter="search"/>
      <img src="/static/images/search_gray.png" alt="" @click="search">
    </div>
    <ul class="clearfix">
      <li v-for="item of searchFlag ? memberRange : groupMembers" :key="item.id">
        <img :src="item.icon ? `${HostUrl.http}image/${item.icon}` : `/static/images/default_avator.png`" alt="" class="head-portrait">
        <img src="/static/images/del_user_icon.png" class="del-head" alt="" @click="delMember(item.id)">
        <p>{{item.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "delet-group",
    props: ['delGroupShow', 'members', 'curChat'],
    data() {
      return {
        searchFlag: false,
        searchText: '',
        groupShow: this.delGroupShow,
        groupMembers: this.members.filter(item =>{
          return this.JsonBig.stringify(this.$store.state.userInfo.uid) !== this.JsonBig.stringify(item.id);
        }).map(item => {
          let copy = {}
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              copy[key] = item[key];
            }
          }
          copy.id = this.JsonBig.stringify(item.id)
          return copy
        }),
        memberRange: [],
        deleteArray: []
      }
    },
    mounted() {
      console.log(this.members)
    },
    watch: {
      delGroupShow(state) {
        if (state === true ) {
          this.groupShow = true
        } else  {
          this.groupShow = false
        }
      }
    },
    methods: {
      input() {
        this.searchText === '' && (this.searchFlag = false)
      },
      search() {
        if (this.searchText === '') return;
        this.searchFlag = true;
        this.memberRange = this.groupMembers.filter(item => {
          return item.name.includes(this.searchText) || item.phone && item.phone.includes(this.searchText) || item.email && item.email.includes(this.searchText)
        })
      },
      delMember(id) {
        this.groupMembers = this.groupMembers.filter(item => {
          return item.id  !== id;
        })
        this.searchFlag && (this.memberRange = this.memberRange.filter(item => {
          return item.id  !== id;
        }))
        this.deleteArray.push(this.JsonBig.parse(id))
      },
      closeGroup() {
        this.$emit('offDelGroup', 'false')
      },
      async doDelete() {
        await this.WsProxy.send('control', 'del_g_member',{
          id: this.JsonBig.parse(this.curChat),
          ids: this.deleteArray
        }).then(data => {})
        this.closeGroup()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .delet-group-wrap
    position absolute
    right 0px
    bottom 0px
    width 300px
    height 420px
    background #FFF
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
    .search_user
      text-align center
      margin-top 12px
      position relative
      input
        width 270px
        height 30px
        padding-left 10px
        font-size $fz13
        background  #F4F6FA
        border-radius 2px
        placeholder()
      img
        position absolute
        top 7px
        right 18px
        width 18px
        height 18px
    ul
      margin 20px 13px
      li:nth-child(5n)
        margin-right 0
      li
        position relative
        float left
        width 40px
        text-align center
        margin-right 18.5px
        margin-bottom 20px
        .head-portrait
          width 30px
          height 30px
          // background aquamarine
          border-radius 50%
          vertical-align middle
          margin-bottom 5px
        .del-head
          position absolute
          top 0
          right 2px
          width 12px
          height 12px
          cursor pointer
        p
          margin 0 auto
          width 37px
          font-size 12px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis

</style>


