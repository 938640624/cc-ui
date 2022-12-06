<template>
	<div class="cc-scroll-indexlist">
		<cc-scroll @scroll="handleScroll">
			<cc-index-list-item :item="title" />
			<cc-index-list
				v-for="(group, index1) in data"
				:key="index1"
				:group="group"
				:class="group.name"
			>
				<cc-index-list-item
					v-for="(itemgroup, index2) in group.items"
					:key="index2"
					:item="itemgroup"
					@event-select-item="handleSelectItem"
				>
				</cc-index-list-item>
			</cc-index-list>

			<div class="scroll-indexList-fixed">
				<ul>
					<li
						v-for="(item, index) in data"
						:key="index"
            :class="activeIndex === index ? 'heightLine' : ''"
						@click="handleIndexlistClick(item, $event)"
					>
						<slot :item="item">{{ item.name }}</slot>
					</li>
				</ul>
			</div>
		</cc-scroll>
	</div>
</template>
<script>
import CcIndexListItem from '../../cc-index-list/cc-index-list-item.vue'
import CcIndexList from '../../cc-index-list/cc-index-list.vue'
import ccScroll from '../cc-scroll.vue'
const COMPONENT_NAME = 'cc-scroll-indexlist'
export default {
	name: COMPONENT_NAME,
	components: {
		ccScroll,
		CcIndexList,
		CcIndexListItem,
	},
	props: {
		title: {
			type: Object,
			default() {
				return {}
			},
		},
		data: {
			type: Array,
			default() {
				return []
			},
		},
	},
	mounted() {
    // 给每个item一个top值
		this.data.forEach((item) => {
			const dataDiv = document.querySelector('.' + item.name)
			item.top = dataDiv.offsetTop
		})
	},
	data() {
		return {
      activeIndex: 0
    }
	},
	methods: {
		handleSelectItem() {
			console.log(123)
		},
		handleIndexlistClick(item) {
      // 将右边的name值赋给左边渲染出来的数据当作动态class名，根据点击的不同，获取到对应的div标签，获取标签的top和left偏移量，找到滑动的标签元素
      // scrollTo()方法可以滚动到文档中的一组特定坐标，参数为top,left,还有behavior(包含smooth，instant或auto的字符串)
			const scrollName = document.querySelector('.' + item.name)
			const y = scrollName.offsetTop
			const x = scrollName.offsetLeft
			const scrollDiv = document.querySelector('.cc-scroll')
			scrollDiv.scrollTo({
				top: y,
				left: x,
				behavior: 'smooth',
			})
		},
		handleScroll(event) {
			const { target } = event
			this.data.forEach((item, index) => {
				if (index === 0) {
					if (target.scrollTop > 0 && target.scrollTop < this.data[index].top) {
            this.activeIndex = index
					}
			} else {
          if (target.scrollTop >= this.data[index].top && target.scrollTop <= this.data[index + 1].top) {
            this.activeIndex = index
					}
        }
			})
      // target.scrollTop 距离顶部的高度
			// target.clientHeight 父元素的高度
			// target.scrollHeight 子元素的高度, 滑到最底部的时候，滑动的距离，加父元素高度等于子元素高度
		},
	},
}
</script>
<style>
.heightLine {
  color: #fc9153!important;
}
.cc-scroll-indexlist {
	position: relative;
}
.scroll-indexList-fixed {
	position: absolute;
	right: 3%;
	top: 50%;
	transform: translateY(-50%);
}
.scroll-indexList-fixed li {
	padding: 6px 16px 0 16px;
	line-height: 1;
	text-align: center;
	font-size: 12px;
	color: #666;
	cursor: pointer;
}
</style>
