<template>
    <div class="admin-layout">
        <div class="siderbar">
            <div class="menus">
                <router-link
                    v-for="(item, index) in menus"
                    :key="index"
                    :to="{ path: item.path, name: item.name }"
                    class="menu"
                    :class="item.path.indexOf(currentPath) > -1 ? 'active' : ''"
                >
                    <SvgIcon :name="item.meta.icon" />
                    {{ item.meta.name }}
                </router-link>
            </div>
        </div>
        <div class="right" ref="rightRef">
            <div class="topbar">
                <div class="topbar-icon avatar" :title="t('form.avatar')" @click="handleAvatarClick">
                    <img :src="avatarOssUrl" />
                </div>
                <div class="topbar-icon loginout" :title="t('router.logintOut')" @click.once="handleLogoutClick">
                    <SvgIcon name="loginout" />
                </div>
            </div>
            <main class="main">
                <router-view />
            </main>
            <!-- <div class="patient-model-bg" :style="{ height: bgHeight }"></div> -->
        </div>
    </div>
</template>

<script setup name="admin-layout-page">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import defaultAvatar from '@/assets/img/default-avatar.png'
import { debounce } from '@/utils/debounce'
import { useOssStore } from '@/store/oss'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const ossStore = useOssStore()
// const bgHeight = ref('')
const rightRef = ref(null)
const debounceHeight = debounce(300, false)

// 头像
const avatarOssUrl = ref(defaultAvatar)
let avatarUrl = ''

// 路由菜单
const menus = router.options.routes
    .filter((item) => item.name === 'AdminLayout')[0]
    .children.filter((item) => {
        if (!item.meta) return
        if (userStore.info.isAdmin === 1) return item
        if (userStore.info.isAdmin === 0 && !item.isAdmin) return item
    })

const currentPath = computed(() => {
    const current = route.path.slice(1).split('/')[0]
    return current
})

const handleAvatarClick = () => {
    router.push({ path: '/user' })
}
// 注销
const handleLogoutClick = async () => {
    await userStore.logout()
    location.reload()
}

// 通过mutationObserver来监听高度变化
const initMutationObserver = () => {
    nextTick(() => {
        const MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver
        const mutationObserver = new MutationObserver(() => {
            debounceHeight(() => {
                // const height = window.getComputedStyle(rightRef.value)['height']
                // bgHeight.value = height
                initAvatar()
            })
        })
        console.log(rightRef.value, mutationObserver, 'mutationObserver')
        mutationObserver.observe(rightRef.value, {
            childList: true, // 子节点的变动（新增、删除或者更改）
            attributes: true, // 属性的变动
            attributeFilter: ['style'],
            characterData: true, // 节点内容或节点文本的变动
            subtree: true, // 是否将观察器应用于该节点的所有后代节点
        })
    })
}

const initAvatar = async () => {
    const { avatar } = userStore.info
    if (avatar && avatar !== avatarUrl) {
        avatarUrl = avatar
        avatarOssUrl.value = await ossStore.getUrl({ path: avatar })
    }
}

onMounted(() => {
    initMutationObserver()
})
</script>

<style lang="scss" scoped>
.admin-layout {
    display: flex;
    .siderbar {
        width: 70px;
        height: 100vh;
        background: #242424;
        position: fixed;
        word-break: keep-all;
        .menus {
            color: #c4c4c4;
            margin-top: 60px;
            .active {
                position: relative;
                background: #000000;
                svg {
                    color: #18abd8;
                }
                &::before {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 4px;
                    height: 70px;
                    background: #18abd8;
                }
            }
        }
        .foot {
            position: absolute;
            width: 100%;
            bottom: 10px;
            color: #c4c4c4;
        }
        .menu {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 70px;
            font-size: 12px;
            cursor: pointer;
            svg {
                font-size: 24px;
                margin-bottom: 4px;
            }
        }
    }
    .right {
        width: calc(100vw - 70px);
        min-height: 100vh;
        background-color: #ffffff;
        padding-left: 70px;
        color: #575757;
        // background-color: #333333;
        // color: #ffffff;
        .topbar {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-bottom: 5px;
            box-sizing: border-box;
            .topbar-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 8px;
                z-index: 1;
            }
            .avatar {
                border: 2px solid #18bae3;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
            .loginout {
                background-color: #ffffff;
                font-size: 26px;
                text-align: center;
                line-height: 40px;
                border: 1px solid #c4c4c4;
                border-radius: 50%;
                // background-color: #242424;
            }
        }
        .main {
            width: 100%;
            background-color: #f8f8f8;
            height: 100%;
            // background-color: #333333;
        }
        // .patient-model-bg {
        //     width: calc(100% - 70px);
        //     top: 0;
        //     left: 70px;
        //     z-index: 0;
        //     position: absolute;
        //     background: url('/src/assets/img/model-bg.png');
        // }
    }
}
</style>
