<template>
  <div id="kefu">
    <Dialog></Dialog>
  </div>
</template>

<script>
  import Dialog from '@/views/kefu/Dialog'

  export default {
    name: 'kefu',
    components: {
      Dialog
    }
  }
</script>

<style lang="stylus">
  @import "stylus/base.styl";
  #kefu {
    height: 100%;
    box-sizing()
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
