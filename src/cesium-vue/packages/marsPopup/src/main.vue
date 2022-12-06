<template>
    <div class="mars-popup" :style="{ width: width, borderColor: borderColor }">
        <div v-if="title || $slots.title" class="mars-popup_header">
            <slot name="title">
                <span class="popup-header-title">{{ title }}</span>
                <svg-icon icon-class="close" class="close-btn" @click-native="$emit('click-close')" />
            </slot>
        </div>
        <div class="mars-popup_content" :style="{ backgroundColor: contentBgColor }">
            <slot />
            <p v-if="moreBtn" class="btn-more" @click="$emit('click-more')">更多>></p>
        </div>
        <span class="border_corner border_corner_left_top" :style="{ borderColor: cornerColor }" />
        <span class="border_corner border_corner_right_top" :style="{ borderColor: cornerColor }" />
        <span class="border_corner border_corner_left_bottom" :style="{ borderColor: cornerColor }" />
        <span class="border_corner border_corner_right_bottom" :style="{ borderColor: cornerColor }" />
    </div>
</template>
<script type="text/javascript">
/**
 * 普通面板
 *
 * @prop {String} [title=""] 标题
 * @prop {String} [width=""] 弹框区域宽度
 * @prop {String} [borderColor="#1F9CB4"] 弹框边框颜色
 * @prop {String} [contentBgColor="#163552"] 内容区域背景颜色
 * @prop {String} [cornerColor="#33D7F6"] 弹框4个角颜色
 * @slot v-slot:title 标题区域
 */
export default {
    name: 'MarsPopup',
    props: {
        title: {
            type: String,
            default: '',
        },
        moreBtn: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '',
        },
        borderColor: {
            type: String,
            default: '',
        },
        contentBgColor: {
            type: String,
            default: '',
        },
        cornerColor: {
            type: String,
            default: '',
        },
    },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/mixins.scss';
.mars-popup {
    max-width: 261px;
    position: relative;
    bottom: 0px;
    display: inline-block;
    border: 1px solid #1f9cb4;
    cursor: default;
    color: #ffffff;
    .mars-popup_header {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        background-color: rgba(51, 215, 246, 0.8);
        .popup-header-title {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .close-btn {
            margin-left: 16px;
            cursor: pointer;
        }
    }
    .mars-popup_content {
        background-color: rgba($color: #163552, $alpha: 0.8);
        padding: 0 16px;
        font-size: 14px;
        box-sizing: border-box;

        @include utils-clearfix;
        .btn-more {
            display: inline-block;
            float: right;
            text-align: right;
            cursor: pointer;
            margin-bottom: 12px;
        }
    }
    .border_corner {
        z-index: 500;
        position: absolute;
        width: 8px;
        height: 8px;
        border: 2px solid #33d7f6;
    }

    .border_corner_left_top {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
    }

    .border_corner_right_top {
        top: -2px;
        right: -2px;
        border-left: none;
        border-bottom: none;
    }

    .border_corner_left_bottom {
        bottom: -2px;
        left: -2px;
        border-right: none;
        border-top: none;
    }

    .border_corner_right_bottom {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
    }
}
</style>
<style>
.mars3d-popup-tip-container,
.mars3d-popup-close-button {
    display: none;
}
.mars3d-popup-background {
    background: none;
    border: none;
}
.mars3d-popup-content {
    margin: 0;
    font-size: 16px;
}
</style>
