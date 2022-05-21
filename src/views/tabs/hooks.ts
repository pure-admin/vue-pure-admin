import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { useRouter, useRoute } from "vue-router";
import { onBeforeMount } from "vue";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const id = route.query?.id ?? -1;

  function toDetail(index: number | string | string[] | number[]) {
    useMultiTagsStoreHook().handleTags("push", {
      path: `/tabs/detail`,
      parentPath: route.matched[0].path,
      name: "TabDetail",
      query: { id: String(index) },
      meta: {
        title: { zh: `No.${index} - 详情信息`, en: `No.${index} - DetailInfo` },
        showLink: false,
        dynamicLevel: 3
      }
    });
    router.push({ name: "TabDetail", query: { id: String(index) } });
  }

  function initToDetail() {
    onBeforeMount(() => {
      if (id) toDetail(id);
    });
  }

  return { toDetail, initToDetail, id, router };
}
