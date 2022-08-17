import type { FormInstance, FormItemProp } from "element-plus";
import { cloneDeep } from "lodash-unified";
import { ref } from "vue";

const isDisabled = ref(false);
const timer = ref(null);
const text = ref("");

export const useVerifyCode = () => {
  const start = async (
    formEl: FormInstance | undefined,
    props: FormItemProp,
    time = 60
  ) => {
    if (!formEl) return;
    const initTime = cloneDeep(time);
    await formEl.validateField(props, isValid => {
      if (isValid) {
        clearInterval(timer.value);
        timer.value = setInterval(() => {
          if (time > 0) {
            text.value = `${time}`;
            isDisabled.value = true;
            time -= 1;
          } else {
            text.value = "";
            isDisabled.value = false;
            clearInterval(timer.value);
            time = initTime;
          }
        }, 1000);
      }
    });
  };

  const end = () => {
    text.value = "";
    isDisabled.value = false;
    clearInterval(timer.value);
  };

  return {
    isDisabled,
    timer,
    text,
    start,
    end
  };
};
