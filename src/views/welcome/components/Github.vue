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
  <el-descriptions class="margin-top" direction="vertical" :column="3" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="user" />
        </el-icon>
        用户名
      </template>
      xiaoxian
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="iphone" />
        </el-icon>
        手机号
      </template>
      123456789
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="location" />
        </el-icon>
        居住地
      </template>
      上海
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions class="margin-top" direction="vertical" :column="2" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="tickets" />
        </el-icon>
        标签
      </template>
      <el-tag
        v-for="item in lists"
        :key="item.label"
        :type="item.type"
        size="small"
        effect="dark"
      >
        {{ item.label }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="office-building" />
        </el-icon>
        联系地址
      </template>
      上海市徐汇区
    </el-descriptions-item>
  </el-descriptions>
  <el-descriptions class="margin-top" direction="vertical" :column="1" border>
    <el-descriptions-item>
      <template #label>
        <el-icon>
          <IconifyIconOffline icon="notebook" />
        </el-icon>
        留言
      </template>
      好好学习，天天向上
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-tag {
  margin-right: 10px !important;
}
</style>
