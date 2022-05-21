import type { CSSProperties } from "vue";
import {
  defineComponent,
  onMounted,
  nextTick,
  ref,
  unref,
  computed,
  PropType
} from "vue";
import { templateRef } from "@vueuse/core";
import { useAttrs } from "/@/utils/useAttrs";

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
  rotatable: true
};

const props = {
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String
  },
  width: {
    type: [String, Number],
    default: ""
  },
  height: {
    type: [String, Number],
    default: "360px"
  },
  crossorigin: {
    type: String || Object,
    default: undefined
  },
  imageStyle: {
    type: Object as PropType<CSSProperties>,
    default() {
      return {};
    }
  },
  options: {
    type: Object as PropType<Options>,
    default() {
      return {};
    }
  }
};

export default defineComponent({
  name: "ReCropper",
  props,
  setup(props) {
    const cropper: any = ref<Nullable<Cropper>>(null);
    const imgElRef = templateRef<HTMLImageElement | null>("imgElRef", null);

    const isReady = ref<boolean>(false);

    const getImageStyle = computed((): CSSProperties => {
      return {
        height: props.height,
        width: props.width,
        maxWidth: "100%",
        ...props.imageStyle
      };
    });

    const getWrapperStyle = computed((): CSSProperties => {
      const { height, width } = props;
      return {
        width: `${width}`.replace(/px/, "") + "px",
        height: `${height}`.replace(/px/, "") + "px"
      };
    });

    function init() {
      const imgEl = unref(imgElRef);
      if (!imgEl) {
        return;
      }
      cropper.value = new Cropper(imgEl, {
        ...defaultOptions,
        ready: () => {
          isReady.value = true;
        },
        ...props.options
      });
    }

    onMounted(() => {
      nextTick(() => {
        init();
      });
    });

    return {
      props,
      imgElRef,
      cropper,
      getWrapperStyle,
      getImageStyle
    };
  },

  render() {
    return (
      <>
        <div
          class={useAttrs({ excludeListeners: true, excludeKeys: ["class"] })}
          style={this.getWrapperStyle}
        >
          <img
            ref="imgElRef"
            src={this.props.src}
            alt={this.props.alt}
            crossorigin={this.props.crossorigin}
            style={this.getImageStyle}
          />
        </div>
      </>
    );
  }
});
