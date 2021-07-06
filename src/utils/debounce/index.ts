// 延迟函数
export const delay = (timeout: number) =>
  new Promise(resolve => setTimeout(resolve, timeout));

// 防抖函数
export const debounce = (fn: () => Fn, timeout: number) => {
  let timmer: TimeoutHandle;
  return () => {
    timmer ? clearTimeout(timmer) : null;
    timmer = setTimeout(fn, timeout);
  };
};
