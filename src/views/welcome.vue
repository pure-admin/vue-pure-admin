<template>
  <div class="welcome">
    <el-affix :offset="51">
      <div class="top-content">
        <div class="left-mark">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?s=400&u=30907819abd29bb3779bc247910873e7c7f7c12f&v=4"
            alt
          />
          <span>{{ greetings }}</span>
        </div>
        <flop v-if="!mobile" />
      </div>
    </el-affix>
    <!-- <a title="欢迎Star" href="https://github.com/xiaoxian521/CURD-TS" target="_blank">点击打开仓库地址</a> -->
    <!-- <CountTo prefix="$" :startVal="1" :endVal="200" /> -->
  </div>
</template>

<script lang='ts'>
import flop from "../components/flop/index.vue";
import CountTo from "../components/countTo/src/index.vue";
import { ref, unref, computed } from "vue";
import { deviceDetection } from "../utils/deviceDetection";
import echarts from "../echarts"
export default {
  name: "welcome",
  components: {
    flop,
    CountTo,
  },
  setup() {
    console.log('echarts===>', echarts)
    let mobile = ref(deviceDetection());
    let date: Date = new Date();

    let greetings = computed(() => {
      if (date.getHours() >= 0 && date.getHours() < 12) {
        return "上午阳光明媚，祝你薪水翻倍🌞！";
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        return "下午小风娇好，愿你青春不老😃！";
      } else {
        return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
      }
    });

    return {
      greetings,
      mobile,
    };
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  width: 100%;
  margin-top: 1px;
  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    background: #fff;
    padding: 20px;
    .left-mark {
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}
</style>
