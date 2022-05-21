<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabDetail"
});

const { initToDetail, id } = useDetail();
initToDetail();
</script>

<template>
  <div>{{ id }} - 详情页内容在此</div>
</template>
