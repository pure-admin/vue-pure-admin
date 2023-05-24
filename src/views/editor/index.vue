<script setup lang="ts">
import { ref } from "vue";
import { Base, Multi, PicUpload } from "./components";

defineOptions({
  name: "Editor"
});

const activeNames = ref(["1"]);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          编辑器组件，采用开源的
          <el-link
            href="https://www.wangeditor.com"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            Wangeditor
          </el-link>
        </span>
      </div>
    </template>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="基础用法" name="1">
        <Base />
      </el-collapse-item>
      <el-collapse-item title="多个富文本" name="2">
        <Multi />
      </el-collapse-item>
      <el-collapse-item title="自定义图片上传" name="3">
        <PicUpload />
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  padding-left: 10px;
}
</style>
