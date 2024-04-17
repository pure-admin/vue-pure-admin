<script setup lang="ts">
import { ref, reactive, unref } from "vue";
import SeamlessScroll from "@/components/ReSeamlessScroll";

defineOptions({
  name: "SeamlessScroll"
});

const scroll = ref();

const listData = ref([
  {
    title: "无缝滚动第一行无缝滚动第一行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第二行无缝滚动第二行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第三行无缝滚动第三行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第四行无缝滚动第四行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第五行无缝滚动第五行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第六行无缝滚动第六行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第七行无缝滚动第七行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第八行无缝滚动第八行！！！！！！！！！！"
  },
  {
    title: "无缝滚动第九行无缝滚动第九行！！！！！！！！！！"
  }
]);

const classOption = reactive({
  direction: "top"
});

function changeDirection(val) {
  (unref(scroll) as any).reset();
  unref(classOption).direction = val;
}
</script>

<template>
  <el-space wrap>
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium">无缝滚动</span>
          <el-button
            class="button"
            link
            type="primary"
            @click="changeDirection('top')"
          >
            <span
              :style="{ color: classOption.direction === 'top' ? 'red' : '' }"
            >
              向上滚动
            </span>
          </el-button>
          <el-button
            class="button"
            link
            type="primary"
            @click="changeDirection('bottom')"
          >
            <span
              :style="{
                color: classOption.direction === 'bottom' ? 'red' : ''
              }"
            >
              向下滚动
            </span>
          </el-button>
          <el-button
            class="button"
            link
            type="primary"
            @click="changeDirection('left')"
          >
            <span
              :style="{ color: classOption.direction === 'left' ? 'red' : '' }"
            >
              向左滚动
            </span>
          </el-button>
          <el-button
            class="button"
            link
            type="primary"
            @click="changeDirection('right')"
          >
            <span
              :style="{ color: classOption.direction === 'right' ? 'red' : '' }"
            >
              向右滚动
            </span>
          </el-button>
        </div>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/seamless-scroll.vue"
          target="_blank"
        >
          代码位置 src/views/components/seamless-scroll.vue
        </el-link>
      </template>
      <SeamlessScroll
        ref="scroll"
        :data="listData"
        :class-option="classOption"
        class="warp"
      >
        <ul class="item">
          <li v-for="(item, index) in listData" :key="index">
            <span class="title" v-text="item.title" />
          </li>
        </ul>
      </SeamlessScroll>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    margin-right: 20px;
  }
}

.warp {
  width: 360px;
  height: 270px;
  margin: 0 auto;
  overflow: hidden;

  ul {
    padding: 0;
    margin: 0 auto;
    list-style: none;

    li,
    a {
      display: flex;
      justify-content: space-between;
      height: 30px;
      font-size: 15px;
      line-height: 30px;
    }
  }
}
</style>
