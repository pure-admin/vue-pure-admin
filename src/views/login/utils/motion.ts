import { h, defineComponent, withDirectives, resolveDirective } from "vue";

// 封装@vueuse/motion动画库中的自定义指令v-motion
export default defineComponent({
  name: "Motion",
  props: {
    delay: {
      type: Number,
      default: 50
    }
  },
  render() {
    const { delay } = this;
    const motion = resolveDirective("motion");
    return withDirectives(
      h(
        "div",
        {},
        {
          default: () => [this.$slots.default()]
        }
      ),
      [
        [
          motion,
          {
            initial: { opacity: 0, y: 100 },
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                delay
              }
            }
          }
        ]
      ]
    );
  }
});
