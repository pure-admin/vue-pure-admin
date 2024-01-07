export { default as dayjs } from "dayjs";
export { useResizeObserver } from "@vueuse/core";
export {
  useDark,
  debounce,
  cloneDeep,
  randomColor,
  randomGradient
} from "@pureadmin/utils";

export function getRandomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
