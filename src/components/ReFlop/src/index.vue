<script setup lang="ts">
import { ref, unref, nextTick, onUnmounted } from "vue";
import flippers from "./filpper";

const timer = ref(null);
const flipObjs = ref([]);

const flipperHour1 = ref();
const flipperHour2 = ref();
const flipperMinute1 = ref();
const flipperMinute2 = ref();
const flipperSecond1 = ref();
const flipperSecond2 = ref();

// 初始化数字
const init = () => {
  const now = new Date();
  const nowTimeStr = formatDate(new Date(now.getTime()), "hhiiss");
  for (let i = 0; i < flipObjs.value.length; i++) {
    flipObjs?.value[i]?.setFront(nowTimeStr[i]);
  }
};

// 开始计时
const run = () => {
  timer.value = setInterval(() => {
    // 获取当前时间
    const now = new Date();
    const nowTimeStr = formatDate(new Date(now.getTime() - 1000), "hhiiss");
    const nextTimeStr = formatDate(now, "hhiiss");
    for (let i = 0; i < flipObjs.value.length; i++) {
      if (nowTimeStr[i] === nextTimeStr[i]) {
        continue;
      }
      flipObjs?.value[i]?.flipDown(nowTimeStr[i], nextTimeStr[i]);
    }
  }, 1000);
};

// 正则格式化日期
const formatDate = (date: Date, dateFormat: string) => {
  /* 单独格式化年份，根据y的字符数量输出年份
     * 例如：yyyy => 2019
            yy => 19
            y => 9
     */
  if (/(y+)/.test(dateFormat)) {
    dateFormat = dateFormat.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  // 格式化月、日、时、分、秒
  const o = {
    "m+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "i+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(dateFormat)) {
      // 取出对应的值
      const str = o[k] + "";
      /* 根据设置的格式，输出对应的字符
       * 例如: 早上8时，hh => 08，h => 8
       * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
       * 例如: 下午15时，hh => 15, h => 15
       */
      dateFormat = dateFormat.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return dateFormat;
};

// 日期时间补零
const padLeftZero = (str: string | any[]) => {
  return ("00" + str).substr(str.length);
};

nextTick(() => {
  flipObjs.value = [
    unref(flipperHour1),
    unref(flipperHour2),
    unref(flipperMinute1),
    unref(flipperMinute2),
    unref(flipperSecond1),
    unref(flipperSecond2)
  ];

  init();
  run();
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});
</script>

<template>
  <div class="flip-clock">
    <flippers ref="flipperHour1" />
    <flippers ref="flipperHour2" />
    <em>:</em>
    <flippers ref="flipperMinute1" />
    <flippers ref="flipperMinute2" />
    <em>:</em>
    <flippers ref="flipperSecond1" />
    <flippers ref="flipperSecond2" />
  </div>
</template>

<style>
.flip-clock .m-flipper {
  margin: 0 3px;
}

.flip-clock em {
  display: inline-block;
  font-size: 66px;
  font-style: normal;
  line-height: 102px;
  vertical-align: top;
}
</style>
