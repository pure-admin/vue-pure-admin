import { PropType } from "vue";
import propTypes from "@/utils/propTypes";
export const reboundProps = {
  delay: propTypes.number.def(1),
  blur: propTypes.number.def(2),
  i: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    validator(value: number) {
      return value < 10 && value >= 0 && Number.isInteger(value);
    }
  }
};
