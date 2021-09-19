interface ProxyAlgorithm {
  increaseIndexes<T>(val: Array<T>): Array<T>;
}

class algorithmProxy implements ProxyAlgorithm {
  constructor() {}

  // 数组每一项添加索引字段
  public increaseIndexes<T>(val: Array<T>): Array<T> {
    return Object.keys(val)
      .map(v => {
        return {
          ...val[v],
          key: v
        };
      })
      .filter(v => v.meta && v.meta.showLink);
  }
}

export const algorithm = new algorithmProxy();
