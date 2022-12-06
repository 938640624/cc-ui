const lazyload = {
    // install可供开发新的插件和全局注册组件等
    // install(Vue, options) Vue:vue构造器,options:可选的选项对象(组件，指令，混入，挂载vue原型)
    install(Vue, options) {
        const defaultSrc = options.default
        Vue.directive('lazy', {
            bind(el, binding) {
                console.log(el, 'bind')
                lazyload.init(el, binding.value, defaultSrc)
            },
            inserted(el) {
                console.log(el, 'insert')
                if (IntersectionObserver) {
                    lazyload.observe(el)
                } else {
                    lazyload.listenerScroll(el)
                }
            },
        })
    },
    // init初始化
    init(el, val, def) {
        console.log(el, 'init')
        el.setAttribute('data-src', val)
        el.setAttribute('src', def)
    },
    // 利用IntersectionObserver监听el
    observe(el) {
        var io = new IntersectionObserver((entries) => {
            const realSrc = el.dataset.src
            if (entries[0].isIntersecting) {
                if (realSrc) {
                    el.src = realSrc
                    el.removeAttribute('data-src')
                }
            }
        })
        io.observe(el)
    },
    // 监听scroll事件
    listenerScroll(el) {
        const handler = lazyload.throttle(lazyload.load, 300)
        lazyload.load(el)
        window.addEventListener('srcoll', () => {
            handler(el)
        })
    },
    // 加载真实图片
    load(el) {
        const windowHeight = document.documentElement.clientHeight
        const elTop = el.getBoundingClientRect().top
        const elBtm = el.getBoundingClientRect().bottom
        const realSrc = el.dataset.src
        if (elTop - windowHeight < 0 && elBtm > 0) {
            if (realSrc) {
                el.src = realSrc
                el.removeAttribute('data-src')
            }
        }
    },
    // 节流
    throttle(fn, delay) {
        let timer
        let prevTime
        return function (...args) {
            const currTime = Data.now()
            const context = this
            if (!prevTime) {
                prevTime = currTime
            }
            clearTimeout(timer)

            if (currTime - prevTime > delay) {
                prevTime = currTime
                fn.apply(context, args)
                clearTimeout(timer)
                return
            }

            timer = setTimeout(() => {
                prevTime = Data.now()
                timer = null
            }, delay)
        }
    },
}

export default lazyload
