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
