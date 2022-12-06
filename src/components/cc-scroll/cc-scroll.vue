<template>
    <div class="cc-scroll" @scroll="handleScroll">
        <slot> </slot>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-action-toast'
const EVENT_SCROLL = 'scroll'
export default {
    name: COMPONENT_NAME,
    props: {},
    data() {
        return {}
    },
    methods: {
        handleScroll() {
            this.$emit(EVENT_SCROLL, ...arguments)
        },
    },
}
</script>
<style lang="scss" scoped>
li {
    list-style: none;
}
.cc-scroll {
    position: relative;
    overflow-y: scroll;
    height: 800px;
    border: 2px solid #edf0f4;
    padding-top: 10px;
}
</style>
