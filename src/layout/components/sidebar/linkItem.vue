<script setup lang="ts">
import { isUrl } from "@pureadmin/utils";
import { menuType } from "@/layout/types";
import { computed } from "vue";

defineOptions({
  name: "LinkItem"
});

const props = defineProps<{
  to: menuType;
}>();

const isExternalLink = computed(() => isUrl(props.to.name));
const getLinkProps = (item: menuType) => {
  if (isExternalLink.value) {
    return {
      href: item.name,
      target: "_blank",
      rel: "noopener"
    };
  }
  return {
    to: item
  };
};
</script>

<template>
  <component
    :is="isExternalLink ? 'a' : 'router-link'"
    v-bind="getLinkProps(to)"
  >
    <slot />
  </component>
</template>
