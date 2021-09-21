<script setup lang="ts">
import { ref, shallowRef, computed, onBeforeMount } from "vue";
import { useAppStoreHook } from "/@/store/modules/app";
import {
  ReGithub,
  ReInfinite,
  RePie,
  ReLine,
  ReBar
} from "/@/components/ReCharts/index";

const date: Date = new Date();
let loading = ref<boolean>(true);
const componentList = shallowRef<ForDataType<undefined>>([]);

setTimeout(() => {
  loading.value = !loading.value;
}, 500);

let greetings = computed(() => {
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return "上午阳光明媚，祝你薪水翻倍🌞！";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "下午小风娇好，愿你青春不老😃！";
  } else {
    return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
  }
});

onBeforeMount(() => {
  if (useAppStoreHook().device === "mobile") {
    componentList.value = [
      {
        width: "20em",
        title: "GitHub饼图信息",
        component: RePie
      },
      {
        width: "20em",
        title: "GitHub折线图信息",
        component: ReLine
      },
      {
        width: "20em",
        title: "GitHub柱状图信息",
        component: ReBar
      }
    ];
  } else {
    componentList.value = [
      {
        width: "43em",
        title: "GitHub信息",
        component: ReGithub
      },
      {
        width: "43em",
        title: "GitHub滚动信息",
        component: ReInfinite
      },
      {
        width: "28.28em",
        title: "GitHub饼图信息",
        component: RePie
      },
      {
        width: "28.28em",
        title: "GitHub折线图信息",
        component: ReLine
      },
      {
        width: "28.28em",
        title: "GitHub柱状图信息",
        component: ReBar
      }
    ];
  }
});

const openDepot = (): void => {
  window.open("https://github.com/xiaoxian521/vue-pure-admin");
};
</script>

<template>
  <div class="welcome">
    <el-card class="top-content">
      <div class="left-mark">
        <img
          src="https://avatars.githubusercontent.com/u/44761321?s=400&u=30907819abd29bb3779bc247910873e7c7f7c12f&v=4"
          title="直达仓库地址"
          alt
          @click="openDepot"
        />
        <span>{{ greetings }}</span>
      </div>
    </el-card>

    <el-space class="space" wrap size="large">
      <el-skeleton
        v-for="(item, key) in componentList"
        :key="key"
        animated
        :rows="7"
        :loading="loading"
        :class="$style.size"
        :style="{ width: item.width }"
      >
        <template #default>
          <div
            :class="['echart-card', $style.size]"
            :style="{ width: item.width }"
          >
            <h4>{{ item.title }}</h4>
            <component :is="item.component"></component>
          </div>
        </template>
      </el-skeleton>
    </el-space>
  </div>
</template>

<style module scoped>
.size {
  height: 335px;
}
</style>

<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;

  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background: #fff;

    .left-mark {
      display: flex;
      align-items: center;

      img {
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .space {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    padding: 10px;

    .echart-card {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

      h4 {
        margin: 0;
        padding: 20px;
      }
    }
  }
}
</style>
