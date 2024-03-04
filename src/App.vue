<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import { checkVersion } from "version-rocket";
import { ElConfigProvider, ElNotification } from "element-plus";
import en from "element-plus/dist/locale/en.mjs";
import { ReDialog } from "@/components/ReDialog";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === "zh" ? zhCn : en;
    }
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
      title: "优质服务",
      duration: 0,
      dangerouslyUseHTMLString: true,
      message: `<a target='_blank' style='font-size: 16px' class='hover:text-[red]' href='https://yiming_chang.gitee.io/pure-admin-doc/pages/service/'>点击查看优质服务详情</a>
                  <br />
                <a target='_blank' style='font-size: 16px' class='hover:text-[red]' href='https://github.com/pure-admin/vue-pure-admin/issues/954'>点击查看 pure-admin 组织所有项目全面进入持续维护、持续开发状态！</a>
               `
    });
  }
});
</script>
