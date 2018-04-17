<template>
  <Left :leftBar="3">
    <div class="right" slot="right">

    </div>
  </Left>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DatePicker from "@/components/common/DatePicker";
  import BasePopup from "@/components/common/BasePopup";
  import Left from "./layout/Left";
  export default {
    components: {
      Left,
      BasePopup,
      Pagination,
      DatePicker,
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style scoped lang="stylus">


</style>
