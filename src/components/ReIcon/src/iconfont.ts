import { h, defineComponent } from "vue";

// 封装iconfont组件，默认`font-class`引用模式，支持`unicode`引用、`font-class`引用、`symbol`引用 （https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.20&helptype=code）
export default defineComponent({
  name: "fontIcon",
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    const attrs = this.$attrs;
    if (Object.keys(attrs).includes("uni") || attrs?.iconType === "uni") {
      return h(
        "i",
        {
          class: "iconfont",
          ...attrs
        },
        this.icon
      );
    } else if (
      Object.keys(attrs).includes("svg") ||
      attrs?.iconType === "svg"
    ) {
      return h(
        "svg",
        {
          class: "icon-svg",
          "aria-hidden": true
        },
        {
          default: () => [
            h("use", {
              "xlink:href": `#${this.icon}`
            })
          ]
        }
      );
    } else {
      return h("i", {
        class: `iconfont ${this.icon}`,
        ...attrs
      });
    }
  }
});
