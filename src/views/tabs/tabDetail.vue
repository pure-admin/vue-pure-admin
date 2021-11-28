<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const index = route.params?.id ?? -1;
</script>

<template>
  <div>{{ index }} - 详情页内容在此</div>
</template>

<style lang="scss" scoped></style>
