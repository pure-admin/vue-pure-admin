<script setup lang="ts">
import { ref } from "vue";
const lists = ref([
  { type: "", label: "善良" },
  { type: "success", label: "好学" },
  { type: "info", label: "幽默" },
  { type: "danger", label: "旅游" },
  { type: "warning", label: "追剧" }
]);
</script>

<template>
  <el-descriptions
    class="margin-top"
    direction="vertical"
    :column="3"
    size="medium"
    border
  >
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-user"></i>
        用户名
      </template>
      xiaoxian
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      123456789
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-location-outline"></i>
        居住地
      </template>
      上海
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions
    class="margin-top"
    direction="vertical"
    :column="2"
    size="medium"
    border
  >
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-tickets"></i>
        标签
      </template>
      <el-tag
        v-for="item in lists"
        :key="item.label"
        :type="item.type"
        size="mini"
        effect="dark"
      >
        {{ item.label }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-office-building"></i>
        联系地址
      </template>
      上海市徐汇区
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions
    class="margin-top"
    direction="vertical"
    :column="1"
    size="medium"
    border
  >
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-notebook-1"></i>
        留言
      </template>
      好好学习，天天向上
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-tag--mini {
  margin-right: 10px !important;
}
</style>
