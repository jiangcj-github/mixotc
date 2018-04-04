<template>
  <div id="drag">
    <div class="drag_bg weui-btn_primary" :style="{width:curW+'px'}"></div>
    <div class="drag_text" :class="[isDragOk ? 'whitecolor':'']">{{text}}</div>
    <div class="handler" :style="{left:curW+'px'}" :class="[isDragOk ? 'handler_ok_bg':'handler_bg']"></div>
  </div>
</template>

<script>
  export default{
    name:'slider',
    props:{

    },
    data(){
      return{
        curW:0,
        isMove:false, //是否在运动
        isDragOk:false, //是否拖动成功
        maxWidth:0, //拖动的最大宽度
        element:{},
        text:'拖动滑块验证',
        currentPos:{
          x: 0,
          y: 0
        }
      }
    },
    created(){

    },
    mounted () {
      let self = this;
      this.element = document.querySelector('.handler');
      this.getMaxWidth();
      window.addEventListener('resize',function(){self.getMaxWidth()});
      window.addEventListener('orientationchange',function(){self.getMaxWidth()});


      this.element.addEventListener('touchstart',self.touchstartFun,false);
      document.querySelector('body').addEventListener('touchmove',self.touchmoveFun,false);
      document.querySelector('body').addEventListener('touchend',self.touchendFun,false);

      this.element.addEventListener('mousedown',self.touchstartFun,false);
      document.querySelector('body').addEventListener('mousemove',self.touchmoveFun,false);
      document.querySelector('body').addEventListener('mouseup',self.touchendFun,false);

      (function drawAnimate() {
        if( self.curW <= self.maxWidth){
          window.requestAnimFrame = function (drawAnimate, number) {

          };
          window.requestAnimFrame(drawAnimate,1000/60);
          self.curW = self.currentPos.x;
        }else{
          self.curW = self.currentPos.x = self.maxWidth;
        }
      })();
    },
    watch:{

    },
    methods:{
      touchstartFun(e){
        if(this.isDragOk){
          e.preventDefault();
          return;
        }
        this.isMove = true;
        this.curW = this.currentPos.x = this.getCurrentPosition(e).x;
      },
      touchmoveFun(e){
        if(this.isMove && this.curW > 0 && this.curW < this.maxWidth){
          this.currentPos.x = this.getCurrentPosition(e).x;
        }
        else if(this.isMove && this.curW >= this.maxWidth){
          this.curW = this.currentPos.x = this.maxWidth;
          this.isDragOk = true;
          this.text = "验证通过";
        }
      },
      touchendFun(e){
        this.isMove = false;
        if(this.curW < this.maxWidth){
          this.curW = this.currentPos.x = 0;
        }
      },

      getCurrentPosition(event){
        let xPos, yPos, rect;
        rect = document.getElementById('drag').getBoundingClientRect();
        //event = event.originalEvent;
        //判断是touch，还是鼠标事件
        if (event.type.indexOf('touch') !== -1) {
          xPos = event.touches[0].clientX - rect.left;
          yPos = event.touches[0].clientY - rect.top;
        }

        //鼠标事件
        else {
          xPos = event.clientX - rect.left;
          yPos = event.clientY - rect.top;
        }
        return {
          x: xPos,
          y: yPos
        }
      },
      getMaxWidth(){
        this.maxWidth = document.querySelector("#drag").clientWidth - document.querySelector(".handler").scrollWidth;
      }
    }
  }
</script>

<style scoped>
  #drag {
    position: relative;
    background-color: #e8e8e8;
    width: 320px;
    height: 40px;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
  }
  #drag .drag_bg {
    height: 40px;
    width:0;
  }
  #drag .drag_text {
    position: absolute;
    top: 0;
    width: 100%;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
  }

  #drag .handler {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 40px;
    border: 1px solid #ccc;
    cursor: move;
  }
  .handler_bg {
    background:#fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAHLdZnaAAAAAXNSR0IArs4c6QAAAldJREFUWAntWTFOAzEQ9IUI0YQyD4AGCYkSaiT+AE/hCbyCmgcgKiRqWiQ+kRIkBIhwZLisY5/X3r3YOaGQK2Lf7nhmd+2LL05V3+2fm+/6xjDXIOYAdsAMsKblnVV9u1dbHqcTpVw4zh4dvBvh06Uxu4fWObS9yYPtohMV91Ctm4U+OYYj6kXbcNDXawMenzatEy+xFAqP6BJtZ6UwnwQ7XAUHRModV0CpW2slHhLNw/2JMTQ389xCBYBfnhs3wLnrK1SYS8eazgM6z3RMOWXvHFWKLOb7QyLM4uIWXF4mWJC4XDHO1qCCT325sKjxDepenM31z/vy6gLRzth/UjgbQ04mWYSQGa2+XJkinxnjVUNRro8ZcluFXhKEcq1UAHH1NidLFkE/7D9lUm2FdeFsIcpa5HKNDoLd2nA2Sxl2ZBHs9O8TX4izhdzWIosAypFyNkvrd3QiJHR05Y+GUNvmI37v9CLYsGijIiLORj6n1YlwZJzNIXa7sghHxtlc1lZ/vTatVnLlb+U5KaC5PiK97PEFKi5SYEpW/h4hRlEA0MvaKhCnSLFJRCxRz4DNjNiC45cjNuLWQY31U0eLI3zHNn9G8NKFdyS8XqYS0uI6JkDw/ESISRuoFke8yrZcIiSoDVSLI16hLZ8IBPE8HF83xzytM0svHi3OG8TflE2EHmgcJeG5iSWhxfExs9YyiWgD0+LYUNPG/J8kOImfvhlTT9NKWlyaJepd/L8ThQgO+jNGgBktTuKJ+MssrQh5n+ZNIn1WW6O1RjMyqC5mGa/83FxT1RzMD4Ektf1dYbI5AAAAAElFTkSuQmCC") no-repeat center
  }
  .handler_ok_bg {
    background:#fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAAAXNSR0IArs4c6QAAAlJJREFUOBGNVDFrFEEU/t7exUINiRIxWgjmTiGleIigoI1FuBCjEEsLe8tYiEUKsfB+gY0E0SaCRrlgoY1go5x1ELIWQuSCSAwBFWN2fN/bnb3bza2XKWb2vfneN2/ffG8AHW5p7BNXsQ+Hk2Zwcs0xx9WG7j4pm6c0iMBcfzch/Mjg1A6INcTBM7akk2tWZ1yzsulapwfolHwoSnI1Jvcx47eBbfesbPbIOeDQBWD5npmacuU+nJv1YJn8LHFKbi7A0qNtv5FZRRpSD2/p4dUZIFrIbHqjPAicuGlHaULuofl5/vCpGEIAk9MqdPLhf7XX/3iSnqtIaDly072qXOHvZYAE1MMqfR0gmdfW5+FkSsv2FS64I5MrT31g/Ne5cvhNW+vXSyJzkfQ8MoPUY7WOwY68ukHnX5jFEmbvKw96dzn2SHS3A7zU6sDI5EH0OjkaXzaN1zWA4F+rWRD3xL2kAFZUABXahWP0wJ7AF7QQRFHUPm51Ct6LWdUpE+FzkqRAz2h1jdDom45erzbQrCfy8SlhXtQesKs10TaxYl229mO5b0ZFzANDwNaGMmnGh4fHg1iAfaqdJ2Of8I7ZKyTj4I2pmMumZiSPzN5jwJEJYFXBv9sxsHsm0dnHwPf3O7VgpDIVWGv4oJ9fgPABsF/lQRF1dy4zYntTeclr4sPSVdvs/2/EvuPAxTfAhxvAt7dpXPFHcM1ueTctWEyS7CRatKYyLWmD6001+gbmAYzh41AkbOJNSu2NaUg0rWaNXWo8fIqAlj5HixgdWmQLmb9r+gcsdOl+oRrZeQAAAABJRU5ErkJggg==") no-repeat center
  }
</style>
