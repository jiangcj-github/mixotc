<template>
  <span v-if="countDownShow">{{content}}</span>
</template>
<script>
  export default {
    data() {
      return {
        content: '',
        time: this.endTime,
        countDownShow: true
      }
    },
    props: {
      endTime: {
        type: Number
      }
    },
    mounted() {
      this.countdowm()
    },
    methods: {
      countdowm() {
        let _this = this;
        let timer = setInterval(function () {
          _this.time -= 1000;
          // console.log(_this.time)
          if (_this.time > 0) {
            let day = Math.floor(_this.time / 86400000);
            let hour = Math.floor((_this.time / 3600000) % 24);
            let min = Math.floor((_this.time / 60000) % 60);
            let sec = Math.floor((_this.time / 1000) % 60);
            hour = hour < 10 ? "0" + hour : hour;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;
            if (day > 0) {
              _this.content = `还剩${day}天${hour}小时${min}分${sec}秒`;
            }
            if (day <= 0 && hour > 0) {
              _this.content = `还剩${hour}小时${min}分${sec}秒`;
            }
            if (day <= 0 && hour <= 0) {
              _this.content = `还剩${min}分${sec}秒`;
            }
          } else {
            clearInterval(timer);
            _this.countDownShow = false;
            location.reload()
          }
        }, 1000);
      }
    }
  }
</script>

