const waterMarker = {
  bind(el, binding) {
    addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
  }
}

function addWaterMarker(str, parentNode, font, textColor) {
  // 水印文字，父元素，字体，文字颜色
  const canva = document.createElement('canvas')
  parentNode.appendChild(canva)
  canva.width = 200
  canva.height = 150
  canva.style.display = 'block'
  const canvas = canva.getContext('2d')
  canvas.rotate((-20 * Math.PI) / 180)
  canvas.font = font || '16px Microsoft JhengHei'
  canvas.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
  canvas.textAlign = 'left'
  canvas.textBaseline = 'Middle'
  canvas.fillText(str, canva.width / 10, canva.height / 2)
  parentNode.style.backgroundImage = 'url(' + canva.toDataURL('image/png') + ')'
}

export default waterMarker
