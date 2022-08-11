import "./rebound.css";
import {
  defineComponent,
  ref,
  unref,
  onBeforeMount,
  onBeforeUnmount
} from "vue";
import { reboundProps } from "./props";

export default defineComponent({
  name: "ReboundCountTo",
  props: reboundProps,
  setup(props) {
    const ulRef = ref();
    const timer = ref(null);

    onBeforeMount(() => {
      const ua = navigator.userAgent.toLowerCase();
      const testUA = regexp => regexp.test(ua);
      const isSafari = testUA(/safari/g) && !testUA(/chrome/g);

      // Safari浏览器的兼容代码
      isSafari &&
        (timer.value = setTimeout(() => {
          ulRef.value.setAttribute(
            "style",
            `
        animation: none;
        transform: translateY(calc(var(--i) * -9.09%))
      `
          );
        }, props.delay * 1000));
    });

    onBeforeUnmount(() => {
      clearTimeout(unref(timer));
    });

    return () => (
      <>
        <div
          class="scroll-num"
          style={{ "--i": props.i, "--delay": props.delay }}
        >
          <ul ref="ulRef" style={{ fontSize: "32px" }}>
            <li>0</li>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
            <li>8</li>
            <li>9</li>
            <li>0</li>
          </ul>

          <svg width="0" height="0">
            <filter id="blur">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={`0 ${props.blur}`}
              />
            </filter>
          </svg>
        </div>
      </>
    );
  }
});
