<script setup lang="ts">
import {
  type DialogOptions,
  type ButtonProps,
  type EventType,
  dialogStore,
  closeDialog
} from "./index";
import { ref, computed } from "vue";
import { isFunction } from "@pureadmin/utils";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import ExitFullscreen from "@iconify-icons/ri/fullscreen-exit-fill";

const fullscreen = ref(false);

const footerButtons = computed(() => {
  return (options: DialogOptions) => {
    return options?.footerButtons?.length > 0
      ? options.footerButtons
      : ([
          {
            label: "取消",
            text: true,
            bg: true,
            btnClick: ({ dialog: { options, index } }) => {
              const done = () =>
                closeDialog(options, index, { command: "cancel" });
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
            btnClick: ({ dialog: { options, index } }) => {
              const done = () =>
                closeDialog(options, index, { command: "sure" });
              if (options?.beforeSure && isFunction(options?.beforeSure)) {
                options.beforeSure(done, { options, index });
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
  options: DialogOptions,
  index: number
) {
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]({ options, index });
  }
}

function handleClose(
  options: DialogOptions,
  index: number,
  args = { command: "close" }
) {
  closeDialog(options, index, args);
  eventsCallBack("close", options, index);
}

function onFullScreen(full) {
  if (fullscreen.value !== full) {
    fullscreen.value = full;
  } else {
    fullscreen.value = !fullscreen.value;
  }
}
</script>

<template>
  <el-dialog
    v-for="(options, index) in dialogStore"
    :key="index"
    v-bind="options"
    v-model="options.visible"
    :fullscreen="fullscreen ? true : options?.fullscreen ? true : false"
    @close="handleClose(options, index)"
    @opened="eventsCallBack('open', options, index)"
    @openAutoFocus="eventsCallBack('openAutoFocus', options, index)"
    @closeAutoFocus="eventsCallBack('closeAutoFocus', options, index)"
  >
    <!-- header -->
    <template
      v-if="options?.fullscreenIcon || options?.headerRenderer"
      #header="{ close, titleId, titleClass }"
    >
      <div
        v-if="options?.fullscreenIcon"
        class="flex items-center justify-between"
      >
        <span :id="titleId" :class="titleClass">{{ options?.title }}</span>
        <el-tooltip
          effect="dark"
          :content="fullscreen ? '还原' : '最大化'"
          placement="bottom"
        >
          <IconifyIconOffline
            :icon="
              options?.fullscreen
                ? ExitFullscreen
                : fullscreen
                ? ExitFullscreen
                : Fullscreen
            "
            class="-translate-x-5 cursor-pointer !text-[var(--el-color-info)] el-icon"
            @click="onFullScreen(options?.fullscreenIcon)"
          />
        </el-tooltip>
      </div>
      <component
        v-else
        :is="options?.headerRenderer({ close, titleId, titleClass })"
      />
    </template>
    <component
      v-bind="options?.props"
      :is="options.contentRenderer({ options, index })"
      @close="args => handleClose(options, index, args)"
    />
    <!-- footer -->
    <template v-if="!options?.hideFooter" #footer>
      <template v-if="options?.footerRenderer">
        <component :is="options?.footerRenderer({ options, index })" />
      </template>
      <span v-else>
        <el-button
          v-for="(btn, key) in footerButtons(options)"
          :key="key"
          v-bind="btn"
          @click="
            btn.btnClick({
              dialog: { options, index },
              button: { btn, index: key }
            })
          "
        >
          {{ btn?.label }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
