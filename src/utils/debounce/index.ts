import { unref } from "vue";
import type { Ref } from "vue";

type FunctionArgs<Args extends any[] = any[], Return = void> = (
  ...args: Args
) => Return;

type MaybeRef<T> = T | Ref<T>;

// 延迟函数
export const delay = (timeout: number) =>
  new Promise(resolve => setTimeout(resolve, timeout));

/**
 * 防抖函数
 * @param fn 函数
 * @param timeout 延迟时间
 * @param immediate 是否立即执行
 * @returns
 */
export const debounce = <T extends FunctionArgs>(
  fn: T,
  timeout: MaybeRef<number> = 200,
  immediate = false
) => {
  let timmer: TimeoutHandle;
  const wait = unref(timeout);
  return () => {
    timmer && clearTimeout(timmer);
    if (immediate) {
      if (!timmer) {
        fn();
      }
      timmer = setTimeout(() => (timmer = null), wait);
    } else {
      timmer = setTimeout(fn, wait);
    }
  };
};
