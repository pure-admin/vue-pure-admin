<script setup lang="tsx">
import {
  addDrawer,
  closeDrawer,
  closeAllDrawer,
  updateDrawer
} from "@/components/ReDrawer/index";
import { cloneDeep, debounce } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { createVNode, h, ref } from "vue";
import formPrimitive from "./formPrimitive.vue";
import forms, { type FormProps } from "./form.vue";

function onBaseClick() {
  addDrawer({
    title: "基础用法",
    contentRenderer: () => <p>抽屉内容-基础用法</p> // jsx 语法 （注意在.vue文件启用jsx语法，需要在script开启lang="tsx"）
  });
}

function onModalClick() {
  addDrawer({
    title: "无背景遮罩层",
    modal: false,
    contentRenderer: () => <p>抽屉内容-无背景遮罩层</p>
  });
}

// 添加 600ms 防抖
const onoOpenDelayClick = debounce(
  () =>
    addDrawer({
      title: "延时2秒打开抽屉",
      openDelay: 2000 - 600,
      contentRenderer: () => <p>抽屉内容-延时2秒打开抽屉</p>
    }),
  600
);

function onCloseDelayClick() {
  addDrawer({
    title: "延时2秒关闭抽屉",
    closeDelay: 2000,
    contentRenderer: () => <p>抽屉内容-延时2秒关闭抽屉</p>
  });
}

function onShowCloseClick() {
  addDrawer({
    title: "不显示右上角关闭按钮图标",
    showClose: false,
    contentRenderer: () => <p>抽屉内容-不显示右上角关闭按钮图标</p>
  });
}

function onBeforeCloseClick() {
  addDrawer({
    title: "禁止通过键盘ESC关闭",
    closeOnPressEscape: false,
    contentRenderer: () => <p>抽屉内容-禁止通过键盘ESC关闭</p>
  });
}

function onCloseOnClickModalClick() {
  addDrawer({
    title: "禁止通过点击modal关闭",
    closeOnClickModal: false,
    contentRenderer: () => <p>抽屉内容-禁止通过点击modal关闭</p>
  });
}

function onHideFooterClick() {
  addDrawer({
    title: "隐藏底部取消、确定按钮",
    hideFooter: true,
    contentRenderer: () => <p>抽屉内容-隐藏底部取消、确定按钮</p>
  });
}

function onHeaderRendererClick() {
  addDrawer({
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
    contentRenderer: () => <p>抽屉内容-自定义头部</p>
  });
}

function onFooterRendererClick() {
  addDrawer({
    title: "自定义底部",
    footerRenderer: ({ options, index }) => (
      <el-button onClick={() => closeDrawer(options, index)}>
        {options.title}-{index}
      </el-button>
    ),
    contentRenderer: () => <p>抽屉内容-自定义底部</p>
  });
}

function onFooterButtonsClick() {
  addDrawer({
    title: "自定义底部按钮",
    footerButtons: [
      {
        label: "按钮1",
        size: "small",
        type: "success",
        btnClick: ({ drawer: { options, index }, button }) => {
          console.log(options, index, button);
          closeDrawer(options, index);
        }
      },
      {
        label: "按钮2",
        text: true,
        bg: true,
        btnClick: ({ drawer: { options, index }, button }) => {
          console.log(options, index, button);
          closeDrawer(options, index);
        }
      },
      {
        label: "按钮3",
        size: "large",
        type: "warning",
        btnClick: ({ drawer: { options, index }, button }) => {
          console.log(options, index, button);
          closeDrawer(options, index);
        }
      }
    ],
    contentRenderer: () => <p>抽屉内容-自定义底部按钮</p>
  });
}

function onOpenClick() {
  addDrawer({
    title: "打开后的回调",
    open: ({ options, index }) => message({ options, index } as any),
    contentRenderer: () => <p>抽屉内容-打开后的回调</p>
  });
}

function onCloseCallBackClick() {
  addDrawer({
    title: "关闭后的回调",
    closeCallBack: ({ options, index, args }) => {
      console.log(options, index, args);
      let text = "";
      if (args?.command === "cancel") {
        text = "您点击了取消按钮";
      } else if (args?.command === "sure") {
        text = "您点击了确定按钮";
      } else {
        text = "您点击了右上角关闭按钮或空白页或按下了esc键";
      }
      message(text);
    },
    contentRenderer: () => <p>抽屉内容-关闭后的回调</p>
  });
}

// 这里为了演示方便，使用了嵌套写法，实际情况下最好把 addDrawer 函数抽出来 套娃不可取
function onNestingClick() {
  addDrawer({
    title: "嵌套的抽屉",
    size: "50%",
    contentRenderer: ({ index }) => (
      <el-button
        onClick={() =>
          addDrawer({
            title: `第${index + 1}个子抽屉`,
            size: "40%",
            contentRenderer: ({ index }) => (
              <el-button
                onClick={() =>
                  addDrawer({
                    title: `第${index + 1}个子抽屉`,
                    size: "30%",
                    contentRenderer: () => (
                      <>
                        <el-button round onClick={() => closeAllDrawer()}>
                          哎呦，你干嘛，赶快关闭所有抽屉
                        </el-button>
                      </>
                    )
                  })
                }
              >
                点击打开第{index + 1}个子抽屉
              </el-button>
            )
          })
        }
      >
        点击打开第{index + 1}个子抽屉
      </el-button>
    )
  });
}

// 满足在 contentRenderer 内容区更改抽屉自身属性值的场景
function onUpdateClick() {
  const curPage = ref(1);
  addDrawer({
    title: `第${curPage.value}页`,
    contentRenderer: () => (
      <>
        <el-button
          disabled={curPage.value <= 1}
          onClick={() => {
            curPage.value -= 1;
            updateDrawer(`第${curPage.value}页`);
          }}
        >
          上一页
        </el-button>
        <el-button
          onClick={() => {
            curPage.value += 1;
            updateDrawer(`第${curPage.value}页`);
          }}
        >
          下一页
        </el-button>
      </>
    )
  });
}

// Popconfirm 确认框
function onPopConfirmClick() {
  addDrawer({
    size: "30%",
    title: "Popconfirm确认框示例",
    popConfirm: { title: "是否确认修改当前数据" },
    contentRenderer: () => <p>点击右下方确定按钮看看效果吧</p>
  });
}

// 结合Form表单（第一种方式，抽屉关闭立刻恢复初始值）通过 props 属性接收子组件的 prop 并赋值
function onFormOneClick() {
  addDrawer({
    size: "30%",
    title: "结合Form表单（第一种方式）",
    contentRenderer: () => forms,
    props: {
      // 赋默认值
      formInline: {
        user: "菜虚鲲",
        region: "浙江"
      }
    },
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as FormProps;
      const text = `姓名：${formInline.user} 城市：${formInline.region}`;
      if (args?.command === "cancel") {
        // 您点击了取消按钮
        message(`您点击了取消按钮，当前表单数据为 ${text}`);
      } else if (args?.command === "sure") {
        message(`您点击了确定按钮，当前表单数据为 ${text}`);
      } else {
        message(
          `您点击了右上角关闭按钮或空白页或按下了esc键，当前表单数据为 ${text}`
        );
      }
    }
  });
}

// 结合Form表单（第二种方式）h 渲染函数 https://cn.vuejs.org/api/render-function.html#h
const formInline = ref({
  user: "菜虚鲲",
  region: "浙江"
});
const resetFormInline = cloneDeep(formInline.value);
function onFormTwoClick() {
  addDrawer({
    size: "30%",
    title: "结合Form表单（第二种方式）",
    contentRenderer: () =>
      h(forms, {
        formInline: formInline.value
      }),
    closeCallBack: () => {
      message(
        `当前表单数据为 姓名：${formInline.value.user} 城市：${formInline.value.region}`
      );
      // 重置表单数据
      formInline.value = cloneDeep(resetFormInline);
    }
  });
}

// 结合Form表单（第三种方式）createVNode 渲染函数 https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes
const formThreeInline = ref({
  user: "菜虚鲲",
  region: "浙江"
});
const resetFormThreeInline = cloneDeep(formThreeInline.value);
function onFormThreeClick() {
  addDrawer({
    size: "30%",
    title: "结合Form表单（第三种方式）",
    contentRenderer: () =>
      createVNode(forms, {
        formInline: formThreeInline.value
      }),
    closeCallBack: () => {
      message(
        `当前表单数据为 姓名：${formThreeInline.value.user} 城市：${formThreeInline.value.region}`
      );
      // 重置表单数据
      formThreeInline.value = cloneDeep(resetFormThreeInline);
    }
  });
}

// 结合Form表单（第四种方式）使用jsx语法
// 需要注意的是如果 forms 没注册，这里 forms 注册了是因为上面 contentRenderer: () => forms、h(forms) 、createVNode(createVNode) 间接给注册了
// 如果只使用了jsx语法，如下 `contentRenderer: () => <forms formInline={formFourInline.value} />` 是不会给 forms 组件进行注册的，需要在 `script` 中任意位置（最好是末尾）写上 forms 即可
// 同理如果在 tsx 文件中，这么使用 `contentRenderer: () => <forms formInline={formFourInline.value} />`，也是不会给 forms 组件进行注册，需要在 return 中写上 forms
const formFourInline = ref({
  user: "菜虚鲲",
  region: "浙江"
});
const resetFormFourInline = cloneDeep(formFourInline.value);
function onFormFourClick() {
  addDrawer({
    size: "30%",
    title: "结合Form表单（第四种方式）",
    contentRenderer: () => <forms formInline={formFourInline.value} />,
    closeCallBack: () => {
      message(
        `当前表单数据为 姓名：${formFourInline.value.user} 城市：${formFourInline.value.region}`
      );
      // 重置表单数据
      formFourInline.value = cloneDeep(resetFormFourInline);
    }
  });
}

// 子组件 prop 为 primitive 类型的 demo
const formPrimitiveParam = ref("Hello World");
const resetFormPrimitiveParam = ref(formPrimitiveParam.value);
function onFormPrimitiveFormClick() {
  addDrawer({
    size: "30%",
    title: "子组件 prop 为 primitive 类型 demo",
    contentRenderer: () =>
      h(formPrimitive, {
        data: formPrimitiveParam.value,
        "onUpdate:data": val => (formPrimitiveParam.value = val)
      }),
    closeCallBack: () => {
      message(`当前表单内容：${formPrimitiveParam.value}`);
      // 重置表单数据
      formPrimitiveParam.value = resetFormPrimitiveParam.value;
    }
  });
}

function onBeforeCancelClick() {
  addDrawer({
    title: "点击底部取消按钮的回调",
    contentRenderer: () => (
      <p>抽屉内容-点击底部取消按钮的回调（会暂停抽屉的关闭）</p>
    ),
    beforeCancel: (done, { options, index }) => {
      console.log(
        "%coptions, index===>>>: ",
        "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
        options,
        index
      );
      // done(); // 需要关闭把注释解开即可
    }
  });
}

function onBeforeSureClick() {
  addDrawer({
    title: "点击底部确定按钮的回调",
    contentRenderer: () => (
      <p>
        抽屉内容-点击底部确定按钮的回调（会暂停抽屉的关闭，经常用于新增、修改抽屉内容后调用接口）
      </p>
    ),
    beforeSure: (done, { options, index }) => {
      console.log(
        "%coptions, index===>>>: ",
        "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
        options,
        index
      );
      // done(); // 需要关闭把注释解开即可
    }
  });
}

function onSureBtnLoading() {
  addDrawer({
    sureBtnLoading: true,
    title: "点击底部确定按钮可开启按钮动画",
    contentRenderer: () => <p>抽屉内容-点击底部确定按钮可开启按钮动画</p>,
    beforeSure: (done, { closeLoading }) => {
      // closeLoading(); // 关闭确定按钮动画，不关闭抽屉
      // done() // 关闭确定按钮动画并关闭抽屉
      setTimeout(() => done(), 800);
    }
  });
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          二次封装 Element Plus 的
          <el-link
            href="https://element-plus.org/zh-CN/component/drawer.html"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            Drawer
          </el-link>
        </span>
      </div>
      <el-link
        href="https://github.com/pure-admin/vue-pure-admin/tree/main/src/views/components/drawer"
        target="_blank"
      >
        代码位置 src/views/components/drawer
      </el-link>
    </template>
    <el-space wrap>
      <el-button @click="onBaseClick">基础用法</el-button>
      <el-button @click="onModalClick"> 无背景遮罩层 </el-button>
      <el-button @click="onoOpenDelayClick"> 延时2秒打开抽屉 </el-button>
      <el-button @click="onCloseDelayClick"> 延时2秒关闭抽屉 </el-button>
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
      <el-button @click="onNestingClick"> 嵌套的抽屉 </el-button>
      <el-button @click="onUpdateClick"> 更改抽屉自身属性值 </el-button>
      <el-button @click="onPopConfirmClick">Popconfirm确认框</el-button>
    </el-space>
    <el-divider />
    <el-space wrap>
      <el-button @click="onFormOneClick">
        结合Form表单（第一种方式）
      </el-button>
      <el-button @click="onFormTwoClick">
        结合Form表单（第二种方式）
      </el-button>
      <el-button @click="onFormThreeClick">
        结合Form表单（第三种方式）
      </el-button>
      <el-button @click="onFormFourClick">
        结合Form表单（第四种方式）
      </el-button>
      <el-button @click="onFormPrimitiveFormClick">
        子组件 prop 为 primitive 类型
      </el-button>
    </el-space>
    <el-divider />
    <el-space wrap>
      <el-button @click="onBeforeCancelClick">
        点击底部取消按钮的回调（会暂停抽屉的关闭）
      </el-button>
      <el-button @click="onBeforeSureClick">
        点击底部确定按钮的回调（会暂停抽屉的关闭，经常用于新增、修改抽屉内容后调用接口）
      </el-button>
      <el-button @click="onSureBtnLoading">
        点击底部确定按钮可开启按钮动画
      </el-button>
    </el-space>
  </el-card>
</template>
