<template>
    <div class="cc-button-group" :class="direction">
        <slot></slot>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-button-group'
export default {
    name: COMPONENT_NAME,
    props: {
      direction:{
        type: String,
        default: 'column'
      }
      
    },
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
    .column{
        display: flex;
        flex-direction: column;
    }
</style>