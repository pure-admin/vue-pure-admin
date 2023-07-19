import { ElCol } from "element-plus";
import { h, defineComponent } from "vue";

// 封装element-plus的el-col组件
export default defineComponent({
  name: "ReCol",
  props: {
    value: {
      type: Number,
      default: 24
    }
  },
  render() {
    const attrs = this.$attrs;
    const val = this.value;
    return h(
      ElCol,
      {
        xs: val,
        sm: val,
        md: val,
        lg: val,
        xl: val,
        ...attrs
      },
      { default: () => this.$slots.default() }
    );
  }
});
