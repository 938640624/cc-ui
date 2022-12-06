<template>
  <div class="cc-complex-effect">
    <div class="complex-effect-content">

      <div class="complex-effect-box box-one">
        <article class="principle one">
          <div class="shape">
            <div class="container">
              <span class="item one"></span>
              <span class="item two"></span>
              <span class="item three"></span>
              <span class="item four"></span>
            </div>
          </div>
        </article>
      </div>

      <div class="complex-effect-box box-two">
        <article class="principle two">
          <div class="shape">
            <div class="container">
              <span class="front"></span>
              <span class="back"></span>
              <span class="left"></span>
              <span class="right"></span>
              <span class="top"></span>
              <span class="bottom"></span>
            </div>
          </div>
        </article>
      </div>

      <div class="complex-effect-box box-three">
        <article class="principle three">
          <div class="shape a"></div>
          <div class="shape b"></div>
          <div class="shape c"></div>
        </article>
      </div>

      <div class="complex-effect-box box-four">
        <article class="principle four">
          <div class="shape"></div>
        </article>
      </div>
    </div>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-complex-effect'
export default {
  name: COMPONENT_NAME,
  components: {

  },
  props: {

  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="scss">
  .complex-effect-content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .complex-effect-box {
      width: 300px;
      height: 300px;
      border: 1px solid #edf0f4;
      padding: 40px 0px;
      margin: 10px 40px;
      box-sizing: border-box;
      position: relative;
      background-color: #E9B59F;
      border-radius: 10px;
    }
    .principle {
      width: 100%;
      height: 300px;
      position: absolute;
      bottom:32px;
      right: 30px;
    }

    .shape {
      background: #2d97db;
      border: 1em solid #fff;
      width: 4em;
      height: 4em;
      position: absolute;
      top: calc(50% - 2em);
      left: calc(50% - 2em);
    }

      .box-one {
        .one .shape {
          background: none;
          /* perspective: 设置元素被查看位置的视图 */
          perspective: 400px;
          /* perspective-origin: 设置3D元素的基点位置 */
          perspective-origin: center;
        }

        .one .shape .container {
          // animation-iteration-count: n(动画播放n次)/ infinite(动画播放无限次)
          animation: show-container-one 8s infinite cubic-bezier(.6,-0.44,.37,1.44);
          /* transform-style: 使被转换的子元素保留其3D转换; 参数:flat(子元素不保留3D位置) / preserve-3d(子元素保留3D位置)*/
          transform-style: preserve-3d;
          width: 3em;
          height: 3em;
          border: 1em solid #D24D57;
          background: #2d97db;
        }

        .one .item {
          background-color: #1f7bb6;
          position: absolute;
        }

        .one .item.one {
          animation: show-text-one 8s 0.1s infinite ease-out;
          height: 6%;
          width: 30%;
          top: 15%;
          left: 25%;
        }

        .one .item.two {
          animation: show-text-one 8s 0.2s infinite ease-out;
          height: 6%;
          width: 20%;
          top: 30%;
          left: 25%;
        }

        .one .item.three {
          animation: show-text-one 8s 0.3s infinite ease-out;
          height: 6%;
          width: 50%;
          top: 45%;
          left: 25%;
        }

        .one .item.four {
          animation: show-button-one 8s infinite cubic-bezier(.64,-0.36,.1,1.43);
          height: 20%;
          width: 40%;
          top: 65%;
          left: 30%;
        }
      }

      .box-two {
        .two .shape {
          background: none;
          perspective: 400px;
          perspective-origin: center;
        }

        .two .shape .container {
          animation: show-container-two 4s infinite cubic-bezier(.6,-0.44,.37,1.44);
          transform-style: preserve-3d; 
        }

        .two .shape span {
          display: block;
          position: absolute;
          opacity: 1;
          width: 4em;
          height: 4em;
          border: 1em solid #D24D57;
          background: #2d97db;
        }
        .two .shape span.front {
          transform: translateZ(3em);
        }
        .two .shape span.back {
          transform: translateZ(-3em);
        }
        .two .shape span.left {
          transform: rotateY(-90deg) translateZ(-3em);
        }
        .two .shape span.right {
          transform: rotateY(-90deg) translateZ(3em);
        }
        .two .shape span.top {
          transform: rotateX(-90deg) translateZ(-3em);
        }
        .two .shape span.bottom {
          transform: rotateX(-90deg) translateZ(3em);
        }
      }

      .box-three {
        .shape {
          width: 3em;
          height: 3em;
          left: calc(50% - 0.6em);
        }
        .three .shape.a {
          transform: translateX(-6em);
          animation: three-shape-a 4s cubic-bezier(.57,-0.5,.43,1.53) infinite;
        }
        .three .shape.b {
          top: calc(50% + 6em);
          opacity: 0;
          animation: three-shape-b 4s linear infinite;
        }
        .three .shape.c {
          transform: translateX(6em);
          animation: three-shape-c 4s cubic-bezier(.57,-0.5,.43,1.53) infinite;
        }
      }

      .box-four {
        .four .shape {
          animation: show-container-four 4s infinite linear;
          // transform-origin: 
        }
      }
    }


  @keyframes show-container-one {
    0% {
      opacity: 0;
      transform: rotateX(-90deg);
    }
    10% {
      opacity: 1;
      transform: none;
      width: 4em;
      height: 4em;
    }
    15%, 90% {
      width: 12em;
      height: 12em;
      transform: translate(-4em, -4em);
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: rotateX(-90deg);
      width: 4em;
      height: 4em;
    }
  }

  @keyframes show-text-one {
    0%, 15% {
      transform: translateY(1em);
      opacity: 0;
    }
    20%, 85% {
      opacity: 1;
      transform: none;
    }
    88%, 100% {
      opacity: 0;
      transform: translateY(-1em);
      /* animation-timing-function:从开头到结尾以相同的速度来播放动画 */
      animation-timing-function: cubic-bezier(.64,-0.36,.1,1.43);
    }
  }

  @keyframes show-button-one {
    0%, 25% {
      transform: scale(0);
      opacity: 0;
    }
    35%, 80% {
      transform: none;
      opacity: 1;
    }
    90%, 100% {
      opacity: 0;
      transform: scale(0);
    }
  }

  @keyframes show-container-two {
  0% {
    opacity: 0;
  }
  10%, 40% {
    transform: none;
    opacity: 1;
  }
  60%, 75% {
    transform: rotateX(-20deg) rotateY(-45deg) translateY(4em);
    animation-timing-function: cubic-bezier(1,-0.05,.43,-0.16);
    opacity: 1;
  }
  100% {
    transform: translateZ(-180em) translateX(20em);
    opacity: 0;
  }
}

@keyframes three-shape-a {
  0%, 50% {
    transform: translateX(-5.5em);
  }
  70%, 100% {
    transform: translateX(-10em);
  }
}

@keyframes three-shape-b {
  0% {
    transform: none;
  }
  20%, 30% {
    transform: translateY(-1.5em);
    opacity: 1;
    animation-timing-function: cubic-bezier(.57,-0.5,.43,1.53);
  }
  32% {
    transform: translateY(-1.25em);
    opacity: 1;
  }
  34% {
    transform: translateY(-1.75em);
    opacity: 1;
  }
  36%, 38% {
    transform: translateY(-1.25em);
    opacity: 1;
  }
  42%, 60% {
    transform: translateY(-1.5em);
    opacity: 1;
  }
  75%, 100% {
    transform: translateY(-8em);
    opacity: 1;
  }
}

@keyframes three-shape-c {
  0%, 50% {
    transform: translateX(5.5em);
  }
  70%, 100% {
    transform: translateX(10em);
  }
}
</style>
