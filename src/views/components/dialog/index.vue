<script setup lang="tsx">
import { h, createVNode } from "vue";
import { message } from "@/utils/message";
import { addDialog, closeDialog, closeAllDialog } from "@/components/ReDialog";

defineOptions({
  name: "Dialog"
});

function onBaseClick() {
  addDialog({
    title: "基本使用",
    contentRenderer: () => <p>弹框内容-基本使用</p> // jsx 语法 （注意在.vue文件启用jsx语法，需要在script开启lang="tsx"）
  });
}

function onDraggableClick() {
  addDialog({
    title: "可拖拽",
    draggable: true,
    contentRenderer: () => h("p", "弹框内容-可拖拽") // h 渲染函数 https://cn.vuejs.org/api/render-function.html#h
  });
}

function onFullscreenClick() {
  addDialog({
    title: "全屏",
    fullscreen: true,
    contentRenderer: () => createVNode("p", null, "弹框内容-全屏") // createVNode 渲染函数 https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes
  });
}

function onModalClick() {
  addDialog({
    title: "无背景遮罩层",
    modal: false,
    contentRenderer: () => <p>弹框内容-无背景遮罩层</p>
  });
}

function onStyleClick() {
  addDialog({
    title: "自定义弹出位置",
    top: "60vh",
    style: { marginRight: "20px" },
    contentRenderer: () => <p>弹框内容-自定义弹出位置</p>
  });
}

function onoOpenDelayClick() {
  addDialog({
    title: "延时2秒打开弹框",
    openDelay: 2000,
    contentRenderer: () => <p>弹框内容-延时2秒打开弹框</p>
  });
}

function onCloseDelayClick() {
  addDialog({
    title: "延时2秒关闭弹框",
    closeDelay: 2000,
    contentRenderer: () => <p>弹框内容-延时2秒关闭弹框</p>
  });
}

function onShowCloseClick() {
  addDialog({
    title: "不显示右上角关闭按钮图标",
    showClose: false,
    contentRenderer: () => <p>弹框内容-不显示右上角关闭按钮图标</p>
  });
}

function onBeforeCloseClick() {
  addDialog({
    title: "禁止通过键盘ESC关闭",
    closeOnPressEscape: false,
    contentRenderer: () => <p>弹框内容-禁止通过键盘ESC关闭</p>
  });
}

function onCloseOnClickModalClick() {
  addDialog({
    title: "禁止通过点击modal关闭",
    closeOnClickModal: false,
    contentRenderer: () => <p>弹框内容-禁止通过点击modal关闭</p>
  });
}

function onHideFooterClick() {
  addDialog({
    title: "隐藏底部取消、确定按钮",
    hideFooter: true,
    contentRenderer: () => <p>弹框内容-隐藏底部取消、确定按钮</p>
  });
}

function onHeaderRendererClick() {
  addDialog({
    title: "自定义头部",
    showClose: false,
    headerRenderer: ({ close, titleId, titleClass }) => (
      // jsx 语法
      <div class="flex flex-row justify-between">
        <h4 id={titleId} class={titleClass}>
          自定义头部
        </h4>
        <el-button type="danger" onClick={close}>
          关闭
        </el-button>
      </div>
    ),
    contentRenderer: () => <p>弹框内容-自定义头部</p>
  });
}

function onFooterRendererClick() {
  addDialog({
    title: "自定义底部",
    footerRenderer: ({ options, index }) => (
      <el-button onClick={() => closeDialog(options, index)}>
        {options.title}-{index}
      </el-button>
    ),
    contentRenderer: () => <p>弹框内容-自定义底部</p>
  });
}

function onFooterButtonsClick() {
  addDialog({
    title: "自定义底部按钮",
    footerButtons: [
      {
        label: "按钮1",
        size: "small",
        type: "success",
        btnClick: ({ dialog: { options, index }, button }) => {
          console.log(options, index, button);
          closeDialog(options, index);
        }
      },
      {
        label: "按钮2",
        text: true,
        bg: true,
        btnClick: ({ dialog: { options, index }, button }) => {
          console.log(options, index, button);
          closeDialog(options, index);
        }
      },
      {
        label: "按钮3",
        size: "large",
        type: "warning",
        btnClick: ({ dialog: { options, index }, button }) => {
          console.log(options, index, button);
          closeDialog(options, index);
        }
      }
    ],
    contentRenderer: () => <p>弹框内容-自定义底部按钮</p>
  });
}

function onOpenClick() {
  addDialog({
    title: "打开后的回调",
    open: ({ options, index }) => message({ options, index } as any),
    contentRenderer: () => <p>弹框内容-打开后的回调</p>
  });
}

function onCloseCallBackClick() {
  addDialog({
    title: "关闭后的回调",
    closeCallBack: ({ options, index, args }) => {
      console.log(options, index, args);
      let text = "";
      if (args?.command === "cancel") {
        text = "您点击了取消按钮";
      } else if (args?.command === "sure") {
        text = "您点击了确定按钮";
      } else {
        text = "您点击了右上角关闭按钮或者空白页";
      }
      message(text);
    },
    contentRenderer: () => <p>弹框内容-关闭后的回调</p>
  });
}

function onNestingClick() {
  addDialog({
    title: "嵌套的弹框",
    contentRenderer: ({ index }) => (
      <el-button
        onClick={() =>
          addDialog({
            title: `第${index + 1}个子弹框`,
            width: "40%",
            contentRenderer: ({ index }) => (
              <el-button
                onClick={() =>
                  addDialog({
                    title: `第${index + 1}个子弹框`,
                    width: "30%",
                    contentRenderer: () => (
                      <>
                        <el-button round onClick={() => closeAllDialog()}>
                          哎呦，你干嘛，赶快关闭所有弹框
                        </el-button>
                      </>
                    )
                  })
                }
              >
                点击打开第{index + 1}个子弹框
              </el-button>
            )
          })
        }
      >
        点击打开第{index + 1}个子弹框
      </el-button>
    )
  });
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          二次封装 element-plus 的
          <el-link
            href="https://element-plus.org/zh-CN/component/dialog.html"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            Dialog
          </el-link>
          ，采用函数式调用弹框组件
        </span>
      </div>
    </template>
    <el-space wrap>
      <el-button @click="onBaseClick"> 基本使用 </el-button>
      <el-button @click="onDraggableClick"> 可拖拽 </el-button>
      <el-button @click="onFullscreenClick"> 全屏 </el-button>
      <el-button @click="onModalClick"> 无背景遮罩层 </el-button>
      <el-button @click="onStyleClick"> 自定义弹出位置 </el-button>
      <el-button @click="onoOpenDelayClick"> 延时2秒打开弹框 </el-button>
      <el-button @click="onCloseDelayClick"> 延时2秒关闭弹框 </el-button>
      <el-button @click="onShowCloseClick">
        不显示右上角关闭按钮图标
      </el-button>
      <el-button @click="onBeforeCloseClick"> 禁止通过键盘ESC关闭 </el-button>
      <el-button @click="onCloseOnClickModalClick">
        禁止通过点击modal关闭
      </el-button>
      <el-button @click="onHideFooterClick"> 隐藏底部取消、确定按钮 </el-button>
      <el-button @click="onHeaderRendererClick"> 自定义头部 </el-button>
      <el-button @click="onFooterRendererClick"> 自定义底部 </el-button>
      <el-button @click="onFooterButtonsClick"> 自定义底部按钮 </el-button>
      <el-button @click="onOpenClick"> 打开后的回调 </el-button>
      <el-button @click="onCloseCallBackClick"> 关闭后的回调 </el-button>
      <el-button @click="onNestingClick"> 嵌套的弹框 </el-button>
    </el-space>
  </el-card>
</template>
