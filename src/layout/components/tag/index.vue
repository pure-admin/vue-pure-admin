<template>
  <div class="tags-view" v-if="!showTags">
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
    <slot></slot>
  </div>
</template>

<script>
import { useDynamicRoutesHook } from "./tagsHook"
import { useRoute, useRouter } from "vue-router"
import { ref, watchEffect, onBeforeMount, unref } from "vue"
import { storageLocal } from "/@/utils/storage"
import { emitter } from "/@/utils/mitt"

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const showTags = ref(storageLocal.getItem("tagsVal") || false)

    const { deleteDynamicTag, dRoutes } = ref(useDynamicRoutesHook()).value

    function deleteMenu(item) {
      deleteDynamicTag(item, route.path)
    }

    const { dynamicRouteTags } = useDynamicRoutesHook()

    // 初始化页面刷新保证当前路由tabview存在
    let stop = watchEffect(() => {
      let parentPath = route.path.slice(0, route.path.lastIndexOf("/"))
      dynamicRouteTags(route.path, parentPath)
    })

    setTimeout(() => {
      // 监听只执行一次，但获取不到当前路由，需要下一个事件轮询中取消监听
      stop()
    })

    onBeforeMount(() => {
      emitter.on("tagViewsChange", (key) => {
        if (unref(showTags) === key) return
        showTags.value = key
      })
    })

    return {
      dynamicTagList: dRoutes,
      deleteMenu,
      showTags
    }
  },
};
</script>

<style lang="scss" scoped>
.tags-view {
  width: 100%;
  height: 34px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  .scroll-item {
    border-radius: 3px;
    padding: 2px 8px;
    display: inline-block;
  }
  a {
    text-decoration: none;
    color: #666;
    padding: 0 4px 0 4px;
  }

  .scroll-container {
    text-align: left;
    padding: 5px 0;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    background: #fff;
    border: 0.5px solid rgba($color: #ccc, $alpha: 0.3);
    .scroll-item {
      &:nth-child(1) {
        margin-left: 5px;
      }
    }
  }
}

.el-icon-close {
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.el-icon-close:hover {
  background: #b4bccc;
}
.active {
  background: #409eff;
  position: relative;
  color: #fff;
  a {
    color: #fff;
  }
}
:deep(.el-scrollbar__wrap) {
  height: 100vh;
}
</style>
