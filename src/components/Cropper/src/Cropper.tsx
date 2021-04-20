import type { CSSProperties } from "vue";

import {
  defineComponent,
  onBeforeMount,
  nextTick,
  ref,
  unref,
  computed,
  PropType,
} from "vue";
import { templateRef } from "@vueuse/core";
import { useAttrs } from "/@/utils/useAttrs";
import { emitter } from "/@/utils/mitt";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

type Options = Cropper.Options;

const defaultOptions: Cropper.Options = {
  aspectRatio: 16 / 9,
  zoomable: true,
  zoomOnTouch: true,
  zoomOnWheel: true,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: true,
  autoCrop: true,
  background: true,
  highlight: true,
  center: true,
  responsive: true,
  restore: true,
  checkCrossOrigin: true,
  checkOrientation: true,
  scalable: true,
  modal: true,
  guides: true,
  movable: true,
  rotatable: true,
};
export default defineComponent({
  name: "Cropper",
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
    width: {
      type: [String, Number],
      default: "",
    },
    height: {
      type: [String, Number],
      default: "360px",
    },
    crossorigin: {
      type: String || Object,
      default: undefined,
    },
    imageStyle: {
      type: Object as PropType<CSSProperties>,
      default: {},
    },
    options: {
      type: Object as PropType<Options>,
      default: {},
    },
  },
  setup(props) {
    const cropper: any = ref<Nullable<Cropper>>(null);
    const imgElRef = templateRef<HTMLElement | null>("imgElRef", null);

    const isReady = ref(false);

    const getImageStyle = computed(
      (): CSSProperties => {
        return {
          height: props.height,
          width: props.width,
          maxWidth: "100%",
          ...props.imageStyle,
        };
      }
    );

    const getWrapperStyle = computed(
      (): CSSProperties => {
        const { height, width } = props;
        return {
          width: `${width}`.replace(/px/, "") + "px",
          height: `${height}`.replace(/px/, "") + "px",
        };
      }
    );

    async function init() {
      const imgEl = unref(imgElRef);
      if (!imgEl) {
        return;
      }
      cropper.value = new Cropper(imgEl, {
        ...defaultOptions,
        ready: () => {
          isReady.value = true;
        },
        ...props.options,
      });
    }

    onBeforeMount(() => {
      nextTick(() => {
        init();
        // tsx语法返回渲染模板，外部组件想调用内部方法或者获取setup里面的实例，暂时想到的办法是通过公共事件
        emitter.emit("cropperInstance", unref(cropper));
      });
    });

    return () => (
      <>
        <div
          class={useAttrs({ excludeListeners: true, excludeKeys: ["class"] })}
          style={unref(getWrapperStyle)}
        >
          <img
            ref="imgElRef"
            src={props.src}
            alt={props.alt}
            crossorigin={props.crossorigin}
            style={unref(getImageStyle)}
          />
        </div>
      </>
    );
  },
});
