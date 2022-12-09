import { store } from "@/store";
import { appType } from "./types";
import { defineStore } from "pinia";
import { getConfig } from "@/config";
import { deviceDetection, storageLocal } from "@pureadmin/utils";

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): appType => ({
    sidebar: {
      opened:
        storageLocal().getItem<StorageConfigs>("responsive-layout")
          ?.sidebarStatus ?? getConfig().SidebarStatus,
      withoutAnimation: false,
      isClickCollapse: false
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    layout:
      storageLocal().getItem<StorageConfigs>("responsive-layout")?.layout ??
      getConfig().Layout,
    device: deviceDetection() ? "mobile" : "desktop",
    // 作用于 src/views/components/draggable/index.vue 页面，当离开页面并不会销毁 new Swap()，sortablejs 官网也没有提供任何销毁的 api
    sortSwap: false
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
      const layout =
        storageLocal().getItem<StorageConfigs>("responsive-layout");
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
        this.sidebar.isClickCollapse = !this.sidebar.opened;
        layout.sidebarStatus = this.sidebar.opened;
      }
      storageLocal().setItem("responsive-layout", layout);
    },
    async toggleSideBar(opened?: boolean, resize?: string) {
      await this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout) {
      this.layout = layout;
    },
    setSortSwap(val) {
      this.sortSwap = val;
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
