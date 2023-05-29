<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabParamsDetail"
});

const { initToDetail, getParameter } = useDetail();
initToDetail("params");
</script>

<template>
  <div>
    {{ getParameter.id }} - 详情页内容在此（params传参）
    <p>当前页面参数为：{{ getParameter }}</p>
  </div>
</template>
