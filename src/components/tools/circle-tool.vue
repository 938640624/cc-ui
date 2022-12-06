<template>
    <span class="circle-tool">
      <template>
        <i :style="circleHeight" v-for="(item,index) in 12" :key="index"></i>
      </template>
    </span>
</template>
<script>
const COMPONENT_NAME = 'circle-tool'
export default {
    name: COMPONENT_NAME,
    props: {
      height: {
        type: String,
        default: '8px'
      }
    },
    data() {
        return {
          circleHeight: {
            'height': this.height
          }
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
  .circle-tool {
        // margin: 60px auto;
        top: 8px;
        left: 6px;
        position: relative;
        width: 24px;
        height: 20px;
        color: #fff;
        // opacity: 0.45;
        display: inline-block;
        border-color: #fff;

        @for $i from 1 to 13 {
        :nth-child(#{$i}){   
            background-color: #ccc;
            position: absolute;
            animation-delay: ($i - 1)/12+s;
            transform: rotate(30deg * ($i - 6)) translateY(-150%);
        }
    }
    }
    .circle-tool i {
            width: 2px;
            // height: 8px;
            border-radius: 50%/20%;
            opacity: 0.45;
            animation: move 1s linear infinite;
            -webkit-animation: move 1s linear infinite;
    }
    @keyframes move {
        0% {
            opacity: 0.85
        }   
        50% {
            opacity: 0.25
        }
        100% {
            opacity: 0.25
        }     
    }
</style>