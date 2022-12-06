export default {
  // 通过配置functional属性指定组件为函数式组件
  functional: true,
  //context 函数式组件没有this, props, slots等都在context上挂着
  // createElement一共有三个参数
  // 参数一：需要渲染的组件，可以是组件的标签（比如div），或者是一个组件对象（比如export default {}），或者是异步函数
  // 参数二：组件的属性，是一个对象，如果组件没有参数，也可以传null
  // 参数三：组件的子组件，可以是字符串（textContent）或者是由VNodes组成的数组
  render (h, context) {
    const { props } = context
    if (props.avatar) {
      return <img src = { props.avatar }></img>
    }
    return <img src="default-avatar.png"></img>
  }
}
