<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabQueryDetail"
});

const { initToDetail, getParameter } = useDetail();
initToDetail("query");
</script>

<template>
  <div>
    {{ getParameter.id }} - 详情页内容在此（query传参）
    <p>当前页面参数为：{{ getParameter }}</p>
  </div>
</template>
