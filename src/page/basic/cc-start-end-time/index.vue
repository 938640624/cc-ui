<template>
  <div class="dialog-form-page">
    <cc-header :headtitle="'StartEndTime(起止时间)'" />
    <cc-scroll>
      <cc-dialog-form
      :data="data"
      :true-message="trueMessage"
      >
      </cc-dialog-form>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "dialog-form-page";
import ccHeader from "@/components/cc-header/cc-header.vue";
import ccScroll from "@/components/cc-scroll/cc-scroll.vue";
import ccDialogForm from "@/components/cc-dialog-form/cc-dialog-form";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
    ccDialogForm,
  },
  mounted() {},
  data() {
    return {
      data: [
        {
          type: "start-end-time",
          startTime: "0",
          endTime: "1800",
        },
      ],
      trueMessage: "warning",
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
