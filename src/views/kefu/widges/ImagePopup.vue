<template>
  <div class="wrap" @dragstart.prevent="" @mouseup="onMouseUp" @mousemove="onMouseMove" @wheel="onWheel">
    <img :src="url" @mousedown="onMouseDown" ref="img">
    <button @click="close">&times;</button>
  </div>
</template>
<script>
  export default {
    props: {
      url: {type: String, default: "",},
      onClose:{type: String, default: "onIpClose"},
      maxW: {type:Number,default: 1000},
      maxH: {type:Number,default: 1000},
      minW: {type:Number,default: 100},
      minH: {type:Number,default: 100},
    },
    data(){
      return {
        move: false,
        x: 0,
        y: 0,
        level: 0,

        mleft: 0,
        mtop: 0,
        w: 0,
        h: 0,
        nw: 0,
        nh: 0,

      }
    },
    mounted(){
      this.initWh();
    },
    methods:{
      close(){
        this.Bus.$emit(this.onClose);
      },
      initWh(){
        let nw=this.$refs.img.naturalWidth;
        let nh=this.$refs.img.naturalHeight;
        let nw2=nw;
        let nh2=nh;
        if(nw>this.maxW){
          nw2=this.maxW;
          nh2=nh/nw*nw2;
        }else if(nw<this.minW){
          nw2=this.minW;
          nh2=nh/nw*nw2;
        }else if(nh>this.maxH){
          nh2=this.maxH;
          nw2=nw/nh*nh2;
        }else if(nh<this.minH){
          nh2=this.minH;
          nw2=nw/nh*nh2;
        }
        this.nw=nw2;
        this.nh=nh2;
        this.w=nw2;
        this.h=nh2;
        this.draw();
      },
      zoom(d){
        let level2=this.level+d;
        let w2,h2;
        if(level2>=0){
          w2=this.nw*(1+level2/3);
          h2=this.nh*(1+level2/3);
        }else{
          w2=this.nw*(1+level2/13);
          h2=this.nh*(1+level2/13);
        }
        if(w2>this.maxW||w2<this.minW||h2>this.maxH||h2<this.minH){
          return;
        }
        this.level=level2;
        this.w=w2;
        this.h=h2;
        this.draw();
      },
      onWheel(e){
        if(e.deltaY>0){
          //向下滚动
          this.zoom(-1);
        }else{
          //向上滚
          this.zoom(1);
        }
      },
      onMouseDown(e){
        this.move=true;
        this.x=e.clientX;
        this.y=e.clientY;
      },
      onMouseUp(e){
        this.move=false;
      },
      onMouseMove(e){
        if(this.move){
          let dx=e.clientX-this.x;
          let dy=e.clientY-this.y;
          this.mleft+=dx;
          this.mtop+=dy;
          this.x=e.clientX;
          this.y=e.clientY;
          this.draw();
        }
      },
      draw(){
        this.$refs.img.style.marginLeft=this.mleft+"px";
        this.$refs.img.style.marginTop=this.mtop+"px";
        this.$refs.img.style.width=this.w+"px";
        this.$refs.img.style.height=this.h+"px";
      }
    }
  }
</script>
<style scoped lang="stylus">
  .wrap
    position fixed
    background rgba(0, 0, 0, 0.4)
    z-index 1000
    top 0
    left 0
    height 100%
    width 100%
    user-select none
    >img
      position absolute
      left 50%
      top 50%
      transform translateX(-50%) translateY(-50%)
      border-radius 2px
      background #fff
    >button
      background transparent
      position absolute
      right 10px
      top 10px
      color #fff
      cursor pointer
      height 50px
      line-height 50px
      width 50px
      font-size 28px
      font-weight bold
      text-align center
      &:hover
        color #ccc
</style>
