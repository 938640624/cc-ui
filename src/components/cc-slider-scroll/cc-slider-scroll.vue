<template>
    <div
        :ref="viewkey + 'sliderScroll'"
        class="cc-slider-scroll"
        @click.stop.prevent="handleSliderClick"
        @mousewheel="handleSliderMousewheel"
    >
        <div class="slider-top" @click.stop.prevent="handleSliderTopClick"><i class="el-icon-caret-top"></i></div>
        <div :ref="viewkey + 'sliderMiddle'" class="slider-middle" @click.stop.prevent="handleSliderMiddleClick"></div>
        <div class="slider-bottom" @click.stop.prevent="handleSliderBottomClick">
            <i class="el-icon-caret-bottom"></i>
        </div>
    </div>
</template>
<script>
import { nextTick } from 'vue'
const COMPONENT_NAME = 'cc-slider-scroll'
const EVENT_SLIDER = 'slider'
const EVENT_SLIDER_CLICK = 'slider-click'
export default {
    name: COMPONENT_NAME,
    components: {},
    props: {
        viewkey: {
            type: String,
            default: '',
        },
        // eslint-disable-next-line vue/require-prop-type-constructor
        point: Array | Boolean,
    },
    watch: {
        point: {
            handler(val) {
                if (val) {
                    // console.log(val, 'val', this.viewkey)
                    if (this.sliderView === this.viewkey) return
                    nextTick(() => {
                        this.setSliderTop(`${this.offsetScrollHeight - val[1] + this.offsetBoxHeight}px`)
                        // console.log(this.silderMiddleDiv.style.top, 'top')
                    })
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            offsetScrollHeight: null,
            offsetBoxHeight: null,
            sliderView: null,
        }
    },
    mounted() {
        this.offsetScrollHeight = this.$refs[`${this.viewkey}sliderScroll`].offsetHeight
        this.offsetBoxHeight = this.$refs[`${this.viewkey}sliderMiddle`].offsetHeight
        this.silderMiddleDiv = this.$refs[`${this.viewkey}sliderMiddle`]
    },
    methods: {
        handleSliderClick(e) {
            // console.log(e.offsetY, this.silderMiddleDiv.style.top, 'top')
            const sliderTop = Number(this.silderMiddleDiv.style.top.split('px')[0])
            if (e.offsetY < sliderTop) {
                this.$emit(EVENT_SLIDER_CLICK, e.offsetY)
            } else {
                this.$emit(EVENT_SLIDER_CLICK, e.offsetY)
            }
            this.setSliderTop(`${e.offsetY}px`)
        },
        handleSliderMousewheel(e) {
            const sliderTop = Number(this.silderMiddleDiv.style.top.split('px')[0])
            if (sliderTop <= 12 || sliderTop >= 378) return
            this.sliderView = this.viewkey
            if (e.wheelDelta > 0) {
                this.setSliderTop(`${sliderTop - 1}px`)
                this.$emit(EVENT_SLIDER, this.viewkey, 'up')
            } else {
                this.setSliderTop(`${sliderTop + 1}px`)
                this.$emit(EVENT_SLIDER, this.viewkey, 'down')
            }
        },
        handleSliderTopClick() {
            const sliderTop = Number(this.silderMiddleDiv.style.top.split('px')[0])
            if (sliderTop <= 12) return
            this.setSliderTop(`${sliderTop - 1}px`)
        },
        handleSliderMiddleClick() {
            console.log('middle')
        },
        handleSliderBottomClick() {
            const sliderTop = Number(this.silderMiddleDiv.style.top.split('px')[0])
            if (sliderTop >= 378) return
            this.setSliderTop(`${sliderTop + 1}px`)
        },
        setSliderTop(top) {
            this.silderMiddleDiv.style.top = top
        },
    },
}
</script>
<style lang="scss" scoped>
.cc-slider-scroll {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 100%;
    background-color: #333333;
    color: #c1c1c1;
    z-index: 1;
    cursor: pointer;
    font-size: 12px;
    .slider-top {
        position: absolute;
        top: 0;
    }
    .slider-bottom {
        position: absolute;
        bottom: 0;
    }
    .slider-middle {
        position: absolute;
        top: 50%;
        transform: translateX(-50%);
        right: -6px;
        width: 12px;
        height: 12px;
        background-color: #e7ebf7;
        border-radius: 0;
    }
}
</style>
