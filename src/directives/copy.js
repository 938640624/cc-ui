// 指令函数的钩子函数
// bind: 只调用一次，指令第一次绑定到元素时调用，可以定义一个在绑定时执行一次的初始化动作。
// inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。
// update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值。
// componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。
// unbind: 只调用一次， 指令与元素解绑时调用。

const copy = {
    bind(el, { value }) {
        el.$value = value
        el.handler = () => {
            if (!el.$value) {
                console.log('无复制内容')
                return
            }
            // 动态创建textarea标签
            const textarea = document.createElement('textarea')
            // 将该textarea设为readonly防止ios自动唤起键盘，同时将textarea移出可视区域
            // readOnly规定该字段只读，不能修改，但是可以选中和复制
            textarea.readOnly = 'readonly'
            textarea.style.position = 'absolute'
            textarea.style.left = '-9999px'
            // 将要copy的值赋给textarea标签的value属性
            textarea.value = el.$value
            // 将textarea插入到body中
            document.body.appendChild(textarea)
            // textarea选中值并且复制
            textarea.select()
            const result = document.execCommand('Copy')
            if (result) {
                console.log('复制成功')
            }
            document.body.removeChild(textarea)
        }
        // 绑定点击事件，一键copy
        el.addEventListener('click', el.handler)
    },
    // 当传进来值时触发
    componentUpdated(el, { value }) {
        el.$value = value
    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind(el) {
        el.removeEventListener('click', el.handler)
    },
}

export default copy
