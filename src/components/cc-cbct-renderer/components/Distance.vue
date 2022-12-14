<template>
    <g>
        <circle :fill="color" r="4" :cx="point1.x" :cy="point1.y" style="stroke-width: 4"></circle>
        <line :stroke="color" :x1="point1.x" :y1="point1.y" :x2="point2.x" :y2="point2.y"></line>
        <text :x="(point2.x + point1.x) / 2" :y="(point2.y + point1.y - 12) / 2" :fill="color">{{ distance }}</text>
        <circle :fill="color" r="4" :cx="point2.x" :cy="point2.y" style="stroke-width: 4"></circle>
    </g>
</template>

<script>
export default {
    props: {
        point1: Object,
        point2: Object,
        distance: String,
        color: {
            type: String,
            default: '#00f',
        },
    },
    computed: {},
    methods: {},
}
</script>

<style></style>
