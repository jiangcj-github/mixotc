<template>
  <div class="block">
    <el-slider
      v-model="sliderValue"
      :min="min"
      :max="max"
      @change=""
      show-input>
    </el-slider>
  </div>
</template>

<script>
  export default {
    props:{
      min:{
        type: Number,
        default: 10
      },
      max:{
        type: Number,
        default: 30
      }
    },
    data() {
      return {
        sliderValue: 0
      };
    },
    methods: {

    }
  };
</script>
<style lang="stylus">

</style>
