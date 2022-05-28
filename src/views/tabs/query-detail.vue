<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabQueryDetail"
});

const { initToDetail, id } = useDetail();
initToDetail("query");
</script>

<template>
  <div>{{ id }} - 详情页内容在此（query传参）</div>
</template>
