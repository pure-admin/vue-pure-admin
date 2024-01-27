<script setup lang="ts">
import { emitter } from "@/utils/mitt";
import { onClickOutside } from "@vueuse/core";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import Close from "@iconify-icons/ep/close";

const target = ref(null);
const show = ref<Boolean>(false);

const iconClass = computed(() => {
  return [
    "w-[22px]",
    "h-[22px]",
    "flex",
    "justify-center",
    "items-center",
    "outline-none",
    "rounded-[4px]",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-[#0000000f]",
    "dark:hover:bg-[#ffffff1f]",
    "dark:hover:text-[#ffffffd9]"
  ];
});

const { onReset } = useDataThemeChange();

onClickOutside(target, (event: any) => {
  if (event.clientX > target.value.offsetLeft) return;
  show.value = false;
});

onMounted(() => {
  emitter.on("openPanel", () => {
    show.value = true;
  });
});

onBeforeUnmount(() => {
  // 解绑`openPanel`公共事件，防止多次触发
  emitter.off("openPanel");
});
</script>

<template>
  <div :class="{ show }">
    <div class="right-panel-background" />
    <div ref="target" class="right-panel bg-bg_color">
      <div
        class="project-configuration border-b-[1px] border-solid border-[var(--pure-border-color)]"
      >
        <h4 class="dark:text-white">项目配置</h4>
        <span
          v-tippy="{
            content: '关闭配置',
            placement: 'bottom-start',
            zIndex: 41000
          }"
          :class="iconClass"
        >
          <IconifyIconOffline
            class="dark:text-white"
            width="18px"
            height="18px"
            :icon="Close"
            @click="show = !show"
          />
        </span>
      </div>
      <el-scrollbar>
        <slot />
      </el-scrollbar>

      <div
        class="flex justify-end p-3 border-t-[1px] border-solid border-[var(--pure-border-color)]"
      >
        <el-button
          v-tippy="{
            content: '清空缓存并返回登录页',
            placement: 'left-start',
            zIndex: 41000
          }"
          type="danger"
          text
          bg
          @click="onReset"
        >
          清空缓存
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar) {
  height: calc(100vh - 110px);
}

.right-panel-background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background: rgb(0 0 0 / 20%);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.right-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 40000;
  width: 100%;
  max-width: 280px;
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .right-panel-background {
    z-index: 20000;
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  .right-panel {
    transform: translate(0);
  }
}

.project-configuration {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
}
</style>
