<script setup lang="ts">
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useNav } from "@/layout/hooks/useNav";
import Check from "@iconify-icons/ep/check";

const { getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();
</script>

<template>
  <el-dropdown-menu class="translation">
    <el-dropdown-item
      :style="getDropdownItemStyle(locale, 'zh')"
      :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
      @click="translationCh"
    >
      <IconifyIconOffline
        v-show="locale === 'zh'"
        class="check-zh"
        :icon="Check"
      />
      简体中文
    </el-dropdown-item>
    <el-dropdown-item
      :style="getDropdownItemStyle(locale, 'en')"
      :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
      @click="translationEn"
    >
      <span v-show="locale === 'en'" class="check-en">
        <IconifyIconOffline :icon="Check" />
      </span>
      English
    </el-dropdown-item>
  </el-dropdown-menu>
</template>

<style lang="scss" scoped>
.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
