<template>
  <Left :leftBar="4">
    <div class="right" slot="right">
      <div class="head">
        <div class="filter">
          <div class="f1">
              <div class="search">
                <span @click="srchUlShow=!srchUlShow" @blur="srchUlShow=false" tabindex="0">搜索{{srchUls[srchUlSel].text}}</span>
                <ul v-show="srchUlShow">
                  <li v-for="(e,i) in srchUls" :key="i" @mousedown="srchUlSel=i">{{e.text}}</li>
                </ul>
                <input type="text" v-model="srchInput" title="">
                <img src="/static/images/cancel_icon.png" @click="srchInput=''" v-show="srchInput.length>0">
                <a href="javascript:void(0)"></a>
              </div>
          </div>
          <div class="f2">
            <DateInterval onChange="onDateChange"></DateInterval>
          </div>
          <div class="f3">
            <a href="javascript:void(0)" :class="{active:flt_days==1}" @click="flt_days=1">今天</a>
            <a href="javascript:void(0)" :class="{active:flt_days==3}" @click="flt_days=3">三天</a>
            <a href="javascript:void(0)" :class="{active:flt_days==7}" @click="flt_days=7">七天</a>
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
      <Pagination :total="43" :pageSize="2" emitValue="changeArbiPage" style="width:1000px;margin-top:20px"></Pagination>
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
  </Left>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DateInterval from "@/components/common/DateInterval";
  import BasePopup from "@/components/common/BasePopup";
  import SearchInput from "@/components/common/SearchInput";
  import Left from "./layout/Left";

  export default {
    components: {
      Left,
      Pagination,
      DateInterval,
      BasePopup,
      SearchInput,
    },
    data() {
      return {

        srchUls: [
          {text: "申诉人", key: ""},
          {text: "申诉对象", key: ""},
          {text: "处理人", key: ""},
          {text: "责任人", key: ""},
          {text: "订单号", key: ""},
        ],
        srchUlSel: 0,
        srchUlShow: false,
        srchInput: "",

        fltDate1: "",
        fltDate2: "",

        fltDays: 0,


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
      this.Bus.$on("onPageChange",(p) => {

      });
      this.Bus.$on("onDateChange",(date1,date2)=>{
        this.fltDate1=date1;
        this.fltDate2=date2;
        console.log(date1+"--"+date2);
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
          height 30px
          .search
            width 456px
            height 30px
            box-sizing border-box
            border 1px solid #E1E1E1
            border-radius 2px
            display inline-flex
            position relative
            >span
              font-size 13px
              color #999
              letter-spacing 0
              line-height 28px
              padding 0 15px 0 10px
              display inline-block
              position relative
              cursor pointer
              outline none
              &:after
                content ""
                border 5px solid transparent
                border-top-color #ffb422
                position absolute
                top 13px
                right 0
            >ul
              position absolute
              left -1px
              right -1px
              top 29px
              background #fff
              border 1px solid #e1e1e1
              z-index 100
              >li
                padding 0 10px
                line-height 30px
                cursor pointer
                color #333
                font-size 13px
                &:hover
                  background #fff3eb
            >img
              align-self center
              margin-right 10px
              &:hover
                cursor pointer
                opacity 0.8
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
