<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

defineOptions({
  name: "picUpload"
});

const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref(
  "<p>仅提供代码参考，暂不可上传图片，可根据实际业务改写</p>"
);
const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} };

// 更多详细配置看 https://www.wangeditor.com/v5/menu-config.html#%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87
editorConfig.MENU_CONF["uploadImage"] = {
  // 服务端上传地址，根据实际业务改写
  server: "",
  // form-data 的 fieldName，根据实际业务改写
  fieldName: "file",
  // 选择文件时的类型限制，根据实际业务改写
  allowedFileTypes: ["image/png", "image/jpg", "image/jpeg"],
  // 自定义插入图片
  customInsert(res: any, insertFn) {
    // res.data.url是后端返回的图片地址，根据实际业务改写
    if (res.data.url) {
      setTimeout(() => {
        // insertFn插入图片进编辑器
        insertFn(res.data.url);
      }, 2000);
    }
  }
};

const handleCreated = editor => {
  // 记录 editor 实例，重要！
  editorRef.value = editor;
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<template>
  <div class="wangeditor">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      style="height: 500px; overflow-y: hidden"
      @onCreated="handleCreated"
    />
  </div>
</template>
