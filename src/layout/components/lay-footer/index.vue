<script lang="ts" setup>
import { getConfig } from "@/config";

const TITLE = getConfig("Title");
</script>

<template>
  <footer
    class="layout-footer text-[rgba(0,0,0,0.6)] dark:text-[rgba(220,220,242,0.8)]"
  >
    Copyright © 2020-2024
    <a
      class="hover:text-primary"
      href="https://github.com/pure-admin"
      target="_blank"
    >
      &nbsp;{{ TITLE }}
    </a>
    <!-- <div class="ml-8">
      <span>赞助商：</span>
      <a
        class="hover:text-primary"
        href="https://ai-tools.cn/resume/start"
        target="_blank"
      >
        二猫 AI 简历
      </a>
    </div> -->
  </footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 0 8px;
  font-size: 14px;
}
</style>
