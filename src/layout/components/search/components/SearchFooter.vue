<template>
  <div class="search-footer text-[#333] dark:text-white">
    <span class="search-footer-item">
      <enterOutlined class="icon" />
      确认
    </span>
    <span class="search-footer-item">
      <IconifyIconOffline :icon="ArrowUpLine" class="icon" />
      <IconifyIconOffline :icon="ArrowDownLine" class="icon" />
      切换
    </span>
    <span class="search-footer-item">
      <mdiKeyboardEsc class="icon" />
      关闭
    </span>
  </div>
</template>

<script setup lang="ts">
import ArrowUpLine from "@iconify-icons/ri/arrow-up-line";
import ArrowDownLine from "@iconify-icons/ri/arrow-down-line";
import mdiKeyboardEsc from "@/assets/svg/keyboard_esc.svg?component";
import enterOutlined from "@/assets/svg/enter_outlined.svg?component";
</script>

<style lang="scss" scoped>
.search-footer {
  display: flex;

  .search-footer-item {
    display: flex;
    align-items: center;
    margin-right: 14px;
  }

  .icon {
    padding: 2px;
    margin-right: 3px;
    font-size: 20px;
    box-shadow: inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff,
      0 1px 2px 1px #1e235a66;
  }
}
</style>
