import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRouter, useRoute } from "vue-router";
import { onBeforeMount } from "vue";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const id = route.query?.id ? route.query?.id : route.params?.id;

  function toDetail(
    index: number | string | string[] | number[],
    model: string
  ) {
    if (model === "query") {
      // 保存信息到标签页
      useMultiTagsStoreHook().handleTags("push", {
        path: `/tabs/query-detail`,
        name: "TabQueryDetail",
        query: { id: String(index) },
        meta: {
          title: {
            zh: `No.${index} - 详情信息`,
            en: `No.${index} - DetailInfo`
          },
          // 最大打开标签数
          dynamicLevel: 3
        }
      });
      // 路由跳转
      router.push({ name: "TabQueryDetail", query: { id: String(index) } });
    } else {
      useMultiTagsStoreHook().handleTags("push", {
        path: `/tabs/params-detail/:id`,
        name: "TabParamsDetail",
        params: { id: String(index) },
        meta: {
          title: {
            zh: `No.${index} - 详情信息`,
            en: `No.${index} - DetailInfo`
          }
        }
      });
      router.push({ name: "TabParamsDetail", params: { id: String(index) } });
    }
  }

  function initToDetail(model) {
    onBeforeMount(() => {
      if (id) toDetail(id, model);
    });
  }

  return { toDetail, initToDetail, id, router };
}
