<template>
  <div class="m-flipper" :class="[flipType, {'go': isFlipping}]">
    <div class="digital front" :class="textClass(frontTextFromData)"></div>
    <div class="digital back" :class="textClass(backTextFromData)"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    // front paper text
    // 前牌文字
    frontText: {
      type: [Number, String],
      default: 0,
    },
    // back paper text
    // 后牌文字
    backText: {
      type: [Number, String],
      default: 1,
    },
    // flipping duration, please be consistent with the CSS animation-duration value.
    // 翻牌动画时间，与CSS中设置的animation-duration保持一致
    duration: {
      type: Number,
      default: 600,
    },
  },
  setup(props) {
    const { frontText, backText, duration } = props;
    let isFlipping = ref(false);
    let flipType = ref("down");
    let frontTextFromData = ref(frontText);
    let backTextFromData = ref(backText);

    const textClass = (number: string) => {
      return "number" + number;
    };

    const flip = (type: string, front: number, back: number) => {
      // 如果处于翻转中，则不执行
      if (isFlipping.value) return false;
      frontTextFromData.value = front;
      backTextFromData.value = back;
      // 根据传递过来的type设置翻转方向
      flipType.value = type;
      // 设置翻转状态为true
      isFlipping.value = true;

      setTimeout(() => {
        // 设置翻转状态为false
        isFlipping.value = false;
        frontTextFromData.value = back;
      }, duration);
    };

    // 下翻牌
    const flipDown = (front: any, back: any): void => {
      flip("down", front, back);
    };

    // 上翻牌
    const flipUp = (front: any, back: any): void => {
      flip("up", front, back);
    };

    // 设置前牌文字
    const setFront = (text: number): void => {
      frontTextFromData.value = text;
    };

    // 设置后牌文字
    const setBack = (text: number): void => {
      backTextFromData.value = text;
    };

    return {
      isFlipping,
      flipType,
      frontTextFromData,
      backTextFromData,
      textClass,
      flip,
      flipDown,
      flipUp,
      setFront,
      setBack,
    };
  },
});
</script>

<style>
.m-flipper {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 100px;
  line-height: 100px;
  border: solid 1px #000;
  border-radius: 10px;
  background: #fff;
  font-size: 66px;
  color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-family: "Helvetica Neue";
}

.m-flipper .digital:before,
.m-flipper .digital:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  background: #000;
  overflow: hidden;
  box-sizing: border-box;
}

.m-flipper .digital:before {
  top: 0;
  bottom: 50%;
  border-radius: 10px 10px 0 0;
  border-bottom: solid 1px #666;
}

.m-flipper .digital:after {
  top: 50%;
  bottom: 0;
  border-radius: 0 0 10px 10px;
  line-height: 0;
}

/*向下翻*/
.m-flipper.down .front:before {
  z-index: 3;
}

.m-flipper.down .back:after {
  z-index: 2;
  transform-origin: 50% 0%;
  transform: perspective(160px) rotateX(180deg);
}

.m-flipper.down .front:after,
.m-flipper.down .back:before {
  z-index: 1;
}

.m-flipper.down.go .front:before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 0.6s ease-in-out both;
  box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.m-flipper.down.go .back:after {
  animation: backFlipDown 0.6s ease-in-out both;
}

/*向上翻*/
.m-flipper.up .front:after {
  z-index: 3;
}

.m-flipper.up .back:before {
  z-index: 2;
  transform-origin: 50% 100%;
  transform: perspective(160px) rotateX(-180deg);
}

.m-flipper.up .front:before,
.m-flipper.up .back:after {
  z-index: 1;
}

.m-flipper.up.go .front:after {
  transform-origin: 50% 0;
  animation: frontFlipUp 0.6s ease-in-out both;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.m-flipper.up.go .back:before {
  animation: backFlipUp 0.6s ease-in-out both;
}

@keyframes frontFlipDown {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(-180deg);
  }
}

@keyframes backFlipDown {
  0% {
    transform: perspective(160px) rotateX(180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

@keyframes frontFlipUp {
  0% {
    transform: perspective(160px) rotateX(0deg);
  }

  100% {
    transform: perspective(160px) rotateX(180deg);
  }
}

@keyframes backFlipUp {
  0% {
    transform: perspective(160px) rotateX(-180deg);
  }

  100% {
    transform: perspective(160px) rotateX(0deg);
  }
}

.m-flipper .number0:before,
.m-flipper .number0:after {
  content: "0";
}

.m-flipper .number1:before,
.m-flipper .number1:after {
  content: "1";
}

.m-flipper .number2:before,
.m-flipper .number2:after {
  content: "2";
}

.m-flipper .number3:before,
.m-flipper .number3:after {
  content: "3";
}

.m-flipper .number4:before,
.m-flipper .number4:after {
  content: "4";
}

.m-flipper .number5:before,
.m-flipper .number5:after {
  content: "5";
}

.m-flipper .number6:before,
.m-flipper .number6:after {
  content: "6";
}

.m-flipper .number7:before,
.m-flipper .number7:after {
  content: "7";
}

.m-flipper .number8:before,
.m-flipper .number8:after {
  content: "8";
}

.m-flipper .number9:before,
.m-flipper .number9:after {
  content: "9";
}
</style>
