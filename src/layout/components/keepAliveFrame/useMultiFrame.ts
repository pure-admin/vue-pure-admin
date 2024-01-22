const MAP = new Map();

export const useMultiFrame = () => {
  function setMap(path, Comp) {
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
