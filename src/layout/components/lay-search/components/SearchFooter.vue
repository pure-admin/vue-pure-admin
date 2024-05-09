<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useNav } from "@/layout/hooks/useNav";
import MdiKeyboardEsc from "@/assets/svg/keyboard_esc.svg?component";
import EnterOutlined from "@/assets/svg/enter_outlined.svg?component";
import ArrowUpLine from "@iconify-icons/ri/arrow-up-line";
import ArrowDownLine from "@iconify-icons/ri/arrow-down-line";

withDefaults(defineProps<{ total: number }>(), {
  total: 0
});

const { t } = useI18n();
const { device } = useNav();
</script>

<template>
  <div class="search-footer text-[#333] dark:text-white">
    <span class="search-footer-item">
      <EnterOutlined class="icon" />
      {{ t("buttons.pureConfirm") }}
    </span>
    <span class="search-footer-item">
      <IconifyIconOffline :icon="ArrowUpLine" class="icon" />
      <IconifyIconOffline :icon="ArrowDownLine" class="icon" />
      {{ t("buttons.pureSwitch") }}
    </span>
    <span class="search-footer-item">
      <MdiKeyboardEsc class="icon" />
      {{ t("buttons.pureClose") }}
    </span>
    <p v-if="device !== 'mobile' && total > 0" class="search-footer-total">
      {{ `${t("search.pureTotal")} ${total}` }}
    </p>
  </div>
</template>

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
    box-shadow:
      inset 0 -2px #cdcde6,
      inset 0 0 1px 1px #fff,
      0 1px 2px 1px #1e235a66;
  }

  .search-footer-total {
    position: absolute;
    right: 20px;
  }
}
</style>
