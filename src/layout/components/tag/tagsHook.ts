import { reactive, toRefs, nextTick, computed } from "vue";
import { storageLocal } from "/@/utils/storage";
import { useRouter } from "vue-router";

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
        title: "home",
        icon: "el-icon-s-home",
        showLink: true,
        savedPosition: false,
      },
    },
  ],
});

export function useDynamicRoutesHook() {
  const router = useRouter();
  /**
   * @param value string 当前menu对应的路由path
   * @param parentPath string 当前路由中父级路由
   */
  const dynamicRouteTags = (value: string, parentPath: string): void => {
    const hasValue = dynamic.dRoutes.some((item: any) => {
      return item.path === value;
    });

    function concatPath(arr: object[], value: string, parentPath: string) {
      if (!hasValue) {
        arr.forEach((arrItem: any) => {
          let pathConcat = parentPath + "/" + arrItem.path;
          if (arrItem.path === value || pathConcat === value) {
            dynamic.dRoutes.push({ path: value, meta: arrItem.meta });
          } else {
            if (arrItem.children && arrItem.children.length > 0) {
              concatPath(arrItem.children, value, parentPath);
            }
          }
        });
      }
    }
    concatPath(router.options.routes, value, parentPath);
    // if (storageLocal.getItem("routesInStorage") && storageLocal.getItem("routesInStorage").length > 2) {
    //   let lens = storageLocal.getItem("routesInStorage").length
    //   let itemss = storageLocal.getItem("routesInStorage")[lens - 1]
    //   dynamic.dRoutes.push({ path: itemss.path, meta: itemss.meta })
    // }
    storageLocal.setItem("routesInStorage", dynamic.dRoutes);
  };
  /**
   * @param value any 当前删除tag路由
   * @param current objct 当前激活路由对象
   */
  const deleteDynamicTag = async (obj: any, current: object): Promise<any> => {
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
  const routesLength = computed(() => {
    return storageLocal.getItem("routesInStorage")
      ? storageLocal.getItem("routesInStorage").length
      : 0;
  });

  return {
    ...toRefs(dynamic),
    dynamicRouteTags,
    deleteDynamicTag,
    routesLength,
  };
}
