<template>
    <div class="cc-toast-page">
    <cc-header
      :headtitle="'Toast'"
    />
    
    <cc-scroll>
        <cc-button-group>
            <cc-button class="margiTop" @click="showToastTime">Toast - time 1s</cc-button>
            <cc-button class="margiTop" @click="showToastTime0">Toast - time 0</cc-button>
            <cc-button class="margiTop" @click="showToastMask">Toast- 遮蔽层</cc-button>
            <cc-button class="margiTop" @click="showToastType">Toast - 类别</cc-button>
            <cc-button class="margiTop" @click="showToastTxtOnly">Toast - 只有文字</cc-button>
        </cc-button-group>

        <cc-toast
          :toolVisible="toolVisible"
          :popoverText="popoverText"
          :coverLayerVisible="coverLayerVisible"
          :elIconSelect="elIconSelect"
          :circleTool="circleTool"
        >
        </cc-toast>
    </cc-scroll>
    </div>
</template>
<script>
import ccButtonGroup from '../../components/cc-button/cc-button-group.vue';
import ccButton from '../../components/cc-button/cc-button.vue';
import ccHeader from '../../components/cc-header/cc-header.vue';
import ccToast from '../../components/cc-toast/cc-toast.vue';
import ccScroll from '../../components/cc-scroll/cc-scroll.vue';
const COMPONENT_NAME = 'cc-toast-page'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
        ccButtonGroup,
        ccButton,
        ccToast
    },
    data() {
        return {
            toolVisible: false,
            popoverText: '',
            coverLayerVisible: false,
            elIconSelect:'el-icon-success',
            circleTool: false
        }
    },
    methods: {
        showToastTime(event) {
            this.circleTool = true
            this.popoverText = event.target.innerText
            this.toolVisible = true
            setTimeout(() => {
                this.toolVisible = false
            },1000)
        },
        showToastTime0(event) {
            this.circleTool = true
            this.popoverText = event.target.innerText
            this.toolVisible = true
            setTimeout(() => {
                this.toolVisible = false
            },2000)
        },
        showToastMask() {
            this.popoverText = 'loading'
            this.circleTool = true
            this.toolVisible = true
            this.coverLayerVisible = true
            setTimeout(() => {
                this.toolVisible = false
                this.coverLayerVisible = false
            },2000)
        },
        showToastType() {
            this.circleTool = false
            this.elIconSelect = 'el-icon-success'
            const text = this.elIconSelect.substring(this.elIconSelect.indexOf('icon-')+5,this.elIconSelect.length)
            this.popoverText = text
            this.toolVisible = true
            setTimeout(() => {
                this.toolVisible = false
            },2000)
        },
        showToastTxtOnly() {
            this.circleTool = false
            this.elIconSelect = ''
            this.popoverText = 'Plain text'
            this.toolVisible = true
            setTimeout(() => {
                this.toolVisible = false
                this.elIconSelect = 'el-icon-success'
            },2000)
        },
    }
}
</script>
<style lang="scss" scoped>
    .cc-toast-page {
        position: relative;
    }
    .margiTop {
      margin: 10px 10px 0px 10px;
    }
</style>