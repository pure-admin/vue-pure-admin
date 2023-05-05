<script setup lang="ts">
import { ref, computed } from "vue";
import { emitter } from "@/utils/mitt";
import { onClickOutside } from "@vueuse/core";
import Close from "@iconify-icons/ep/close";

const target = ref(null);
const show = ref<Boolean>(false);

const iconClass = computed(() => {
  return [
    "mr-[20px]",
    "outline-none",
    "width-[20px]",
    "height-[20px]",
    "rounded-[4px]",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-[#0000000f]",
    "dark:hover:bg-[#ffffff1f]",
    "dark:hover:text-[#ffffffd9]"
  ];
});

onClickOutside(target, (event: any) => {
  if (event.clientX > target.value.offsetLeft) return;
  show.value = false;
});

emitter.on("openPanel", () => {
  show.value = true;
});
</script>

<template>
  <div :class="{ show: show }" class="right-panel-container">
    <div class="right-panel-background" />
    <div ref="target" class="right-panel bg-bg_color">
      <div class="right-panel-items">
        <div class="project-configuration">
          <h4 class="dark:text-white">项目配置</h4>
          <span title="关闭配置" :class="iconClass">
            <IconifyIconOffline
              class="dark:text-white"
              width="20px"
              height="20px"
              :icon="Close"
              @click="show = !show"
            />
          </span>
        </div>
        <div
          class="border-b-[1px] border-solid border-[#dcdfe6] dark:border-[#303030]"
        />
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.showright-panel {
  position: relative;
  width: calc(100% - 15px);
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
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
  max-width: 315px;
  height: 100vh;
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

.handle-button {
  position: absolute;
  top: 45%;
  left: -48px;
  z-index: 0;
  width: 48px;
  height: 48px;
  font-size: 24px;
  line-height: 48px;
  color: #fff;
  text-align: center;
  pointer-events: auto;
  cursor: pointer;
  background: rgb(24 144 255);
  border-radius: 6px 0 0 6px !important;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}

.right-panel-items {
  height: calc(100vh - 60px);
  margin-top: 60px;
  overflow-y: auto;
}

.project-configuration {
  position: fixed;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  margin-left: 10px;
}

:deep(.el-divider--horizontal) {
  width: 90%;
  margin: 20px auto 0;
}
</style>
