<template>
    <div class="cc-text-ktv">
        <cc-header :headtitle="'文字ktv'" />
        <cc-scroll>
            <div class="cc-text-h1">
                <h1 text-data="如果那两个字没说出口，">如果那两个字没说出口，</h1>
                <h1 text-data="你不会，发现我难受，">你不会，发现我难受，</h1>
                <h1 text-data="怎么说出口，">怎么说出口，</h1>
            </div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-text-ktv'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
    },
    props: {},
    data() {
        return {}
    },
    mounted() {},
    methods: {},
}
</script>
<style lang="scss" scoped>
/* .cc-text-h1 {
  text-align: center;
} */
h1 {
    position: relative;
    font-size: 72px;
    font-weight: 700;
    color: #ccc;
}
h1::after {
    content: attr(text-data);
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to right, #abdcff, #0396ff);
    background-clip: text;
    color: transparent;
    animation: colorChange 6s linear infinite;
    white-space: nowrap;
}
@keyframes colorChange {
    0% {
        width: 0%;
    }
    100% {
        width: 100%;
    }
}
</style>
