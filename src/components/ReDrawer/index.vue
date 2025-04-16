<script setup lang="ts">
import {
  type EventType,
  type ButtonProps,
  type DrawerOptions,
  closeDrawer,
  drawerStore
} from "./index";
import { computed, ref } from "vue";
import { isFunction } from "@pureadmin/utils";

defineOptions({
  name: "ReDrawer"
});

const sureBtnMap = ref({});

const footerButtons = computed(() => {
  return (options: DrawerOptions) => {
    return options?.footerButtons?.length > 0
      ? options.footerButtons
      : ([
          {
            label: "取消",
            text: true,
            bg: true,
            btnClick: ({ drawer: { options, index } }) => {
              const done = () =>
                closeDrawer(options, index, { command: "cancel" });
              if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
                options.beforeCancel(done, { options, index });
              } else {
                done();
              }
            }
          },
          {
            label: "确定",
            type: "primary",
            text: true,
            bg: true,
            popConfirm: options?.popConfirm,
            btnClick: ({ drawer: { options, index } }) => {
              if (options?.sureBtnLoading) {
                sureBtnMap.value[index] = Object.assign(
                  {},
                  sureBtnMap.value[index],
                  {
                    loading: true
                  }
                );
              }
              const closeLoading = () => {
                if (options?.sureBtnLoading) {
                  sureBtnMap.value[index].loading = false;
                }
              };
              const done = () => {
                closeLoading();
                closeDrawer(options, index, { command: "sure" });
              };
              if (options?.beforeSure && isFunction(options?.beforeSure)) {
                options.beforeSure(done, { options, index, closeLoading });
              } else {
                done();
              }
            }
          }
        ] as Array<ButtonProps>);
  };
});

function eventsCallBack(
  event: EventType,
  options: DrawerOptions,
  index: number
) {
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]({ options, index });
  }
}

/**
 *
 * @param {DrawerOptions} options - 包含抽屉相关配置的对象
 * @param {number} index - 抽屉的索引
 * @param {Object} args - 传递给关闭抽屉操作的参数对象，默认为 { command: 'close' }
 * @returns {void} 这个函数不返回任何值
 */
function handleClose(
  options: DrawerOptions,
  index: number,
  args = { command: "close" }
) {
  closeDrawer(options, index, args);
  eventsCallBack("close", options, index);
}
</script>

<template>
  <el-drawer
    v-for="(options, index) in drawerStore"
    :key="index"
    v-bind="options"
    v-model="options.visible"
    class="pure-drawer"
    :append-to-body="!!options?.appendToBody"
    :append-to="options?.appendTo ? options.appendTo : 'body'"
    :destroy-on-close="!!options?.destroyOnClose"
    :lock-scroll="!!options?.lockScroll"
    @closed="handleClose(options, index)"
    @opened="eventsCallBack('open', options, index)"
    @open-auto-focus="eventsCallBack('openAutoFocus', options, index)"
    @close-auto-focus="eventsCallBack('closeAutoFocus', options, index)"
  >
    <!-- header  -->
    <template
      v-if="options?.headerRenderer"
      #header="{ close, titleId, titleClass }"
    >
      <component
        :is="options?.headerRenderer({ close, titleId, titleClass })"
      />
    </template>
    <!--  body  -->
    <component
      v-bind="options?.props"
      :is="options.contentRenderer({ options, index })"
      @close="args => handleClose(options, index, args)"
    />
    <!-- footer  -->
    <template v-if="!options?.hideFooter" #footer>
      <template v-if="options?.footerRenderer">
        <component :is="options?.footerRenderer({ options, index })" />
      </template>
      <span v-else>
        <template v-for="(btn, key) in footerButtons(options)" :key="key">
          <el-popconfirm
            v-if="btn.popConfirm"
            v-bind="btn.popConfirm"
            @confirm="
              btn.btnClick({
                drawer: { options, index },
                button: { btn, index: key }
              })
            "
          >
            <template #reference>
              <el-button v-bind="btn">{{ btn?.label }}</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-else
            v-bind="btn"
            :loading="key === 1 && sureBtnMap[index]?.loading"
            @click="
              btn.btnClick({
                drawer: { options, index },
                button: { btn, index: key }
              })
            "
          >
            {{ btn?.label }}
          </el-button>
        </template>
      </span>
    </template>
  </el-drawer>
</template>
