import { withInstall } from "/@/utils";
import control from "./src/Control.vue";
import nodePanel from "./src/NodePanel.vue";
import dataDialog from "./src/DataDialog.vue";

/** LogicFlow流程图-控制面板 */
const Control = withInstall(control);

/** LogicFlow流程图-拖拽面板 */
const NodePanel = withInstall(nodePanel);

/** LogicFlow流程图-查看数据 */
const DataDialog = withInstall(dataDialog);

export { Control, NodePanel, DataDialog };

// LogicFlow流程图文档：http://logic-flow.org/
