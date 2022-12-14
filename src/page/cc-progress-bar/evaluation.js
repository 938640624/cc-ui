export default {
    path: '/evaluating-the-effect',
    component: () => import('@/views/evaluating-the-effect/view'),
    children: [
        {
            path: 'monitor',
            // component: () => import("@/views/evaluating-the-effect/monitor")
            component: () => import('@/views/evaluating-the-effect/monitor/index-old.vue'),
        },
        {
            path: 'query',
            component: () => import('@/views/evaluating-the-effect/query'),
        },
        {
            path: 'compare',
            component: () => import('@/views/evaluating-the-effect/compare'),
        },
    ],
}
