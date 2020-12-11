<template>
  <div class="header" :style="{ width: flag ? spreadWidth : shrinkWidth }">
    <!-- 左侧元素 -->
    <div class="left-content">
      <div class="left-icon" @click="collapse">
        <i :class="flag ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>基础管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧元素 -->
    <div class="right-content">
      <div class="inter" :title="langs ? '中文' : '英文'" @click="toggleLang">
        <img :src="langs ? '/src/assets/ch.png' : '/src/assets/en.png'" />
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="'/favicon.ico'" />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-switch-button" @click="logout">{{
              $t("LoginOut")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang='ts'>
import { sidesEmitter } from "../sides/index.vue";
import { tagEmitter } from "../tag/index.vue";
import { ref, reactive, defineComponent, onMounted, nextTick } from "vue";
import { resizeScreen } from "../../resize";
import { storageSession } from "../../../utils/storage";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
export default defineComponent({
  setup(props, ctx) {
    let flag = ref(true);

    let router = useRouter();

    let langs = ref(true);

    let usename = storageSession.getItem("info").username;

    const { spreadWidth, shrinkWidth } = resizeScreen();

    const { locale } = useI18n();

    // 国际化语言切换
    const toggleLang = (): void => {
      langs.value = !langs.value;
      langs.value ? (locale.value = "ch") : (locale.value = "en");
    };

    // 侧边栏展开、收起
    const collapse = (): void => {
      flag.value = !flag.value;
      sidesEmitter.emit("collapse", flag.value);
      tagEmitter.emit("handletag", flag.value);
    };

    // 退出登录
    const logout = (): void => {
      storageSession.removeItem("info");
      router.push("/login");
    };

    onMounted(async () => {
      await nextTick();
      document
        .querySelector(".el-dropdown__popper")
        ?.setAttribute("class", "resetTop");
      document
        .querySelector(".el-popper__arrow")
        ?.setAttribute("class", "hidden");
    });

    return {
      flag,
      spreadWidth,
      shrinkWidth,
      usename,
      collapse,
      logout,
      langs,
      toggleLang,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index.scss";
.header {
  float: right;
  height: 48px;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  transition: 0.18s;

  .left-content {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-start;
    .left-icon {
      width: 40px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      margin-right: 5px;
      &:hover {
        background: #f6f6f6;
        cursor: pointer;
      }
      i {
        font-size: 22px;
        line-height: 48px;
      }
    }
  }

  .right-content {
    display: flex;
    .inter {
      width: 40px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      &:hover {
        cursor: pointer;
        background: #f0f0f0;
      }
      img {
        width: 25px;
      }
    }
    .el-dropdown-link {
      width: 80px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-right: 20px;
      &:hover {
        background: #f0f0f0;
      }
      img {
        width: 22px;
        height: 22px;
      }
    }
  }
}
</style>
