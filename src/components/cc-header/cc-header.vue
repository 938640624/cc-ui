<template>
    <div class="cc-header">
        <header class="cc-bar">
            <div class="cc-bar-text">
                <span v-show="arrowLeftVisible" class="arrowPosition" @click="handleArrowBack()">
                    <i class="el-icon-arrow-left"></i>
                </span>
                <span>{{ headtitle }}</span>
            </div>
        </header>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-header'
const EVENT_ARROW_BACK = 'arrow-back'
export default {
    name: COMPONENT_NAME,
    data() {
        return {}
    },
    props: {
        headtitle: {
            type: String,
            default: '',
        },
        arrowLeftVisible: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        handleArrowBack() {
            this.$router.push({ path: '/' })
            this.$emit(EVENT_ARROW_BACK, ...arguments)
        },
    },
}
</script>
<style lang="scss" scoped>
.cc-header {
    border: 2px solid #edf0f4;
    background-color: $color-header;
}
.cc-bar {
    text-align: center;
    position: relative;
    box-shadow: 0 1px 6px #ccc;
}
.cc-bar-text {
    font-size: 30px;
    font-weight: bold;
    padding: 10px 0px;
}
.arrowPosition {
    position: absolute;
    left: 30px;
}
.el-icon-arrow-left {
    font-weight: 600 !important;
}
</style>
