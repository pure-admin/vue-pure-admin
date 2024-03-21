<script lang="ts" setup>
import { getConfig } from "@/config";

const TITLE = getConfig("Title");
</script>

<template>
  <footer
    class="layout-footer text-[rgba(0,0,0,0.6)] dark:text-[rgba(220,220,242,0.8)]"
  >
    Copyright © 2020-present
    <a
      class="hover:text-primary"
      href="https://github.com/pure-admin"
      target="_blank"
    >
      &nbsp;{{ TITLE }}
    </a>
    <span class="ml-10">赞助商：</span>
    <a
      class="logo"
      href="https://ai-tools.cn/resume/start"
      target="_blank"
      rel="sponsored noopener"
    >
      二猫 AI 简历
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
  font-size: 14px;
}
</style>
