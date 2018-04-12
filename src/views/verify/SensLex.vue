<template>
  <LeftLayout :leftBar="3">
    <div class="right" slot="right">

    </div>
  </LeftLayout>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DatePicker from "@/components/common/DatePicker";
  import BasePopup from "@/components/common/BasePopup";
  import LeftLayout from "./layout/LeftLayout";
  export default {
    components: {
      LeftLayout,
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
