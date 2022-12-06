<template>
    <div class="cc-index-utils">
        <cc-header :headtitle="'封装工具集合'" />
        <cc-scroll class="srcoll">
            我是工具测试
            <div class="styleIndex">
                <h1>ajax工具</h1>
            </div>
            <div class="clear"></div>
            <div class="directive-index">
                <button v-copy="copyText">复制</button>
                <button v-longpress="longpress">长按</button>
                <button v-debounce="debounceClick">防抖</button>
                <img v-lazyload="worldimage" />我是世界地图
                <button v-permission="'1'">权限按钮1</button>
                <button v-permission="'5'">权限按钮5</button>
                <div v-waterMarker="{ text: 'cc版权所有', textColor: 'rgba(180, 180)' }"></div>
                <div class="dragBox" v-draggable></div>
            </div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-index-utils'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
import {
    debounce,
    throttle,
    deepClone,
    instanceOf,
    flatten,
    addEvent,
    removeAllEvent,
    unionArray,
    calculateCreaseArray,
    renderTemplate,
} from '@/helper/utils/demoUtils.js'
import { addClass, removeClass, getStyle, setStyle } from '@/helper/utils/class.js'
import Schedular from '@/helper/utils/scheduler.js'
import Schedular2 from '@/helper/utils/scheduler2.js'
import Schedular3 from '@/helper/utils/scheduler3.js'
import { setIntervals } from '@/helper/utils/setInterval.js'
import { Promise } from 'q'
// import  '@/helper/utils/array.js'
// import  '@/helper/utils/function.js'

export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
    },
    props: {},
    data() {
        return {
            copyText: '我是复制内容',
            worldimage: require('../../assets/image/靶标系统.png'),
            deepCloneInfo: [
                {
                    label: '公交平均车速',
                    prevalue: 0,
                    value: 0,
                    unit: 'km/h',
                    key: 'busAvgSpeed',
                },
                {
                    label: '公交线路与小汽车运速比',
                    prevalue: 0,
                    value: 0,
                    key: 'busCarSpeedRatio',
                },
            ],
        }
    },
    mounted() {
        this.utilsIndex()
        // this.schedularIndex()
    },
    methods: {
        longpress() {
            alert('长按指令生效')
        },
        debounceClick() {
            console.log('只触发一次')
        },
        schedularIndex() {
            this.schedular = new Schedular()
            const timeout = (time) =>
                new Promise((resolve) => {
                    setTimeout(resolve, time)
                })
            this.schedular.add(() => {
                return timeout(3000).then(() => {
                    console.log('3s后执行完毕')
                })
            })
            this.schedular.add(() => {
                return timeout(5000).then(() => {
                    console.log('5s后执行完毕')
                })
            })
            this.schedular.add(() => {
                return timeout(6000).then(() => {
                    console.log('6s后执行完毕')
                })
            })

            this.schedular2 = new Schedular2()
            this.schedular2.add(() => {
                return timeout(3000).then(() => {
                    console.log('3s后执行完毕, 2')
                })
            })
            this.schedular2.add(() => {
                return timeout(5000).then(() => {
                    console.log('5s后执行完毕, 2')
                })
            })
            this.schedular2.add(() => {
                return timeout(6000).then(() => {
                    console.log('6s后执行完毕, 2')
                })
            })

            this.schedular3 = new Schedular3()
            this.schedular3.add(() => {
                return timeout(3000).then(() => {
                    console.log('3s后执行完毕, 3')
                })
            })
            this.schedular3.add(() => {
                return timeout(5000).then(() => {
                    console.log('5s后执行完毕, 3')
                })
            })
            this.schedular3.add(() => {
                return timeout(6000).then(() => {
                    console.log('6s后执行完毕, 3')
                })
            })
        },
        // 封装工具测试方法集合
        utilsIndex() {
            // this.debouceUtils()
            // this.throttleUtils()
            // this.deepCloneUtils()
            // this.instanceofUtils()
            // this.flattenUtils()
            // this.classUtils()
            // this.eventUtils()
            // this.unionArrayUtils()
            // this.calculateCreaseArrayUtils()
            // this.styleUtils()
            // this.renderTemplateUtils()
            this.setIntervalsUtils()
        },
        // 防抖
        debouceUtils() {
            this.debounceHandler = debounce(400)
            this.debounceHandler(() => {
                console.log('我是防抖')
            })
        },

        // 节流
        throttleUtils() {
            this.throttleUtils = throttle(400)
            this.throttleUtils(() => {
                console.log('我是节流')
            })
        },

        // 深克隆
        deepCloneUtils() {
            const deepCloneValue = deepClone(this.deepCloneInfo)
            console.log(deepCloneValue, 'deepCloneValue')
        },

        // instanceof关键字
        instanceofUtils() {
            const label = 123
            const label1 = '123'
            const label2 = [1, 2, 3]
            const label3 = {
                value1: 1,
                value2: 2,
                value3: 3,
            }
            console.log(instanceOf(label, Array), label instanceof Array) // false
            console.log(instanceOf(label1, String), label1 instanceof String) // false,字符串原型链为undefined
            console.log(instanceOf(label2, Array), label2 instanceof Array) // true
            console.log(instanceOf(label3, Object), label3 instanceof Object) // true
        },

        // 扁平化数据
        flattenUtils() {
            const obj = {
                a: { b: 1, c: { e: 5 } },
                b: [1, 3, { a: 2, b: 3 }],
                c: 3,
            }
            console.log(flatten(obj))
        },

        // class工具
        classUtils() {
            const dom = document.querySelector('.cc-index-utils')
            addClass(dom, 'utils')
            removeClass(dom, 'utils')
        },

        // event事件监听工具
        eventUtils() {
            const dom = document.querySelector('.cc-index-utils')
            addEvent(
                dom,
                'click',
                () => {
                    console.log('我是点击事件')
                },
                false
            )
            removeAllEvent(dom)
        },

        // 数组去重
        unionArrayUtils() {
            const arr = [1, 2, 3, 4, 1, 1, 1, 2, 3]
            console.log(unionArray(arr))
        },

        // 比较两个数组增加或减少项
        calculateCreaseArrayUtils() {
            const oldVal = [{ name: '乔丹', age: 18 }, 1, 3, [1, 2]]
            const newVal = [{ name: '乔丹', age: 20, sex: '男' }, 1, 4]
            // const oldVal = [1,2,3,4,5]
            // const newVal = [1,2,3,4,5,6,7]
            console.log(calculateCreaseArray(oldVal, newVal))
        },

        // 获取el样式
        styleUtils() {
            const el = document.querySelector('.styleIndex')
            console.log(getStyle(el, 'font-size'), 'font-size')
            console.log(getStyle(el, 'zIndex'), 'zIndex')
            setStyle(el, 'background-color', 'red')
            setStyle(el, 'fontSize', '30px')
        },

        // render字符串转字符串
        renderTemplateUtils() {
            const template = '我是{{name}}, 今年{{age}}岁'
            const data = {
                name: '乔丹',
                age: 16,
            }
            console.log(renderTemplate(template, data))
        },

        setIntervalsUtils() {
            const id = setIntervals(() => {
                // console.log('我是计时器')
            }, 1000)
        },
    },
}
</script>
<style lang="scss" scoped>
.srcoll {
    position: relative;
}
.styleIndex {
    font-size: 14px;
    opacity: 0.8;
    text-align: center;
    display: block;
    float: left;
}
.clear {
    clear: both;
}
.directive-index {
    button {
        font-size: 20px;
        margin: 20px;
    }
}
.dragBox {
    width: 200px;
    height: 150px;
    background-color: aqua;
}
</style>
