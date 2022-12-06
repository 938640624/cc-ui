import Icon from "./icon.vue"

const req = require.context("@/assets/icon-svg", false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default Icon

