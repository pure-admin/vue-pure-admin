import { reactive, toRefs, unref, nextTick, computed } from "vue";
import { storageLocal } from "/@/utils/storage";
import { useRouter } from "vue-router";
import { homeRoute } from "./type";

interface InterDynamic {
  dRoutes: object[];
  [propName: string]: any;
}

// 默认显示首页tag
let dynamic: InterDynamic = reactive({
  dRoutes: [
    {
      path: "/welcome",
      meta: {
        title: "message.hshome",
        icon: "el-icon-s-home",
        showLink: true,
        savedPosition: false,
      },
    },
  ],
});

export function useDynamicRoutesHook() {
  const router = useRouter();
  const routesLength = computed(() => {
    return storageLocal.getItem("routesInStorage")
      ? storageLocal.getItem("routesInStorage").length
      : 0;
  });
  // 返回当前路由组成的数组
  const routesStorageLists = computed(() => {
    return storageLocal.getItem("routesInStorage")
      ? storageLocal.getItem("routesInStorage")
      : [];
  });
  /**
   * @param value string 当前menu对应的路由path
   * @param parentPath string 当前路由中父级路由
   */
  const dynamicRouteTags = (
    value: string,
    parentPath: string,
    route: any
  ): void => {
    nextTick(() => {
      if (unref(routesStorageLists).length > 2) {
        dynamic.dRoutes = unref(routesStorageLists);
        return;
      }
    });

    const hasValue = dynamic.dRoutes.some((item: any) => {
      return item.path === value;
    });

    if (route) {
      let ramStorage = storageLocal.getItem("routesInStorage");
      nextTick(() => {
        if (ramStorage) {
          let currentIndex = ramStorage.findIndex((v) => v.path === route.path);
          if (currentIndex !== -1) return;
          ramStorage.push({ path: route.path, meta: route.meta });
          storageLocal.setItem("routesInStorage", ramStorage);
        }
      });
    }

    function concatPath(arr: object[], value: string, parentPath: string) {
      if (!hasValue) {
        arr.forEach((arrItem: any) => {
          let pathConcat = parentPath + "/" + arrItem.path;
          if (arrItem.path === value || pathConcat === value) {
            dynamic.dRoutes.push({ path: value, meta: arrItem.meta });

            unref(routesLength) === 0
              ? storageLocal.setItem("routesInStorage", dynamic.dRoutes)
              : [];
          } else {
            if (arrItem.children && arrItem.children.length > 0) {
              concatPath(arrItem.children, value, parentPath);
            }
          }
        });
      }
    }
    concatPath(router.options.routes, value, parentPath);
  };
  /**
   * @param value any 当前删除tag路由
   * @param current objct 当前激活路由对象
   */
  const deleteDynamicTag = async (obj: any, current: any): Promise<any> => {
    let valueIndex: number = dynamic.dRoutes.findIndex((item: any) => {
      return item.path === obj.path;
    });
    // 从当前匹配到的路径中删除
    await dynamic.dRoutes.splice(valueIndex, 1);
    storageLocal.setItem("routesInStorage", dynamic.dRoutes);
    if (current === obj.path) {
      // 如果删除当前激活tag就自动切换到最后一个tag
      let newRoute: any = dynamic.dRoutes.slice(-1);
      nextTick(() => {
        router.push({
          path: newRoute[0].path,
        });
      });
    }
  };

  return {
    ...toRefs(dynamic),
    dynamicRouteTags,
    deleteDynamicTag,
    routesLength,
    routesStorageLists,
  };
}
