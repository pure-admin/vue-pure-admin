import { Directive } from "vue";
import type { DirectiveBinding, VNode } from "vue";
import elementResizeDetectorMaker from "element-resize-detector";
import type { Erd } from "element-resize-detector";
import { emitter } from "/@/utils/mitt";

const erd: Erd = elementResizeDetectorMaker({
  strategy: "scroll"
});

export const resize: Directive = {
  mounted(el: HTMLElement, binding?: DirectiveBinding, vnode?: VNode) {
    erd.listenTo(el, elem => {
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;
      if (binding?.instance) {
        emitter.emit("resize", { detail: { width, height } });
      } else {
        vnode.el.dispatchEvent(
          new CustomEvent("resize", { detail: { width, height } })
        );
      }
    });
  },
  unmounted(el: HTMLElement) {
    erd.uninstall(el);
  }
};
