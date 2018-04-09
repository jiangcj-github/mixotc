<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
    <News></News>
  </div>
</template>

<script>
  import Header from '@/components/common/Header'
  import Footer from '@/components/common/Footer'
  import News from '@/views/news/News'


  export default {
    name: 'App',
    components: {
      Header,
      Footer,
      News
    },
    data() {
      return {

      }
    }
  }
</script>

<style>
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
