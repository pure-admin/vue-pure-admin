<script setup lang="ts">
import dayjs from "dayjs";
import axios from "axios";
import MdEditor from "md-editor-v3";
import VueDanmaku from "vue3-danmaku";
import Bar from "./components/Bar.vue";
import Pie from "./components/Pie.vue";
import Line from "./components/Line.vue";
import TypeIt from "@/components/ReTypeit";
import Github from "./components/Github.vue";
import { openLink, randomColor } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";
import { ref, computed, markRaw, onMounted, onUnmounted } from "vue";

defineOptions({
  name: "Welcome"
});

const danmus = [
  "太好用了吧",
  "so easy",
  "效率大大提高呀",
  "还有精简版，还分国际化和非国际化，Perfect 😘",
  "好多组件呀，爱啦爱啦 ❤️",
  "精简版开发体验也太赞了吧 🙀",
  "pure-admin-table 真方便呀",
  "哇塞，pure-admin-utils 好多常用、易用的工具呀",
  "我要 star 这个项目，爱啦爱啦",
  "免费、开源做到这个程度，真不错 👍",
  "文档简单易懂，上手真快",
  "呀！还有免费的教学视频呢，我要去学习一下咯",
  "稳定、可靠，未来可期呀，加油！",
  "太卷了，太卷了，慢点让我跟上 😄"
];

let timer = 0;
const list = ref();
const danmaku = ref();
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

function resizeHandler() {
  if (timer) clearTimeout(timer);
  timer = window.setTimeout(() => {
    danmaku.value.resize();
  }, 500);
}

axios
  .get("https://api.github.com/repos/xiaoxian521/vue-pure-admin/releases")
  .then(res => {
    list.value = res.data.map(v => {
      return {
        content: v.body,
        timestamp: dayjs(v.published_at).format("YYYY/MM/DD hh:mm:ss A"),
        icon: markRaw(
          useRenderFlicker({
            background: randomColor({ type: "hex" }) as string
          })
        )
      };
    });
  });

onMounted(() => {
  window.onresize = () => resizeHandler();
});

onUnmounted(() => {
  window.onresize = null;
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
        <el-card style="height: 410px">
          <template #header>
            <a
              :class="titleClass"
              href="https://github.com/xiaoxian521"
              target="_black"
            >
              <TypeIt
                :className="'type-it1'"
                :values="['GitHub信息']"
                :cursor="false"
                :speed="120"
              />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Github />
              <vue-danmaku
                ref="danmaku"
                loop
                useSlot
                isSuspend
                randomChannel
                :debounce="1200"
                :danmus="danmus"
                style="width: 100%; height: 80px"
              >
                <template v-slot:dm="{ danmu }">
                  <p :style="{ color: randomColor({ type: 'hex' }) as string }">
                    {{ danmu }}
                  </p>
                </template>
              </vue-danmaku>
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
        <el-card style="height: 410px">
          <template #header>
            <a
              :class="titleClass"
              href="https://github.com/xiaoxian521/vue-pure-admin/releases"
              target="_black"
            >
              <TypeIt
                :className="'type-it2'"
                :values="['PureAdmin 版本日志']"
                :cursor="false"
                :speed="80"
              />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar height="324px">
                <el-timeline v-show="list?.length > 0">
                  <el-timeline-item
                    v-for="(item, index) in list"
                    :key="index"
                    :icon="item.icon"
                    :timestamp="item.timestamp"
                  >
                    <md-editor v-model="item.content" preview-only />
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
            <a
              :class="titleClass"
              href="https://github.com/xiaoxian521/vue-pure-admin"
              target="_black"
            >
              <TypeIt
                :className="'type-it3'"
                :values="['GitHub饼图信息']"
                :cursor="false"
                :speed="120"
              />
            </a>
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
            <a
              :class="titleClass"
              href="https://github.com/xiaoxian521/vue-pure-admin"
              target="_black"
            >
              <TypeIt
                :className="'type-it4'"
                :values="['GitHub折线图信息']"
                :cursor="false"
                :speed="120"
              />
            </a>
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
            <a
              :class="titleClass"
              href="https://github.com/xiaoxian521/vue-pure-admin"
              target="_black"
            >
              <TypeIt
                :className="'type-it5'"
                :values="['GitHub柱状图信息']"
                :cursor="false"
                :speed="120"
              />
            </a>
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
