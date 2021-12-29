import { store } from "/@/store";
import { appType } from "./types";
import { defineStore } from "pinia";
import { getConfig } from "/@/config";
import { storageLocal } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): appType => ({
    sidebar: {
      opened:
        storageLocal.getItem("responsive-layout")?.sidebarStatus ??
        getConfig().SidebarStatus,
      withoutAnimation: false,
      isClickHamburger: false
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
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      const layout = storageLocal.getItem("responsive-layout");
      if (opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = true;
        layout.sidebarStatus = true;
      } else if (!opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = false;
        layout.sidebarStatus = false;
      } else if (!opened && !resize) {
        this.sidebar.withoutAnimation = false;
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.isClickHamburger = !this.sidebar.opened;
        layout.sidebarStatus = this.sidebar.opened;
      }
      storageLocal.setItem("responsive-layout", layout);
    },
    TOGGLE_DEVICE(device: string) {
      this.device = device;
    },
    async toggleSideBar(opened?: boolean, resize?: string) {
      await this.TOGGLE_SIDEBAR(opened, resize);
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
