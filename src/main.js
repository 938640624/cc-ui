import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import Directives from './directives'
import './components/cc-jsx/index'
import CesiumCompnonents from './cesium-vue/src/index'
import 'element-ui/lib/theme-chalk/index.css'
import GlobalComponents from './components/global'
import './styles/index.scss'
import 'cesium/Widgets/widgets.css'
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

Vue.use(ElementUI)
Vue.use(Directives)
Vue.use(GlobalComponents)
Vue.use(CesiumCompnonents)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
// 可以绑定vue原型链，可以全局使用
Vue.prototype.mars3d = mars3d
Vue.filter('status', function (val, a) {
    return val + a + '全局过滤器'
})

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
