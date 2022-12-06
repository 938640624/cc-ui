<template>
    <div class="cc-index-list">
        <li
          class="cube-index-list"
          @click="selectItem()"
        >
                <div>
                    {{group.name}}
                </div>
        </li>
        <slot></slot>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-action-toast'
const EVENT_SELECT = 'event-select'
export default {
    name: COMPONENT_NAME,
    props: {
        group: {
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
            this.$emit(EVENT_SELECT, this.group)
        }
    }
}
</script>
<style lang="scss" scoped>
    .cube-index-list {
        padding: 16px 16px 10px 16px;
        line-height: 1;
        font-size: 16px;
        letter-spacing: 1px;
        color: #999;
        background: #f7f7f7;
    }
</style>