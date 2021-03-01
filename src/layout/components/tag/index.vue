<template>
  <div class="tags">
    <el-tag
      size="medium"
      v-for="tag in tags"
      :key="tag.name"
      closable
      :type="tag.type"
      >{{ tag.name }}</el-tag
    >
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent, onUnmounted, onMounted } from "vue";
export default defineComponent({
  name: "tag",
  setup() {
    let flag = ref(true);

    const tags = ref([
      { name: "首页", type: "info" },
      { name: "基础管理", type: "info" },
    ]);

    return {
      tags,
      flag,
    };
  },
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
