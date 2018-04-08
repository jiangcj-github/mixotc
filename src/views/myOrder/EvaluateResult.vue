<template>
  <div>
    <div>
      <img v-for="url in imgList" :src="url" >
      <span>中评</span>
    </div>
    <textarea>

    </textarea>
  </div>
</template>

<script>
  export default {
    name: "evaluate-result",
    data() {
      imgList: ['/static/images/visit.pn']
    }
  }
</script>

<style scoped>

</style>
