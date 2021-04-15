<template>
  <el-space wrap>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>无缝滚动示例</span>
          <el-button class="button" type="text" @click="changeDirection('top')">向上滚动</el-button>
          <el-button class="button" type="text" @click="changeDirection('bottom')">向下滚动</el-button>
          <el-button class="button" type="text" @click="changeDirection('left')">向左滚动</el-button>
          <el-button class="button" type="text" @click="changeDirection('right')">向右滚动</el-button>
        </div>
      </template>
      <SeamlessScroll ref="scroll" :data="listData" :class-option="classOption" class="warp">
        <ul class="item">
          <li v-for="(item, index) in listData" :key="index">
            <span class="title" v-text="item.title"></span>
          </li>
        </ul>
      </SeamlessScroll>
    </el-card>
  </el-space>
</template>

<script lang='ts'>
import { ref, unref } from "vue";
import { templateRef } from "@vueuse/core";

import SeamlessScroll from "/@/components/SeamlessScroll";
export default {
  components: {
    SeamlessScroll
  },
  setup() {
    const scroll = templateRef<HTMLElement | null>("scroll", null);

    let listData = ref([
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

    let classOption = ref({
      direction: "top"
    });

    function changeDirection(val) {
      scroll.value.reset();
      classOption.value.direction = val;
    }

    return {
      listData,
      classOption,
      changeDirection
    };
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    margin-right: 20px;
  }
}
.warp {
  height: 270px;
  width: 360px;
  margin: 0 auto;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li,
    a {
      display: block;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 15px;
    }
  }
}
</style>
