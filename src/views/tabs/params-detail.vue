<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabParamsDetail"
});

const { initToDetail, id } = useDetail();
initToDetail("params");
</script>

<template>
  <div>{{ id }} - 详情页内容在此（params传参）</div>
</template>
