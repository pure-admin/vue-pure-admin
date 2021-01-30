<template>
  <div :class="classes"></div>
</template>

<script lang='ts'>
import { computed, defineComponent } from "vue";
export default defineComponent({
  name: "resizer",
  props: {
    split: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    let classes = computed(() => {
      return ["splitter-pane-resizer", props.split, props.className].join(" ");
    });
    return {
      classes,
    };
  },
});
</script>

<style scoped>
.splitter-pane-resizer {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #000;
  position: absolute;
  opacity: 0.2;
  z-index: 1;
  -moz-background-clip: padding;
  -webkit-background-clip: padding;
  background-clip: padding-box;
}
.splitter-pane-resizer.horizontal {
  height: 11px;
  margin: -5px 0;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  cursor: row-resize;
  width: 100%;
}
.splitter-pane-resizer.vertical {
  width: 11px;
  height: 100%;
  margin-left: -5px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;
}
</style>
