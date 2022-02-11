<template>
  <div>
    article
    <el-button @click="edit(5)">edit</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const edit = id => {
  router.push({ path: "/archive/article/edit", query: { id: id } });
};
</script>

<style scoped></style>
