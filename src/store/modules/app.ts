import { storageLocal } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";
import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";

interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Hamburger
    isClickHamburger: boolean;
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
      if (opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = true;
        storageLocal.setItem("sidebarStatus", true);
      } else if (!opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = false;
        storageLocal.setItem("sidebarStatus", false);
      } else if (!opened && !resize) {
        this.sidebar.withoutAnimation = false;
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.isClickHamburger = !this.sidebar.opened;
        storageLocal.setItem("sidebarStatus", this.sidebar.opened);
      }
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
