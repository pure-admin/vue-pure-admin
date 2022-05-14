import { App } from "vue";
import control from "./src/Control.vue";
import nodePanel from "./src/NodePanel.vue";
import dataDialog from "./src/DataDialog.vue";

/** LogicFlow流程图-控制面板 */
const Control = Object.assign(control, {
  install(app: App) {
    app.component(control.name, control);
  }
});

/** LogicFlow流程图-拖拽面板 */
const NodePanel = Object.assign(nodePanel, {
  install(app: App) {
    app.component(nodePanel.name, nodePanel);
  }
});

/** LogicFlow流程图-查看数据 */
const DataDialog = Object.assign(dataDialog, {
  install(app: App) {
    app.component(dataDialog.name, dataDialog);
  }
});

export { Control, NodePanel, DataDialog };

// LogicFlow流程图文档：http://logic-flow.org/
