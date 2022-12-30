<template>
    <div class="mouse-wizard">
        <cc-header :headtitle="'MouseWizard(鼠标精灵)'" />
        <cc-scroll>
            <div class="eye-socket eyeSocketSleeping big-eye">
                <div ref="chart" class="chart"></div>
            </div>
            <div class="filter">
                <div class="eye-socket" id="eyeFilter"></div>
            </div>
            <!-- Svg滤镜 -->
            <svg width="0">
                <filter id="filter">
                    <feTurbulence baseFrequency="1">
                        <animate
                            id="animate1"
                            attributeName="baseFrequency"
                            dur="1s"
                            from="0.5"
                            to="0.55"
                            begin="0s;animate1.end"
                        ></animate>
                        <animate
                            id="animate2"
                            attributeName="baseFrequency"
                            dur="1s"
                            from="0.55"
                            to="0.5"
                            begin="animate2.end"
                        ></animate>
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="50" xChannelSelector="R" yChannelSelector="B" />
                </filter>
            </svg>
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
            ballColor: 'transparent', // 默认透明
        }
    },
    mounted() {
        this.initChart()
        // this.initEyeballChart()
        // this.initSleep()
        this.setNormal()
        this.eyeFilter = document.getElementById('eyeFilter')
        this.chart = document.querySelector('.chart')
        this.bigEye = document.querySelector('.big-eye')
        this.bigEye.addEventListener('click', this.clickToWeakUp)
        this.bigEye.addEventListener('webkitAnimationEnd', this.handleAnimationEnd)
        document.body.addEventListener('mousemove', this.handleMousemove)
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
                                shadowColor: this.ballColor,
                                // shadowColor: 'rgb(0, 238, 255)', // 阴影颜色
                                shadowOffsetY: '0',
                                color: this.ballColor,
                                // color: 'rgb(0, 238, 255)', // 分割线颜色
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
                                shadowColor: this.ballColor,
                                // shadowColor: 'rgb(0, 238, 255)',
                                shadowOffsetY: '0',
                                // color: 'rgb(0, 238, 255)',
                                color: this.ballColor,
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
            document.body.removeEventListener('mousemove', this.handleMousemove) // 移除鼠标移动事件
            this.bigEye.style.transform = `rotateY(0deg) rotateX(0deg)` // 大眼归位
            this.chart.style.transform = `translate(0px, 0px)` // 眼睛归位
        },
        clickToWeakUp() {
            if (!this.isSleep) {
                this.isSleep = true
                this.setNormal()
                return
            }

            this.isSleep = false
            this.bigEye.className = 'eye-socket eyeSocketLooking'
            this.eyeFilter.className = 'eye-socket eyeSocketLooking' // 同时给大眼和光环添加环视动画
            this.eyeFilter.style.opacity = '1'
            this.setAngry()
            this.rotTimer && clearInterval(this.rotTimer)
            this.rotTimer = setInterval(() => {
                this.initEyeballChart()
                if (this.ballSize <= 50) this.ballSize += 1
                this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.5)
            }, 10)
        },
        handleAnimationEnd() {
            new Promise((res) => {
                this.rotTimer && clearInterval(this.rotTimer) // 清除定时器
                this.rotTimer = setInterval(() => {
                    this.initEyeballChart() // 更新视图
                    if (this.ballSize > 0) this.ballSize -= 0.5 // 眼球尺寸减小
                    this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.1)
                    if (this.ballSize === 0) {
                        // 当眼球尺寸为0时，将Promise标记为resolved，然后执行后面的代码
                        clearInterval(this.rotTimer)
                        res()
                    }
                }, 10)
            }).then(() => {
                this.eyeFilter.style.opacity = '0' // 清除光环
                this.eyeFilter.className = this.bigEye.className = 'eye-socket' // 清除环视动画
                this.setNormal() // 设置常态样式
                this.rotTimer = setInterval(() => {
                    this.initEyeballChart()
                    this.ballSize <= 12 && (this.ballSize += 0.1) // 眼球尺寸缓慢增加
                    this.leftRotSize === 360 ? (this.leftRotSize = 0) : (this.leftRotSize += 0.1)
                }, 10)
            })
        },
        handleMousemove(e) {
            // 视口尺寸，获取到整个视口的大小
            let clientWidth = document.body.clientWidth
            let clientHeight = document.body.clientHeight
            // 原点，即bigEye中心位置，页面中心
            let origin = [clientWidth / 2, clientHeight / 2]
            // 鼠标坐标
            let mouseCoords = [e.clientX - origin[0], origin[1] - e.clientY]
            // 旋转角度
            let eyeXDeg = (mouseCoords[1] / clientHeight) * 80 // 这里的80代表的是最上下边缘大眼X轴旋转角度
            let eyeYDeg = (mouseCoords[0] / clientWidth) * 60
            this.bigEye.style.transform = `rotateY(${eyeYDeg}deg) rotateX(${eyeXDeg}deg)`
            this.chart.style.transform = `translate(${eyeYDeg / 1.5}px, ${-eyeXDeg / 1.5}px)`
            // 设置休眠
            if (this.sleepTimer) clearTimeout(this.sleepTimer) // 如果休眠定时器已经被设置，则清除休眠定时器
            this.sleepTimer = setTimeout(() => {
                // 重新计时
                this.initSleep()
            }, 30000)
        },
        setAngry() {
            // 通过js修改body的css变量
            document.body.style.setProperty('--c-eyeSocket', 'rgb(255,187,255)')
            document.body.style.setProperty('--c-eyeSocket-outer', 'rgb(238,85,135)')
            document.body.style.setProperty('--c-eyeSocket-outer-shadow', 'rgb(255, 60, 86)')
            document.body.style.setProperty('--c-eyeSocket-inner', 'rgb(208,14,74)')
            this.ballColor = 'rgb(208,14,74)'
        },
        setNormal() {
            document.body.style.setProperty('--c-eyeSocket', 'rgb(41, 104, 217)')
            document.body.style.setProperty('--c-eyeSocket-outer', '#02ffff')
            document.body.style.setProperty('--c-eyeSocket-outer-shadow', 'transparent')
            document.body.style.setProperty('--c-eyeSocket-inner', 'rgb(35, 22, 140)')
            this.ballColor = 'rgb(0,238,255)'
        },
    },
}
</script>
<style lang="scss" scoped>
body {
    --c-eyeSocket: rgb(41, 104, 217);
    --c-eyeSocket-outer: #02ffff;
    --c-eyeSocket-outer-shadow: transparent;
    --c-eyeSocket-inner: rgb(35, 22, 140);
    perspective: 1000px;
}
.mouse-wizard {
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
            // border: 4px solid rgb(41, 104, 217);
            border: 4px solid var(--c-eyeSocket);
            box-shadow: 0px 0px 50px var(--c-eyeSocket-outer-shadow); // 生气时红色外发光，常态保持透明
            transition: border 0.5s ease-in-out, box-shadow 0.5s ease-in-out; // 添加过度效果
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
                transition: all 0.5s ease-in-out; // 添加过渡效果
            }
            &::before {
                width: calc(100% + 20px);
                height: calc(100% + 20px);
                border: 6px solid var(--c-eyeSocket-outer);
                // border: 6px solid #02ffff;
            }
            &::after {
                width: 100%;
                height: 100%;
                border: 4px solid var(--c-eyeSocket-inner);
                box-shadow: inset 0px 0px 30px var(--c-eyeSocket-inner);
                // border: 4px solid rgb(35, 22, 140);
                // box-shadow: inset 0px 0px 30px rgb(35, 22, 140);
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

        .filter {
            width: 100%;
            height: 100%;
            filter: url('#filter'); // 开启滤镜
            .eye-socket {
                opacity: 0;
                left: calc(50% - 92px);
                top: calc(50% - 92px);
                transition: all 0.5s ease-in-out; // 添加过渡效果，值得注意的是不能丢了原本的过渡效果，所以这里使用all
            }
        }
        .eyeSocketLooking {
            animation: lookAround 2.5s;
        }
        /* 环视动画 */
        @keyframes lookAround {
            0% {
                transform: translateX(0) rotateY(0);
            }

            10% {
                transform: translateX(0) rotateY(0);
            }

            40% {
                transform: translateX(-70px) rotateY(-30deg);
            }

            80% {
                transform: translateX(70px) rotateY(30deg);
            }

            100% {
                transform: translateX(0) rotateY(0);
            }
        }
    }
}
</style>
