<script setup lang="ts">
import { ref, nextTick } from "vue";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";

defineOptions({
  name: "PureTag"
});

const size = ref("default");
const checked1 = ref(false);
const checked2 = ref(false);
const baseTag = ref("dark");
const tagList = ref([
  {
    type: "primary",
    text: "Primary"
  },
  {
    type: "success",
    text: "Success"
  },
  {
    type: "info",
    text: "Info"
  },
  {
    type: "warning",
    text: "Warning"
  },
  {
    type: "danger",
    text: "Danger"
  }
]);
const handleClose = tag => {
  tagList.value.splice(tagList.value.indexOf(tag), 1);
};
const copyTagList = cloneDeep(tagList.value);
function onReset() {
  tagList.value = cloneDeep(copyTagList);
}

/** 动态编辑标签 */
const inputValue = ref("");
const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const inputVisible = ref(false);
const InputRef = ref();
const handleDynamicClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (!isAllEmpty(inputValue.value)) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-space wrap :size="40">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/tag.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            Tag 标签
          </el-link>
          <el-radio-group v-model="size">
            <el-radio value="large">大尺寸</el-radio>
            <el-radio value="default">默认尺寸</el-radio>
            <el-radio value="small">小尺寸</el-radio>
          </el-radio-group>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/tag.vue"
        target="_blank"
      >
        代码位置 src/views/components/tag.vue
      </el-link>
    </template>

    <p class="mb-2">基础按钮</p>
    <el-radio-group v-model="baseTag" class="mb-3">
      <el-radio label="dark" value="dark" />
      <el-radio label="light" value="light" />
      <el-radio label="plain" value="plain" />
    </el-radio-group>
    <br />
    <el-space class="mb-3">
      <el-checkbox
        v-if="tagList.length > 0"
        v-model="checked1"
        label="可移除"
      />
      <el-button v-else size="small" text bg class="mr-6" @click="onReset">
        重置
      </el-button>
      <el-button
        v-if="checked1 && tagList.length > 0"
        size="small"
        text
        bg
        class="mr-6 ml-4"
        @click="tagList = []"
      >
        移除全部
      </el-button>
      <el-checkbox v-model="checked2" label="圆形" />
    </el-space>
    <br />
    <el-space wrap>
      <el-tag
        v-for="(tag, index) in tagList"
        :key="index"
        :type="tag.type as any"
        :effect="baseTag as any"
        :closable="checked1"
        :round="checked2"
        :size="size as any"
        :disabled="size === 'disabled'"
        @close="handleClose(tag)"
      >
        {{ tag.text }}
      </el-tag>
    </el-space>
    <el-divider />

    <p class="mb-2">动态编辑标签</p>
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      class="mx-1"
      closable
      :size="size as any"
      :disable-transitions="false"
      @close="handleDynamicClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 !w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag ml-1"
      size="small"
      @click="showInput"
    >
      新建标签
    </el-button>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.el-divider--horizontal) {
  margin: 17px 0;
}
</style>
