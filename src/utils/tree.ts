/**
 * 提取菜单树中的每一项uniqueId
 * @param {Array} {menuTree 菜单树}
 * @param {return}} expandedPaths 每一项uniqueId组成的数组
 */
const expandedPaths = [];
export function extractPathList(menuTree) {
  if (!Array.isArray(menuTree)) {
    console.warn("menuTree must be an array");
    return;
  }
  if (!menuTree || menuTree.length === 0) return;
  for (const node of menuTree) {
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      extractPathList(node.children);
    }
    expandedPaths.push(node.uniqueId);
  }
  return expandedPaths;
}

/**
 * 如果父级下children的length为1，删除children并自动组建唯一uniqueId
 * @param {Array} {menuTree 菜单树}
 * @param {Array} {pathList 每一项的id组成的数组}
 * @param {return}}
 */
export function deleteChildren(menuTree, pathList = []) {
  if (!Array.isArray(menuTree)) {
    console.warn("menuTree must be an array");
    return;
  }
  if (!menuTree || menuTree.length === 0) return;
  for (const [key, node] of menuTree.entries()) {
    if (node.children && node.children.length === 1) delete node.children;
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    node.uniqueId =
      node.pathList.length > 1 ? node.pathList.join("-") : node.pathList[0];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      deleteChildren(node.children, node.pathList);
    }
  }
  return menuTree;
}

// 创建层级关系
export function buildHierarchyTree(menuTree, pathList = []) {
  if (!Array.isArray(menuTree)) {
    console.warn("menuTree must be an array");
    return;
  }
  if (!menuTree || menuTree.length === 0) return;
  for (const [key, node] of menuTree.entries()) {
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      buildHierarchyTree(node.children, node.pathList);
    }
  }
  return menuTree;
}

/**
 * 广度优先遍历算法，找当前节点
 * @param {Array} tree 原始树，数组
 * @param {Number|String} uniqueId 唯一uniqueId
 * @return {Object} node
 */
export function getNodeByUniqueId(menuTree, uniqueId) {
  if (!Array.isArray(menuTree)) {
    console.warn("menuTree must be an array");
    return;
  }
  if (!menuTree || menuTree.length === 0) return;
  const item = menuTree.find(node => node.uniqueId === uniqueId);
  if (item) return item;
  const childrenList = menuTree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1);
  return getNodeByUniqueId(childrenList, uniqueId);
}

/**
 * 向当前唯一uniqueId节点追加字段
 * @param {Array} {menuTree 菜单树}
 * @param {Number|String} uniqueId 唯一uniqueId
 * @param {Object} fields 唯一uniqueId
 * @return {menuTree} 追加字段后的树
 */
export function appendFieldByUniqueId(
  menuTree: Array<any>,
  uniqueId: Number | String,
  fields: Object
) {
  if (!Array.isArray(menuTree)) {
    console.warn("menuTree must be an array");
    return;
  }
  if (!menuTree || menuTree.length === 0) return {};
  for (const node of menuTree) {
    const hasChildren = node.children && node.children.length > 0;
    if (
      node.uniqueId === uniqueId &&
      Object.prototype.toString.call(fields) === "[object Object]"
    )
      Object.assign(node, fields);
    if (hasChildren) {
      appendFieldByUniqueId(node.children, uniqueId, fields);
    }
  }
  return menuTree;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(
  data,
  id?: string,
  parentId?: string,
  children?: string
) {
  const config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children"
  };

  const childrenListMap = {};
  const nodeIds = {};
  const tree = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}
