<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { onBeforeUnmount, ref, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

defineOptions({
  name: "MultiEditor"
});

// 模拟后端返回多个编辑器的数据
const endEditorList = [
  {
    value: "<p>测试一</p>"
  },
  {
    value: "<p>测试二</p>"
  },
  {
    value: "<p>测试三</p>"
  },
  {
    value: "<p>测试四</p>"
  }
];

// 多个编辑器的情况下，前端必须进行处理，满足 Toolbar 组件的 editor 属性 所需的 shallowRef 格式
const editorList = ref([]);
endEditorList.forEach(edit => {
  editorList.value.push({
    value: edit.value,
    // 编辑器实例，必须用 shallowRef
    editorRef: shallowRef()
  });
});

const mode = "default";

const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = { placeholder: "请输入内容..." };

const handleCreated = (editor, index) => {
  // 记录 editor 实例，重要！
  editorList.value[index].editorRef = editor;
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  return editorList.value.map(edit => {
    if (edit.editorRef == null) return;
    edit.editorRef.destroy();
  });
});
</script>

<template>
  <el-row :gutter="30" justify="space-around">
    <re-col v-for="(edit, index) in editorList" :key="index" :value="11">
      <div class="wangeditor">
        <Toolbar
          :editor="edit.editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
          style="border-bottom: 1px solid #ccc"
        />
        <Editor
          v-model="edit.value"
          :defaultConfig="editorConfig"
          :mode="mode"
          style="height: 300px; overflow-y: hidden"
          @onCreated="editor => handleCreated(editor, index)"
        />
      </div>
    </re-col>
  </el-row>
</template>
