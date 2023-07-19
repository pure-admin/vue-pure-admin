import { h, defineComponent } from "vue";
import TypeIt from "typeit";

// 打字机效果组件（只是简单的封装下，更多配置项参考 https://www.typeitjs.com/docs/vanilla/usage#options）
export default defineComponent({
  name: "TypeIt",
  props: {
    /** 打字速度，以每一步之间的毫秒数为单位，默认`200` */
    speed: {
      type: Number,
      default: 200
    },
    values: {
      type: Array,
      defalut: []
    },
    className: {
      type: String,
      default: "type-it"
    },
    cursor: {
      type: Boolean,
      default: true
    }
  },
  render() {
    return h(
      "span",
      {
        class: this.className
      },
      {
        default: () => []
      }
    );
  },
  mounted() {
    new TypeIt(`.${this.className}`, {
      strings: this.values,
      speed: this.speed,
      cursor: this.cursor
    }).go();
  }
});
