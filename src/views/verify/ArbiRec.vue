<template>
  <LeftLayout :leftBar="4">
    <div class="right" slot="right">
      <div class="head">
        <div class="filter">
          <div class="f1">
            <a class="drop-down" @click="ft_res_show=!ft_res_show" @blur="ft_res_show=false" href="javascript:void(0)">
              {{ft_ress[ft_res_sel].text}}
              <ul v-show="ft_res_show" class="drop">
                <li @click="ft_res_sel=i" v-for="(e,i) in ft_ress" :key="i">{{e.text}}</li>
              </ul>
            </a>
          </div>
          <div class="f2">
            <img src="/static/images/date_icon.png" class="data-icon">
            <DatePicker text="开始日期"></DatePicker>
            <span class="to">-</span>
            <DatePicker text="截止日期"></DatePicker>
          </div>
          <div class="f3">
            <a href="javascript:void(0)" :class="{active:flt_days==1}" @click="flt_days=1">今天</a>
            <a href="javascript:void(0)" :class="{active:flt_days==3}" @click="flt_days=3">三天</a>
            <a href="javascript:void(0)" :class="{active:flt_days==7}" @click="flt_days=7">七天</a>
          </div>
        </div>
        <div class="search-wrap">
          <div class="search">
            <input type="text" placeholder="搜索商家昵称/账号">
            <a href="javascript:void(0)"></a>
          </div>
        </div>
      </div>
      <div class="tb-head">
        <span class="tjsj sortable">提交时间<i class="sort"></i></span>
        <span class="ddxx">订单信息</span>
        <span class="sqr">申请人</span>
        <span class="sqdx">申请对象</span>
        <span class="zcr">仲裁人</span>
        <span class="wcsj">完成时间</span>
        <span class="ys sortable">用时<i class="sort"></i></span>
        <span class="jg">结果</span>
        <span class="zrr">责任人</span>
        <span class="cz">操作</span>
      </div>
      <div class="li" v-for="item of 4">
        <div class="booth">
          <div class="tjsj"><p>2016/03/09</p><p>13:43</p></div>
          <div class="ddxx"><p>购买BTC</p></div>
          <div class="sqr">
            <p>lihh</p>
            <router-link tag="p" to="" class="contact"><img src="/static/images/talk.png">联系他</router-link>
          </div>
          <div class="sqdx">
            <p>lihh</p>
            <router-link tag="p" to="" class="contact"><img src="/static/images/talk.png">联系他</router-link>
          </div>
          <div class="zcr"><p>李小蹦</p></div>
          <div class="wcsj"><p>2016/03/09</p><p>13:43</p></div>
          <div class="ys"><p>6min30s</p></div>
          <div class="jg"><p>强制放币</p></div>
          <div class="zrr"><p>lihh</p></div>
          <div class="cz"><p><a href="javascript:void(0)" class="ck" @click="showPop">查看</a></p></div>
        </div>
        <div class="division"></div>
        <div class="remark">备注：照片不清晰，模糊看不清</div>
      </div>
      <Pagination total="43" pageSize="2" emitValue="changeArbiPage" style="width:1000px;margin-top:20px"></Pagination>
      <BasePopup :show="show_pop" :width="746" :height="500">
        <div class="pop">
          <h2>沟通记录：</h2>
          <div class="p-ul">
            <p class="p-li"><span class="xxsj">信息时间</span><span class="fjr">发件人</span><span class="xxnr">信息内容</span></p>
            <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
            <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
            <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
            <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
            <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
            <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
          </div>
          <i class="close" @click="show_pop=false">&times;</i>
        </div>
      </BasePopup>
    </div>
  </LeftLayout>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DatePicker from "@/components/common/DatePicker";
  import BasePopup from "@/components/common/BasePopup";
  import LeftLayout from "./layout/LeftLayout";

  export default {
    components: {
      LeftLayout,
      Pagination,
      DatePicker,
      BasePopup,
    },
    data() {
      return {

        ft_res_show: false, //结果过滤
        ft_res_sel: 0,
        ft_ress:[
          {text:"全部结果",value:""},
          {text:"强制放币",value:""},
          {text:"撤销申诉",value:""},
          {text:"终止交易",value:""},
        ],

        flt_days: 1,
        show_pop: false,  //查看-弹窗框
      }
    },
    mounted(){
      this.Bus.$on('changeArbiPage',(p) => {

      });
    },
    methods: {
      showPop(){
        this.show_pop=true;
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .right
    width 1000px
    margin-left 200px
    min-height 500px
    .head
      background #fff
      .filter
        height 50px
        padding 0 30px
        display flex
        align-items center
        .f1
          flex-grow 1
          >a
            display inline-block
            line-height 50px
            font-size 13px
            letter-spacing 0.27px
            width 65px
            text-align center
            &.drop-down
              position relative
              cursor pointer
              &::after
                content ''
                display block
                width 0
                height 0
                border-top 5px solid #333333
                border-left 5px solid transparent
                border-right 5px solid transparent
                position absolute
                right -15px
                top 50%
                margin-top -3px
              &:hover .drop
                display block
              .drop
                position absolute
                top 40px
                left 0
                background #FFFFFF
                border 1px solid #E1E1E1
                width 80px
                z-index 1000
                >li
                  float none
                  text-align center
                  height 30px
                  line-height 30px
                  &:hover
                    background #FFF3EB
                  .f2
                    display inline-flex
                    align-items center
                    margin-right 20px
                    .data-icon
                      margin-right 10px
                    .to
                      width 15px
                      text-align center
                  .f3
                    font-size 13px
                    letter-spacing 0.27px
                    background #FFF3EB
                    border 1px solid #FFF3EB
                    border-radius 2px
                    display inline-flex
                    align-items center
                    height 30px
                    box-sizing border-box
                    padding 0 1px
                    >a
                      width 50px
                      line-height 26px
                      display inline-block
                      text-align center
                      color #999
                      &.active
                        background #FFFFFF
                        border-radius 2px
                        color #FFB422

        .f2
          display inline-flex
          align-items center
          margin-right 20px
          .data-icon
            margin-right 10px
          .to
            width 15px
            text-align center
        .f3
          font-size 13px
          letter-spacing 0.27px
          background #FFF3EB
          border 1px solid #FFF3EB
          border-radius 2px
          display inline-flex
          align-items center
          height 30px
          box-sizing border-box
          padding 0 1px
          >a
            width 50px
            line-height 26px
            display inline-block
            text-align center
            color #999
            &.active
              background #FFFFFF
              border-radius 2px
              color #FFB422


      .search-wrap
        height 50px
        padding 10px 30px
        box-sizing border-box
        .search
          width 456px
          height 30px
          border 1px solid #E1E1E1
          border-radius 2px 2px 2px 0
          display inline-flex
          >input
            padding 0 10px
            flex-grow 1
          >a
            display inline-block
            flex-shrink 0
            width 72px
            background url(/static/images/search.png) no-repeat center center
            background-color #e1e1e1
            &:hover
              background-color #dcd5d5
    .tb-head
      height 50px
      padding 0 30px
      span
        display inline-block
        line-height 50px
        font-size 13px
        color #999999
        letter-spacing 0.27px
        &.sortable
          cursor pointer
          .sort
            position relative
            margin-left 3px
            &:before
              content ''
              border-left 5px solid transparent
              border-right 5px solid transparent
              border-bottom:5px solid #999
              position absolute
              right -15px
              top 50%
              margin-top -6px
            &:after
              content ''
              border-left 5px solid transparent
              border-right 5px solid transparent
              border-top 5px solid #999
              position absolute
              right -15px
              top 50%
              margin-top 1px

            &.sort-up
              &:before
                border-bottom-color #ffb422
            &.sort-down
              &:after
                border-top-color #ffb422
          &:hover
            color #666
    .li
      padding 0 30px
      background #fff
      border 1px solid #E1E1E1
      margin-bottom 10px
      span
        display inline-block
      .booth
        font-size 14px
        color #333333
        letter-spacing 0.16px
        padding 15px 0
        box-sizing border-box
        >div
          display inline-block
          vertical-align top
          >p
            line-height 20px
            margin-top 10px
            &.contact
              font-size 11px
              color #FFB422
              letter-spacing 0.23px
              cursor pointer
              img
                width 18px
                height auto
                margin-right 10px
                vertical-align -4px
              &:hover
                color #dca02a
        .ddxx p
          color #57A100
        .jg p
          color #FF794C
        .cz p a
          color #FFB422
          &:hover
            color #dca02a
      .division
        height 1px
        background: #E1E1E1;
      .remark
        height 50px
        line-height 50px
        font-size: 13px;
        color: #999999;
        letter-spacing: 0.23px;
    .tjsj
      width 100px
    .ddxx
      width 80px
    .sqr
      width 80px
    .sqdx
      width 100px
    .zcr
      width 100px
    .wcsj
      width 100px
    .ys
      width 80px
    .jg
      width 80px
    .zrr
      width 80px
    .cz
      width 90px
    .pop
      padding 40px 10px 40px 60px
      position relative
      width 746px
      height 500px
      box-sizing border-box
      h2
        height 30px
        padding-left 5px
        line-height 30px
        font-size $fz20
        font-weight bold
        color $col333
        letter-spacing 0.41px
        margin-bottom 30px
        &::before
          display inline-block
          position relative
          top 2px
          left 0
          content ''
          width 3px
          height 20px
          margin-right 10px
          background-color $col422
      .p-ul
        overflow-y auto
        height 360px
        .p-li
          font-size 14px
          letter-spacing 0.16px
          line-height 20px
          margin-bottom 20px
          padding-left 5px
          span
            color #333
            display inline-block
          .xxsj
            width 180px
          .xxnr
            width 350px
          .fjr
            width 90px
      .close
        position absolute
        top 10px
        right 10px
        font-size 20px
        cursor pointer
        display inline-block
        line-height 24px
        width 24px
        text-align center
</style>
