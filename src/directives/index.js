import copy from './copy.js'
import longpress from './longpress.js'
import debounce from './debounce.js'
import lazyload from './lazy.js'
import permission from './permission.js'
import waterMarker from './waterMarker.js'
import draggable from './draggable.js'

const directives = {
    copy,
    longpress,
    debounce,
    lazyload,
    permission,
    waterMarker,
    draggable,
}

export default {
    install(Vue) {
        // console.log(directives, 'directives')
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key])
        })
    },
}
