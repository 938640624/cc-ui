<template>
    <div class="mouse-wizard">
        <cc-header :headtitle="'MouseWizard(鼠标精灵)'" />
        <cc-scroll>
            <div class="eye-socket big-eye">
                <div ref="chart" class="chart"></div>
            </div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'mouse-wizard'
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
    },
    props: {},
    data() {
        return {
            leftRotSize: 0,
            ballSize: 0,
            rotTimer: null,
            isSleep: true,
        }
    },
    mounted() {
        this.initChart()
        // this.initEyeballChart()
        // this.initSleep()
        this.bigEye = document.querySelector('.big-eye')
        this.bigEye.addEventListener('click', this.clickToWeakUp)
    },
    beforeUnmount() {
        this.echarts && this.echarts.dispose()
    },
    methods: {
        initChart() {
            this.echarts = this.$echarts.init(this.$refs.chart)
        },
        initEyeballChart() {
            const option = {
                series: [
                    {
                        type: 'gauge', // 使用仪表盘类型
                        radius: '-20%', // 采用负数是为了让分割线从内向外延伸
                        clockwise: false,
                        // startAngle: '0', // 起始角度
                        // endAngle: '270', // 结束角度
                        startAngle: `${0 + this.leftRotSize * 5}`, // 加为逆时针旋转，乘5表示速度为leftRotSize的倍
                        endAngle: `${270 + this.leftRotSize * 5}`, // 即变为每10微秒移动0.5度，1234678同理
                        splitNumber: 3, // 分割数量，会将270度分割为3份，所以有四根线
                        detail: false,
                        axisLine: {
                            show: false,
                        },
                        axisTick: false,
                        splitLine: {
                            show: true,
                            // length: 12, // 分割线长度
                            length: this.ballSize,
                            lineStyle: {
                                shadowBlur: 20, // 阴影渐变
                                shadowColor: 'rgb(0, 238, 255)', // 阴影颜色
                                shadowOffsetY: '0',
                                color: 'rgb(0, 238, 255)', // 分割线颜色
                                width: 4, // 分割线宽度
                            },
                        },
                        axisLabel: false,
                    },
                    {
                        type: 'gauge',
                        radius: '-20%',
                        clockwise: false,
                        // startAngle: '45', // 倾斜45度
                        // endAngle: '315',
                        startAngle: `${45 + this.leftRotSize * 5}`, // 加为逆时针旋转，乘5表示速度为leftRotSize的倍
                        endAngle: `${315 + this.leftRotSize * 5}`, // 即变为每10微秒移动0.5度，1234678同理
                        splitNumber: 3,
                        detail: false,
                        axisLine: {
                            show: false,
                        },
                        axisTick: false,
                        splitLine: {
                            show: true,
                            // length: 12,
                            length: this.ballSize,
                            lineStyle: {
                                shadowBlur: 20,
                                shadowColor: 'rgb(0, 238, 255)',
                                shadowOffsetY: '0',
                                color: 'rgb(0, 238, 255)',
                                width: 4,
                            },
                        },
                        axisLabel: false,
                    },
                ],
            }
            this.echarts.setOption(option)
        },
        initSleep() {
            this.rotTimer && clearInterval(this.rotTimer)
            this.rotTimer = setInterval(() => {
                this.initEyeballChart()
                if (this.ballSize > 0) {
                    this.ballSize -= 0.1
                } else {
                    this.bigEye.className = 'eye-socket eyeSocketSleeping'
                }
                this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.1)
            }, 1000)
        },
        clickToWeakUp() {
            if (!this.isSleep) return
            this.isSleep = false
            this.bigEye.className = 'eye-socket'
            this.rotTimer && clearInterval(this.rotTimer)
            this.rotTimer = setInterval(() => {
                this.initEyeballChart()
                if (this.ballSize <= 12) this.ballSize += 0.1
                this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.1)
            }, 10)
        },
    },
}
</script>
<style lang="scss" scoped>
.mouse-wizard {
    --c-eyeSocket: rgb(41, 104, 217);
    --c-eyeSocket-outer: #02ffff;
    --c-eyeSocket-outer-shadow: transparent;
    --c-eyeSocket-inner: rgb(35, 22, 140);
    .cc-scroll {
        width: 100%;
        overflow: hidden;
        background-color: #111111;
        .eye-socket {
            position: absolute;
            left: calc(50% - 75px);
            top: calc(50% - 75px);
            width: 150px;
            aspect-ratio: 1;
            border-radius: 50%;
            border: 4px solid rgb(41, 104, 217);
            z-index: 1;
            &::before,
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%); // 居中
                border-radius: 50%;
                box-sizing: border-box; // css3盒子模型
            }
            &::before {
                width: calc(100% + 20px);
                height: calc(100% + 20px);
                border: 6px solid #02ffff;
            }
            &::after {
                width: 100%;
                height: 100%;
                border: 4px solid rgb(35, 22, 140);
                box-shadow: inset 0px 0px 30px rgb(35, 22, 140);
            }
            .chart {
                width: 100%;
                height: 100%;
            }
        }
        .eyeSocketSleeping {
            animation: sleeping 6s infinite;
        }
        @keyframes sleeping {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
    }
}
</style>
