<script setup lang="ts">
import axios from "axios";
import Bar from "./components/Bar.vue";
import Pie from "./components/Pie.vue";
import Markdown from "vue3-markdown-it";
import Line from "./components/Line.vue";
import TypeIt from "@/components/ReTypeit";
import Github from "./components/Github.vue";
import { ref, computed, markRaw } from "vue";
import { openLink, randomColor } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";

defineOptions({
  name: "Welcome"
});

const list = ref();
const date: Date = new Date();
const loading = ref<boolean>(true);
const titleClass = computed(() => {
  return ["text-base", "font-medium"];
});

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

const greetings = computed(() => {
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return "上午阳光明媚，祝你薪水翻倍🌞！";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "下午小风娇好，愿你青春不老😃！";
  } else {
    return "折一根天使羽毛，愿拂去您的疲惫烦恼忧伤🌛！";
  }
});

axios
  .get("https://api.github.com/repos/xiaoxian521/vue-pure-admin/releases")
  .then(res => {
    list.value = res.data.map(v => {
      return {
        content: v.body,
        timestamp: v.published_at,
        icon: markRaw(
          useRenderFlicker({
            background: randomColor({ type: "hex" }) as string
          })
        )
      };
    });
  });
</script>

<template>
  <div class="welcome">
    <el-card class="top-content dark:border-none">
      <div class="left-mark select-none">
        <img
          src="https://avatars.githubusercontent.com/u/44761321?v=4"
          title="直达仓库地址"
          @click="openLink('https://github.com/xiaoxian521/vue-pure-admin')"
        />
        <TypeIt
          :className="'type-it0'"
          :values="[greetings]"
          :cursor="false"
          :speed="60"
        />
      </div>
    </el-card>

    <el-row :gutter="24" style="margin: 20px">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card style="height: 360px">
          <template #header>
            <span :class="titleClass">
              <TypeIt
                :className="'type-it1'"
                :values="['GitHub信息']"
                :cursor="false"
                :speed="120"
              />
            </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Github />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200
          }
        }"
      >
        <el-card style="height: 360px">
          <template #header>
            <span :class="titleClass">
              <TypeIt
                :className="'type-it2'"
                :values="['Pure-Admin 版本日志']"
                :cursor="false"
                :speed="120"
              />
            </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar height="274px">
                <el-timeline v-show="list?.length > 0">
                  <el-timeline-item
                    v-for="(item, index) in list"
                    :key="index"
                    :icon="item.icon"
                    :timestamp="item.timestamp"
                  >
                    <Markdown :source="item.content" />
                  </el-timeline-item>
                </el-timeline>
                <el-empty v-show="list?.length === 0" />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <span :class="titleClass">
              <TypeIt
                :className="'type-it3'"
                :values="['GitHub饼图信息']"
                :cursor="false"
                :speed="120"
              />
            </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Pie />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <span :class="titleClass">
              <TypeIt
                :className="'type-it4'"
                :values="['GitHub折线图信息']"
                :cursor="false"
                :speed="120"
              />
            </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Line />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
        style="margin-bottom: 20px"
        v-motion
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400
          }
        }"
      >
        <el-card>
          <template #header>
            <span :class="titleClass">
              <TypeIt
                :className="'type-it5'"
                :values="['GitHub柱状图信息']"
                :cursor="false"
                :speed="120"
              />
            </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Bar />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 0 !important;
}

.welcome {
  height: 100%;

  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background: var(--el-bg-color);

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
}
</style>
