<template>
  <div>
    <el-switch
      @change="changeSwitch"
      v-model="switchValue"
      active-color="#FFB422"
      inactive-color="#999">
    </el-switch>
  </div>
</template>

<script>
  export default {
    name: "switch-block",
    data() {
      return {
        switchValue: false
      }
    },
    methods: {
      changeSwitch(data) {
        this.Bus.$emit('switchValueType', data);
      }
    }
  }
</script>

<style lang="stylus">
  .el-switch__core
    height 24px
    border-radius 12px
    .el-switch__button
      width 20px
      height 20px
  .is-checked
    .el-switch__core
      .el-switch__button
        left -3px
</style>
