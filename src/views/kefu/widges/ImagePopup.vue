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
      onClose:{type: String, default: "onIpClose"}
    },
    data(){
      return {
        move: false,
        x: 0,
        y: 0,
        level: 0,

        mleft: 0,
        mtop: 0,
        width: "",
        height: "",
      }
    },
    methods:{
      close(){
        this.Bus.$emit(this.onClose);
      },
      zoom(w,level){
        if(level>=0){
          return w*(1+level/3);
        }else{
          return w*(1+level/13);
        }
      },
      onWheel(e){
        if(e.deltaY>0){
          //向下滚动
          if(this.level<=-10) return;
          this.level--;
        }else{
          //向上滚
          if(this.level>=10) return;
          this.level++;
        }
        let naturalWidth=this.$refs.img.naturalWidth;
        let naturalHeight=this.$refs.img.naturalHeight;
        this.width =this.zoom(naturalWidth,this.level);
        this.height =this.zoom(naturalHeight,this.level);
        this.draw();
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
        this.$refs.img.style.width=this.width+"px";
        this.$refs.img.style.height=this.height+"px";
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
