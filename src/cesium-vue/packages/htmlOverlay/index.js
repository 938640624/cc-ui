import HtmlOverlay from "./src/main.vue"

HtmlOverlay.install = function (Vue) {
  Vue.component(HtmlOverlay.name, HtmlOverlay)
}

export default HtmlOverlay
