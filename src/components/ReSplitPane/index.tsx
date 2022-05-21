import { defineComponent, ref, unref, computed, PropType } from "vue";
import resizer from "./resizer";
import "./index.css";

export interface ContextProps {
  minPercent: number;
  defaultPercent: number;
  split: string;
}

/** 切割面板组件 */
export default defineComponent({
  name: "SplitPane",
  components: { resizer },
  props: {
    splitSet: {
      type: Object as PropType<ContextProps>,
      require: true
    }
  },
  emits: ["resize"],
  setup(props, ctx) {
    const active = ref(false);
    const hasMoved = ref(false);
    const percent = ref(props.splitSet?.defaultPercent);
    const type = props.splitSet?.split === "vertical" ? "width" : "height";
    const resizeType = props.splitSet?.split === "vertical" ? "left" : "top";

    const leftClass = ref([
      "splitter-pane splitter-paneL",
      props.splitSet?.split
    ]);

    const rightClass = ref([
      "splitter-pane splitter-paneR",
      props.splitSet?.split
    ]);

    const cursor = computed(() => {
      return active.value
        ? props.splitSet?.split === "vertical"
          ? { cursor: "col-resize" }
          : { cursor: "row-resize" }
        : { cursor: "default" };
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

    return () => (
      <>
        <div
          class="vue-splitter-container clearfix"
          style={unref(cursor)}
          onMouseup={() => onMouseUp()}
          onMousemove={() => onMouseMove(event)}
        >
          <div
            class={unref(leftClass)}
            style={{ [unref(type)]: unref(percent) + "%" }}
          >
            {ctx.slots.paneL()}
          </div>
          <resizer
            style={`${unref([resizeType])}:${unref(percent)}%`}
            split={props.splitSet?.split}
            onMousedown={() => onMouseDown()}
            onClick={() => onClick()}
          ></resizer>
          <div
            class={unref(rightClass)}
            style={{ [unref(type)]: 100 - unref(percent) + "%" }}
          >
            {ctx.slots.paneR()}
          </div>
          <div v-show={unref(active)} class="vue-splitter-container-mask"></div>
        </div>
      </>
    );
  }
});
