<template>
    <div class="progress-bar-page">
        <cc-header :headtitle="'progress-bar(进度条-监听高度)'" />
        <cc-scroll ref="scroll">
            <progress-bar></progress-bar>
            <div class="patient-model-bg" :style="{ height: bgHeight }"></div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'progress-bar-page'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
import progressBar from '../../components/cc-progress-bar/cc-progress-bar.vue'
import { debounce } from '@/helper/utils/debounce'
import { nextTick } from 'vue'
import { Loading } from 'element-ui'
// import { loginSendCode } from '@/api/modules/login'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
        progressBar,
    },
    props: {},
    data() {
        return {
            bgHeight: '',
            scrollRef: null,
            debounceHeight: null,
        }
    },
    mounted() {
        this.debounceHeight = debounce(300, false)
        this.scrollRef = this.$refs.scroll.$el
        this.initMutationObserver()
        window.addEventListener('load', () => {
            window.postMessage('加载完成')
            // window.opener.location.href = `${window.opener.location.href}#success`
            // console.log(window.opener.location, 'window.opener.location')
            //     console.log('子页面加载完毕')
            //     // const openerUrl = document.referrer
            //     console.log(window.opener, 'opener', document.referrer, window.location.search)
            //     window.opener.location.href = 'http://192.168.0.188:5173/#/patient-list=success'
            //     setTimeout(() => {
            //         window.opener.location.href = 'http://192.168.0.188:5173/#/patient-list'
            //     }, 100)
            //     // window.opener.postMessage('子页面加载完毕')
        })
        // window.addEventListener('message', this.handleMessage, false)
        // loginSendCode({ phone: '15023348951' }).then((res) => {
        //     console.log(res, 'res')
        // })
    },
    methods: {
        handleMessage(e) {
            const loading = Loading.service({ fullscreen: true })
            if (e.origin === 'http://192.168.0.188:5173') {
                console.log('e', e.data)
                loading.close()
                // window.removeEventListener('message', this.handleMessage)
            }
        },
        initMutationObserver() {
            nextTick(() => {
                console.log(window.getComputedStyle(this.scrollRef)['height'])
                const MutationObserver =
                    window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver
                // console.log(MutationObserver, 'MutationObserver')
                const mutationObserver = new MutationObserver(() => {
                    this.debounceHeight(() => {
                        const height = window.getComputedStyle(this.scrollRef)['height']
                        // console.log(height, 'height')
                        this.bgHeight = height
                    })
                })
                mutationObserver.observe(this.scrollRef, {
                    childList: true, // 子节点的变动（新增、删除或者更改）
                    attributes: true, // 属性的变动
                    attributeFilter: ['style'],
                    characterData: true, // 节点内容或节点文本的变动
                    subtree: true, // 是否将观察器应用于该节点的所有后代节点
                })
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.progress-bar-page {
    .patient-model-bg {
        width: calc(100% - 70px);
        top: 0;
        left: 70px;
        z-index: 0;
        position: absolute;
        background: url('/src/assets/image/model-bg.png');
    }
}
</style>
