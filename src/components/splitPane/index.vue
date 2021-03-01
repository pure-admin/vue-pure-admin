<template>
  <div
    :style="{ cursor, userSelect }"
    class="vue-splitter-container clearfix"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >
    <div
      :class="leftClass"
      :split="splitSet.split"
      :style="{ [type]: percent + '%' }"
    >
      <slot name="paneL"></slot>
    </div>

    <resizer
      :style="{ [resizeType]: percent + '%' }"
      :split="splitSet.split"
      @mousedown.prevent="onMouseDown"
      @click.prevent="onClick"
    ></resizer>

    <div
      :class="rightClass"
      :split="splitSet.split"
      :style="{ [type]: 100 - percent + '%' }"
    >
      <slot name="paneR"></slot>
    </div>

    <div v-if="active" class="vue-splitter-container-mask"></div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  ref,
  getCurrentInstance,
  computed,
  watch,
  PropType,
  onBeforeMount,
} from "vue";
import resizer from "./resizer.vue";

export interface ContextProps {
  minPercent: number;
  defaultPercent: number;
  split: string;
}

export default defineComponent({
  name: "splitPane",
  components: { resizer },
  props: {
    splitSet: {
      type: Object as PropType<ContextProps>,
      require: true,
    },
  },
  emits: ["resize"],
  setup(props, ctx) {
    let active = ref(false);
    let hasMoved = ref(false);
    let height = ref(null);
    let percent = ref(props.splitSet?.defaultPercent);
    let type = props.splitSet?.split === "vertical" ? "width" : "height";
    let resizeType = props.splitSet?.split === "vertical" ? "left" : "top";

    let leftClass = ref([
      "splitter-pane splitter-paneL",
      props.splitSet?.split,
    ]);

    let rightClass = ref([
      "splitter-pane splitter-paneR",
      props.splitSet?.split,
    ]);

    const userSelect = computed(() => {
      return active.value ? "none" : "";
    });

    const cursor = computed(() => {
      return active.value
        ? props.splitSet?.split === "vertical"
          ? "col-resize"
          : "row-resize"
        : "";
    });

    const onClick = (): void => {
      if (!hasMoved.value) {
        percent.value = 50;
        ctx.emit("resize", percent.value);
      }
    };

    const onMouseDown = (): void => {
      active.value = true;
      hasMoved.value = false;
    };

    const onMouseUp = (): void => {
      active.value = false;
    };

    const onMouseMove = (e: any): void => {
      if (e.buttons === 0 || e.which === 0) {
        active.value = false;
      }

      if (active.value) {
        let offset = 0;
        let target = e.currentTarget;
        if (props.splitSet?.split === "vertical") {
          while (target) {
            offset += target.offsetLeft;
            target = target.offsetParent;
          }
        } else {
          while (target) {
            offset += target.offsetTop;
            target = target.offsetParent;
          }
        }

        const currentPage =
          props.splitSet?.split === "vertical" ? e.pageX : e.pageY;
        const targetOffset =
          props.splitSet?.split === "vertical"
            ? e.currentTarget.offsetWidth
            : e.currentTarget.offsetHeight;
        const percents =
          Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100;

        if (
          percents > props.splitSet?.minPercent &&
          percents < 100 - props.splitSet?.minPercent
        ) {
          percent.value = percents;
        }

        ctx.emit("resize", percent.value);

        hasMoved.value = true;
      }
    };

    return {
      userSelect,
      cursor,
      active,
      hasMoved,
      height,
      percent,
      type,
      resizeType,
      onClick,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      leftClass: leftClass.value.join(" "),
      rightClass: rightClass.value.join(" "),
    };
  },
});
</script>

<style scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.vue-splitter-container {
  height: 100%;
  position: relative;
}
.vue-splitter-container-mask {
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.splitter-pane.vertical.splitter-paneL {
  position: absolute;
  left: 0px;
  height: 100%;
  padding-right: 3px;
}
.splitter-pane.vertical.splitter-paneR {
  position: absolute;
  right: 0px;
  height: 100%;
  padding-left: 3px;
}
.splitter-pane.horizontal.splitter-paneL {
  position: absolute;
  top: 0px;
  width: 100%;
}
.splitter-pane.horizontal.splitter-paneR {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding-top: 3px;
}
</style>
