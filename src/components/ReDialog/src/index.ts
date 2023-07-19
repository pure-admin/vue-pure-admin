import { ref } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import type { DialogOptions } from "./type";

const dialogStore = ref<Array<DialogOptions>>([]);

/** 打开弹框 */
const addDialog = (options: DialogOptions) => {
  const open = () =>
    dialogStore.value.push(Object.assign(options, { visible: true }));
  if (options?.openDelay) {
    useTimeoutFn(() => {
      open();
    }, options.openDelay);
  } else {
    open();
  }
};

/** 关闭弹框 */
const closeDialog = (options: DialogOptions, index: number, args?: any) => {
  dialogStore.value.splice(index, 1);
  options.closeCallBack && options.closeCallBack({ options, index, args });
};

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认`title`
 * @param index 弹框索引（默认`0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给`index`）
 */
const updateDialog = (value: any, key = "title", index = 0) => {
  dialogStore.value[index][key] = value;
};

/** 关闭所有弹框 */
const closeAllDialog = () => {
  dialogStore.value = [];
};

export { dialogStore, addDialog, closeDialog, updateDialog, closeAllDialog };
