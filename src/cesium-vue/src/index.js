import HtmlOverlay from "../packages/htmlOverlay";
import MarsPopup from "../packages/marsPopup";
import MarsEntity from "../packages/marsEntity"

const components = [
  HtmlOverlay,
  MarsPopup,
  MarsEntity
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "0.0.1",
  install,
  HtmlOverlay,
  MarsPopup,
  MarsEntity
}
