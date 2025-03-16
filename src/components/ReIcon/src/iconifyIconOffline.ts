import { h, defineComponent } from "vue";

// Iconify Icon在Vue里本地使用（用于内网环境）
export default defineComponent({
  name: "IconifyIconOffline",
  props: {
    icon: {
      default: null
    }
  },
  render() {
    const attrs = this.$attrs;
    return h(
      this.icon,
      {
        "aria-hidden": false,
        style: attrs?.style
          ? Object.assign(attrs.style, { outline: "none" })
          : { outline: "none" },
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
