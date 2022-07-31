import {
  defineComponent,
  reactive,
  computed,
  watch,
  onMounted,
  unref
} from "vue";
import { countToProps } from "./props";
import { isNumber } from "@pureadmin/utils";

export default defineComponent({
  name: "ReNormalCountTo",
  props: countToProps,
  emits: ["mounted", "callback"],
  setup(props, { emit }) {
    const state = reactive<{
      localStartVal: number;
      printVal: number | null;
      displayValue: string;
      paused: boolean;
      localDuration: number | null;
      startTime: number | null;
      timestamp: number | null;
      rAF: any;
      remaining: number | null;
      color: string;
      fontSize: string;
    }>({
      localStartVal: props.startVal,
      displayValue: formatNumber(props.startVal),
      printVal: null,
      paused: false,
      localDuration: props.duration,
      startTime: null,
      timestamp: null,
      remaining: null,
      rAF: null,
      color: null,
      fontSize: "16px"
    });

    const getCountDown = computed(() => {
      return props.startVal > props.endVal;
    });

    watch([() => props.startVal, () => props.endVal], () => {
      if (props.autoplay) {
        start();
      }
    });

    function start() {
      const { startVal, duration, color, fontSize } = props;
      state.localStartVal = startVal;
      state.startTime = null;
      state.localDuration = duration;
      state.paused = false;
      state.color = color;
      state.fontSize = fontSize;
      state.rAF = requestAnimationFrame(count);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    function pauseResume() {
      if (state.paused) {
        resume();
        state.paused = false;
      } else {
        pause();
        state.paused = true;
      }
    }

    function pause() {
      cancelAnimationFrame(state.rAF);
    }

    function resume() {
      state.startTime = null;
      state.localDuration = +(state.remaining as number);
      state.localStartVal = +(state.printVal as number);
      requestAnimationFrame(count);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    function reset() {
      state.startTime = null;
      cancelAnimationFrame(state.rAF);
      state.displayValue = formatNumber(props.startVal);
    }

    function count(timestamp: number) {
      const { useEasing, easingFn, endVal } = props;
      if (!state.startTime) state.startTime = timestamp;
      state.timestamp = timestamp;
      const progress = timestamp - state.startTime;
      state.remaining = (state.localDuration as number) - progress;
      if (useEasing) {
        if (unref(getCountDown)) {
          state.printVal =
            state.localStartVal -
            easingFn(
              progress,
              0,
              state.localStartVal - endVal,
              state.localDuration as number
            );
        } else {
          state.printVal = easingFn(
            progress,
            state.localStartVal,
            endVal - state.localStartVal,
            state.localDuration as number
          );
        }
      } else {
        if (unref(getCountDown)) {
          state.printVal =
            state.localStartVal -
            (state.localStartVal - endVal) *
              (progress / (state.localDuration as number));
        } else {
          state.printVal =
            state.localStartVal +
            (endVal - state.localStartVal) *
              (progress / (state.localDuration as number));
        }
      }
      if (unref(getCountDown)) {
        state.printVal = state.printVal < endVal ? endVal : state.printVal;
      } else {
        state.printVal = state.printVal > endVal ? endVal : state.printVal;
      }
      state.displayValue = formatNumber(state.printVal);
      if (progress < (state.localDuration as number)) {
        state.rAF = requestAnimationFrame(count);
      } else {
        emit("callback");
      }
    }

    function formatNumber(num: number | string) {
      const { decimals, decimal, separator, suffix, prefix } = props;
      num = Number(num).toFixed(decimals);
      num += "";
      const x = num.split(".");
      let x1 = x[0];
      const x2 = x.length > 1 ? decimal + x[1] : "";
      const rgx = /(\d+)(\d{3})/;
      if (separator && !isNumber(separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + separator + "$2");
        }
      }
      return prefix + x1 + x2 + suffix;
    }

    onMounted(() => {
      if (props.autoplay) {
        start();
      }
      emit("mounted");
    });

    return () => (
      <>
        <span
          style={{
            color: props.color,
            fontSize: props.fontSize
          }}
        >
          {state.displayValue}
        </span>
      </>
    );
  }
});
