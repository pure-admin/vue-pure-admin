<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { emitter } from "/@/utils/mitt";

let show = ref<Boolean>(false);
const target = ref(null);
onClickOutside(target, event => {
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
    <div ref="target" class="right-panel">
      <div class="right-panel-items">
        <div class="project-configuration">
          <h3>项目配置</h3>
          <el-icon title="关闭配置" class="el-icon-close" @click="show = !show">
            <Close />
          </el-icon>
        </div>
        <div style="border-bottom: 1px solid #dcdfe6"></div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.showright-panel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.right-panel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.right-panel {
  width: 100%;
  max-width: 300px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .right-panel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .right-panel {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  top: 45%;
  background: rgb(24, 144, 255);

  i {
    font-size: 24px;
    line-height: 48px;
  }
}

.right-panel-items {
  margin-top: 60px;
  height: 100vh;
  overflow: auto;
}

.project-configuration {
  display: flex;
  width: 100%;
  height: 30px;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  top: 15px;
  margin-left: 10px;

  i {
    font-size: 20px;
    margin-right: 20px;

    &:hover {
      cursor: pointer;
      color: red;
    }
  }
}

:deep(.el-divider--horizontal) {
  width: 90%;
  margin: 20px auto 0 auto;
}
</style>
