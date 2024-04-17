import "./resizer.css";
import { computed, unref, defineComponent } from "vue";

export default defineComponent({
  name: "Resizer",
  props: {
    split: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const classes = computed(() => {
      return ["splitter-pane-resizer", props.split, props.className].join(" ");
    });

    return () => <div class={unref(classes)}></div>;
  }
});
