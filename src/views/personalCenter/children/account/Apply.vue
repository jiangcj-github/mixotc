<template>
  <div>
    大额申请{{num}}
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
