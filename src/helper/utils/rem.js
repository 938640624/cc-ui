// import { debounce } from '@/utils/debounce'
// const debounceResize = debounce(100, false)
// pnpm i autoprefixer postcss-plugin-px2rem --save  安装依赖
const baseSize = 16
// 设置 rem 函数
function setRem() {
    // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 1920
    // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
    // debounceResize(() => {
    //     setRem()
    // })
    // TODO: 使用节流后效果不好，但是性能更好，后续考虑是否需要节流
    setRem()
}
