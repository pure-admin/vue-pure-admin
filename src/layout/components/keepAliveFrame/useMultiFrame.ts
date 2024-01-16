import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { getConfig } from "@/config";

const MAP = new Map();
const maxCount = getConfig().KeepFrameMax;
export const useMultiFrame = () => {
  function setMap(path, Comp, tags) {
    if (MAP.size > maxCount) {
      // 第一条iframe
      const rpath = tags[0].path;
      useMultiTagsStoreHook().handleTags("splice", rpath);
      delMap(rpath);
    }
    MAP.set(path, Comp);
  }

  function getMap(path?) {
    if (path) {
      return MAP.get(path);
    }
    return [...MAP.entries()];
  }

  function delMap(path) {
    MAP.delete(path);
  }

  return {
    setMap,
    getMap,
    delMap,
    MAP
  };
};
