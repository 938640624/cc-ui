<template>
	<div class="color-editor">
		<div class="color-top">
		<div class="color-control">
			<div class="control-show"></div>
			<!-- <div class="control-text">rgb(102, 81, 192)</div> -->
		</div>
		<div class="color-content">
			<svg width="300px" height="500px">
				<defs>
					<!-- <linearGradient> 标签的 x1、x2、y1、y2 属性可定义渐变的开始和结束位置
					渐变的颜色范围可由两种或多种颜色组成。每种颜色通过一个 <stop> 标签来规定。offset 属性用来定义渐变的开始和结束位置 -->
					<linearGradient id="colorShow" x1="0%" y1="100%" x2="0%" y2="0%">
						<!-- 一个渐变上的颜色坡度，是用stop元素定义的。stop元素可以是<linearGradient>元素或者<radialGradient>元素的子元素 -->
						<!-- offset="0%" stop-color="#FFFFFF" stop-opacity="1"表示开始位置的颜色为#FFFFFF、透明度为1 -->
						<stop offset="0%" stop-color="#FF0000" stop-opacity="1"></stop>
						<stop offset="13%" stop-color="#FF00FF" stop-opacity="1"></stop>
						<stop offset="25%" stop-color="#8000FF" stop-opacity="1"></stop>
						<stop offset="38%" stop-color="#0040FF" stop-opacity="1"></stop>
						<stop offset="50%" stop-color="#00FFFF" stop-opacity="1"></stop>
						<stop offset="63%" stop-color="#00FF40" stop-opacity="1"></stop>
						<stop offset="75%" stop-color="#0BED00" stop-opacity="1"></stop>
						<stop offset="88%" stop-color="#FFFF00" stop-opacity="1"></stop>
						<stop offset="100%" stop-color="#FF0000" stop-opacity="1"></stop>
					</linearGradient>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" fill="url(#colorShow)"></rect>
			</svg>
			<div class="color-slide"></div>
		</div>
		</div>
		<div>
		<div class="control-text">
				<input v-model="rgbText" spellcheck ="false"/>
			</div>
		<div class="control-text" spellcheck ="false">
			<input v-model="hexText" />
		</div>
		</div>
		</div>
</template>
<script>
const COMPONENT_NAME = "color-editor";
export default {
  name: COMPONENT_NAME,
  components: {},
  mounted() {
    this.initsort();
  },
  data() {
    return {
			rgbText: '',
			hexText: '',
			rectOffsetY: 0
		};
  },
  methods: {
    initsort() {
			let that = this
			const svgParent = document.querySelector('.color-top')
			const content = document.querySelector('.color-content')
			const rectSvg = content.querySelector('rect')
			const slideSvg = content.querySelector('.color-slide')
			const colorEl = document.querySelector('.color-control')
			const colorShow = colorEl.querySelector('.control-show')
			let flag = false
			let contentVal = 0
			let rVal = 100
			let sVal = 100
			colorShow.addEventListener('click', () => {
				console.log('我是左边点击事件')
			})
			rectSvg.addEventListener('mousedown', (event) => {
				console.log('我是右边点击事件')
				flag = true
				this.rectOffsetY = event.offsetY / content.offsetHeight
				slideSvg.style.top = event.offsetY + 'px'
				contentVal = 360 * this.rectOffsetY
				setHSV()
			})
			svgParent.addEventListener('mousemove', (event) => {
				if (!flag) return
				// 滑块在元素中的定位比例
				this.rectOffsetY = event.offsetY / content.offsetHeight
				slideSvg.style.top = event.offsetY + 'px'
				// 因为contentVal的范围是0~360, 乘以比例就可以得到一个颜色值
				contentVal = 360 * this.rectOffsetY
				setHSV()
			})
			svgParent.addEventListener('mouseup', ()=> {
				flag = false
			})

			// 这里算出对应的RGB值
			function setHSV () {
				let color = `rgb(${tansformRgb(contentVal, rVal, sVal).join(',')})`
				let color1 = transformHex(tansformRgb(contentVal, rVal, sVal))
				document.getElementsByTagName('body')[0].style.setProperty('--testColor', color1)
				that.rgbText = color
				that.hexText = color1
				colorShow.style.background = color
			}
			// 对应的RGB算法
			function tansformRgb(h, s, v) {
        s = s / 100;
        v = v / 100;
        var h1 = Math.floor(h / 60) % 6;
        var f = h / 60 - h1;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var r, g, b;
        switch (h1) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }

			// RGB转换为HEX
			function transformHex(colorArr) {
				let colorHex = '#'
				colorArr.forEach(item => {
					let hex = item.toString(16)
					if (hex.length < 2) {
						hex = '0' + hex
					}
					colorHex += hex
				})
				return colorHex
			}
			setHSV()
    },
  },
};
</script>
<style lang="scss" scoped>
.color-editor {
	display: flex;
	justify-content: center;
	padding: 20px 0;
	flex-direction: column;
	align-items: center;
}
.color-top {
	display: flex;
}
svg {
  width: 100%;
  height: 100%;
}
.color-content {
  width: 20px;
	height: 200px;
	position: relative;
	cursor: pointer;
}
.color-control {
	margin-right: 10px;
}
.color-slide {
	position: absolute;
	left: 0;
	top: 0;
	border: 1px solid #ccc;
	width: 18px;
	height: 10px;
	pointer-events: none;
	background-color: #fff;
}
.control-text {
	color: #666;
	margin-top: 10px;
}
.control-text input{
	width: 150px;
	height: 30px;
	line-height: 1.3;
	line-height: 38px\9;
	border-width: 1px;
	border: 1px solid #ccc;
	border-style: solid;
	background-color: #fff;
	// color: #666;
	color: $color-header;
	border-radius: 2px;
	text-align: left;
	font-size: 14px;
	letter-spacing: 1px;
	padding-left: 15px;
	box-sizing: border-box;
	outline: none;
}
.control-text input:focus {
	outline: none;
}
.control-show {
	width: 300px;
	height: 200px;
	background: rgb(102, 81, 192)
}
</style>
