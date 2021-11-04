import { storageLocal } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";
import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";

interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  layout: string;
  device: string;
}

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): AppState => ({
    sidebar: {
      opened: storageLocal.getItem("sidebarStatus")
        ? !!+storageLocal.getItem("sidebarStatus")
        : true,
      withoutAnimation: false
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    layout:
      storageLocal.getItem("responsive-layout")?.layout ?? getConfig().Layout,
    device: deviceDetection() ? "mobile" : "desktop"
  }),
  getters: {
    getSidebarStatus() {
      return this.sidebar.opened;
    },
    getDevice() {
      return this.device;
    }
  },
  actions: {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
      if (this.sidebar.opened) {
        storageLocal.setItem("sidebarStatus", 1);
      } else {
        storageLocal.setItem("sidebarStatus", 0);
      }
    },
    CLOSE_SIDEBAR(withoutAnimation: boolean) {
      storageLocal.setItem("sidebarStatus", 0);
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE(device: string) {
      this.device = device;
    },
    async toggleSideBar() {
      await this.TOGGLE_SIDEBAR();
    },
    closeSideBar(withoutAnimation) {
      this.CLOSE_SIDEBAR(withoutAnimation);
    },
    toggleDevice(device) {
      this.TOGGLE_DEVICE(device);
    },
    setLayout(layout) {
      this.layout = layout;
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
