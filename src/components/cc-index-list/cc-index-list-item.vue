<template>
    <div>
        <li
          class="cube-index-list-item"
          @click="selectItem()"
        >
                <div class="cube-index-list-item-content">
                    <span>{{item.name}}</span>
                    <slot></slot>
                </div>
        </li>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-action-toast'
const EVENT_SELECT_ITEM = 'event-select-item'
export default {
    name: COMPONENT_NAME,
    props: {
        item: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        
    },
    methods: {
        selectItem() {
            this.$emit(EVENT_SELECT_ITEM, this.item)
        }
    }
}
</script>
<style lang="scss" scoped>
    li {
        list-style: none;
    }
    .cube-index-list-item {
        position: relative;
        height: 50px;
        line-height: 50px;
        padding: 0 26px 0 16px;
        border-bottom: 1px solid #EDF0F4;
    }
    .cube-index-list-item-content {
        display: flex;
        justify-content: space-between;
    }
</style>