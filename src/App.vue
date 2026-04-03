<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
    <ReDrawer />
  </el-config-provider>
</template>

<script lang="ts">
import { checkVersion } from "version-rocket";
import { ElConfigProvider } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { useGlobal, useWatermark } from "@pureadmin/utils";
import { defineComponent, computed, watch, nextTick } from "vue";
import { ReDialog, closeAllDialog } from "@/components/ReDialog";
import { ReDrawer, closeAllDrawer } from "@/components/ReDrawer";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import plusEn from "plus-pro-components/es/locale/lang/en";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog,
    ReDrawer
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { setWatermark, clear } = useWatermark();
    const { $storage } = useGlobal<GlobalPropertiesApi>();
    const watermarkEnable = computed(() => $storage.configure?.watermark);
    const watermarkText = computed(() => $storage.configure?.watermarkText);
    const currentLocale = computed(() => {
      return $storage.locale?.locale === "zh"
        ? { ...zhCn, ...plusZhCn }
        : { ...en, ...plusEn };
    });

    router.beforeEach(() => {
      closeAllDialog();
      closeAllDrawer();
    });

    watch(
      [watermarkEnable, watermarkText, () => route.name],
      async ([enable, text, name]) => {
        await nextTick();
        if (enable && name !== "Login") {
          setWatermark(text, { verticalOffset: 170 });
        } else {
          clear();
        }
      },
      {
        immediate: true
      }
    );

    return {
      currentLocale
    };
  },
  beforeCreate() {
    const { version, name: title } = __APP_INFO__.pkg;
    const { VITE_PUBLIC_PATH, MODE } = import.meta.env;
    // https://github.com/guMcrey/version-rocket/blob/main/README.zh-CN.md#api
    if (MODE === "production") {
      // 版本实时更新检测，只作用于线上环境
      checkVersion(
        // config
        {
          // 5分钟检测一次版本
          pollingTime: 300000,
          localPackageVersion: version,
          originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`
        },
        // options
        {
          title,
          description: "检测到新版本",
          buttonText: "立即更新"
        }
      );
    }
  },
  mounted() {
    ElNotification({
      title: "高级服务",
      duration: 0,
      customClass: "fullpage-notification",
      // @ts-expect-error
      style: { width: "280px" },
      position: "bottom-right",
      dangerouslyUseHTMLString: true,
      message: `
        <div style="padding: 4px 0;">
          <a
            target='_blank'
            style="
              display: block;
              text-align: center;
              padding: 10px 16px;
              background: #f5f7fa;
              color: #606266;
              border: 1px solid #e4e7ed;
              border-radius: 6px;
              text-decoration: none;
              font-size: 15px;
              transition: all 0.2s ease;
            "
            onmouseover="this.style.background='#ecf5ff'; this.style.borderColor='#409eff'; this.style.color='#409eff'"
            onmouseout="this.style.background='#f5f7fa'; this.style.borderColor='#e4e7ed'; this.style.color='#606266'"
            href='https://pure-admin.cn/pages/service/#max-ts-%E7%89%88%E6%9C%AC'
          >
            Max-Ts 版本
          </a>
           <a
            target='_blank'
            style="
              display: block;
              text-align: center;
              padding: 10px 16px;
              margin-top: 10px;
              background: #f5f7fa;
              color: #606266;
              border: 1px solid #e4e7ed;
              border-radius: 6px;
              text-decoration: none;
              font-size: 15px;
              transition: all 0.2s ease;
            "
            onmouseover="this.style.background='#ecf5ff'; this.style.borderColor='#409eff'; this.style.color='#409eff'"
            onmouseout="this.style.background='#f5f7fa'; this.style.borderColor='#e4e7ed'; this.style.color='#606266'"
            href='https://pure-admin.cn/pages/service/#max-js-%E7%89%88%E6%9C%AC'
          >
            Max-Js 版本
          </a>
        </div>
      `
    });
  }
});
</script>

<style>
.fullpage-notification > .el-notification__group > .el-notification__closeBtn {
  top: 15px;
}
.fullpage-notification > div > h2 {
  color: red;
  font-size: 18px;
}
</style>
