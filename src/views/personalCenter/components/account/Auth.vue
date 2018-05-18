<template>
  <div>
    实名认证{{num}}
    <button @click="num++">加</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        num: 0
      }
    }
  }
</script>

<style scoped>

</style>