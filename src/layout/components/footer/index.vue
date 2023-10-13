<script lang="ts" setup>
import { getConfig } from "@/config";

const TITLE = getConfig("Title");
</script>

<template>
  <footer class="layout-footer">MIT © 2020-PRESENT {{ TITLE }}</footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  color: #c0c4cc;
}
</style>
