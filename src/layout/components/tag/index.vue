<template>
  <div class="tags-view">
    <el-scrollbar :vertical="false" class="scroll-container">
      <div
        v-for="(item, index) in dynamicTagList"
        :key="index"
        :class="['scroll-item', $route.path === item.path ? 'active' : '']"
      >
        <router-link :to="item.path">{{ $t(item.meta.title) }}</router-link>
        <span v-if="index !== 0 " class="el-icon-close" @click="deleteMenu(item)"></span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { useDynamicRoutesHook } from "./tagsHook";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";
export default {
  setup() {
    const route = useRoute();
    const { deleteDynamicTag, dRoutes } = ref(useDynamicRoutesHook()).value;

    function deleteMenu(item) {
      deleteDynamicTag(item, route.path);
    }

    const { dynamicRouteTags } = useDynamicRoutesHook();

    // 初始化页面刷新保证当前路由tabview存在
    let stop = watchEffect(() => {
      let parentPath = route.path.slice(0, route.path.lastIndexOf("/"));
      dynamicRouteTags(route.path, parentPath);
    });

    setTimeout(() => {
      // 监听只执行一次，但获取不到当前路由，需要下一个事件轮询中取消监听
      stop();
    });

    return {
      dynamicTagList: dRoutes,
      deleteMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
.tags-view {
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .scroll-item {
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 2px 8px;
    display: inline-block;
    margin-right: 2px;
  }
  a {
    text-decoration: none;
    color: #666;
    padding: 0 10px;
  }
}
.el-icon-close {
  cursor: pointer;
  border-radius: 50%;
  padding: 1px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.el-icon-close:hover {
  background: #b4bccc;
}
.scroll-container {
  text-align: left;
  padding: 5px 0;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
  :deep(.el-scrollbar__wrap::-webkit-scrollbar) {
    display: none;
  }
}
.active {
  background: #409EFF;
  position: relative;
  color: #fff;
  a {
    color: #fff;
  }
}
.active::before {
  content: "";
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 5px;
  margin-top: -4px;
  margin-right: 2px;
}
</style>
