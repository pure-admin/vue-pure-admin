<script lang="ts" setup>
import { getConfig } from "@/config";

const TITLE = getConfig("Title");
</script>

<template>
  <footer class="layout-footer">
    MIT © 2020-PRESENT
    <a
      class="ml-1 hover:text-primary"
      href="https://github.com/pure-admin"
      target="_blank"
    >
      {{ TITLE }}
    </a>
  </footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 0 8px;
  color: #c0c4cc;
}
</style>
