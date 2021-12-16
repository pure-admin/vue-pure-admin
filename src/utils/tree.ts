/**
 * 提取菜单树中的每一项path
 * @param {Object} {menuTree 菜单树}
 * @param {return}} expandedPaths 每一项path组成的数组
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
    expandedPaths.push(node.path);
  }
  return expandedPaths;
}

/**
 * 如果父级下children的length为1，删除children
 * @param {Object} {menuTree 菜单树}
 * @param {return}}
 */
export function deleteChildren(menuTree) {
  if (!Array.isArray(menuTree)) {
    console.warn("menuTree must be an array");
    return;
  }
  if (!menuTree || menuTree.length === 0) return;
  for (const node of menuTree) {
    if (node.children && node.children.length === 1) delete node.children;
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      deleteChildren(node.children);
    }
  }
  return menuTree;
}
