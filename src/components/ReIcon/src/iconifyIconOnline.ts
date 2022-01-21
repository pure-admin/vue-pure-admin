import { h, defineComponent } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";

// Iconify Icon在Vue里在线使用（用于外网环境）
// https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIcon",
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "ep:"
    }
  },
  render() {
    return h(
      IconifyIcon,
      {
        icon: `${this.type}${this.icon}`
      },
      {
        default: () => []
      }
    );
  }
});
