<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { computed, defineComponent, unref } from "vue";
import { isUrl } from "/@/utils/is.ts";

export default defineComponent({
  name: "Link",
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isExternal = computed(() => {
      return isUrl(props.to);
    });

    const type = computed(() => {
      if (unref(isExternal)) {
        return "a";
      }
      return "router-link";
    });

    function linkProps(to) {
      if (unref(isExternal)) {
        return {
          href: to,
          target: "_blank",
          rel: "noopener"
        };
      }
      return {
        to: to
      };
    }

    return {
      isExternal,
      type,
      linkProps
    };
  }
});
</script>
