<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { defineProps, computed } from "vue";

const props = defineProps<{
  path?: string; // 自定义路径
  isDir?: boolean; // 是否目录
}>();

const { t } = useI18n();
const rotue = useRoute();

const title = computed(() => {
  return t(rotue.meta.title);
});

const path = computed(() => {
  return props.path || (props.isDir ? rotue.path : rotue.path + ".vue");
});
</script>

<template>
  <div>
    <p class="font-medium">
      <slot name="title">
        {{ title }}
      </slot>
    </p>

    <el-link
      class="mt-2"
      :href="`https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/${path}`"
      target="_blank"
    >
      代码位置 src/views{{ path }}
    </el-link>
  </div>
</template>
