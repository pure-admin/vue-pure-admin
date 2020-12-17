<template>
  <div ref="right-panel" :class="{ show: show }" class="right-panel-container">
    <div class="right-panel-background" />
    <div class="right-panel">
      <div
        class="handle-button"
        :title="show ? '关闭设置' : '打开设置'"
        @click="show = !show"
      >
        <i :class="show ? 'el-icon-close' : 'el-icon-setting'" />
      </div>
      <div class="right-panel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { addClass, removeClass } from "../../../utils/operate";
import { ref, watch, getCurrentInstance, onMounted, onBeforeMount } from "vue";
export default {
  name: "panel",
  setup() {
    let vm: any;

    let show = ref(false);

    watch(
      show,
      (val, prevVal) => {
        val ? addEventClick() : () => {};
        if (val) {
          addClass(document.body, "showright-panel");
        } else {
          removeClass(document.body, "showright-panel");
        }
      },
      { immediate: true }
    );

    const addEventClick = (): void => {
      window.addEventListener("click", closeSidebar);
    };

    const closeSidebar = (evt: any): void => {
      const parent = evt.target.closest(".right-panel");
      if (!parent) {
        show.value = false;
        window.removeEventListener("click", closeSidebar);
      }
    };

    onBeforeMount(() => {
      vm = getCurrentInstance();
    });

    return {
      show,
    };
  },
};
</script>

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
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
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
</style>
