<template>
  <div class="tags" :style="{ width: flag ? spreadWidth : shrinkWidth }">
    <el-tag
      size="medium"
      v-for="tag in tags"
      :key="tag.name"
      closable
      :type="tag.type"
    >{{ tag.name }}</el-tag>
  </div>
</template>

<script lang='ts'>
import mitt from "mitt";
export const tagEmitter = mitt();
import { ref, defineComponent, onUnmounted, onMounted } from "vue";
export default defineComponent({
  setup() {
    let flag = ref(true);

    let spreadWidth = ref(document.body.clientWidth - 210 + "px");
    let shrinkWidth = ref(document.body.clientWidth - 66 + "px");

    tagEmitter.on("handletag", e => (flag.value = e));

    tagEmitter.on("resizetag", e => {
      spreadWidth.value = e.spreadWidth;
      shrinkWidth.value = e.shrinkWidth;
    });

    const tags = ref([
      { name: "首页", type: "info" },
      { name: "基础管理", type: "info" }
    ]);

    onUnmounted(() => {
      tagEmitter.off("handletag", callback => Boolean);
    });

    return {
      tags,
      spreadWidth,
      shrinkWidth,
      flag
    };
  }
});
</script>

<style lang="scss" scoped>
.tags {
  height: 32px;
  float: right;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  transition: 0.18s;
}
:deep(.el-tag) {
  background-color: #fff;
  border: 1px solid #d0d7e7;
  margin-left: 4px;
  &:first-child {
    margin-left: 8px;
  }
}
</style>
