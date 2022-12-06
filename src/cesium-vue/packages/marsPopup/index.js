import MarsPopup from "./src/main.vue"

MarsPopup.install = function (Vue) {
  Vue.component(MarsPopup.name, MarsPopup);
};

export default MarsPopup;
