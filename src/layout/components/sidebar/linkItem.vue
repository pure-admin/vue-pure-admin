<script setup lang="ts">
import { isUrl } from "@pureadmin/utils";
import { menuType } from "@/layout/types";

defineOptions({
  name: "LinkItem"
});

const props = defineProps<{
  to: menuType;
}>();

const isExternalLink = isUrl(props.to.name as string);

const getLinkProps = (item: menuType) => {
  if (isExternalLink) {
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
