<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Collapse"
});

const radio = ref();
const collapseRef = ref();
const activeNames = ref(["1", "2", "3", "4", "5"]);
const isOpen = ref(true);

function onClick() {
  isOpen.value
    ? (activeNames.value = [])
    : radio.value === "accordion"
      ? (activeNames.value = ["5"])
      : (activeNames.value = ["1", "2", "3", "4", "5"]);
  isOpen.value = !isOpen.value;
}

const handleChange = (val: string[]) => {
  console.log(val);
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
            href="https://element-plus.org/zh-CN/component/collapse.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            折叠面板
          </el-link>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/collapse.vue"
        target="_blank"
      >
        代码位置 src/views/components/collapse.vue
      </el-link>
    </template>

    <p class="mb-2">基础用法</p>
    <el-radio-group v-model="radio" class="mb-3">
      <el-radio value="">可同时展开多个面板</el-radio>
      <el-radio value="accordion">每次只能展开一个面板</el-radio>
    </el-radio-group>
    <el-button size="small" text bg class="ml-8 mb-1" @click="onClick">
      外部触发打开、关闭
    </el-button>
    <el-collapse
      ref="collapseRef"
      v-model="activeNames"
      class="w-[360px]"
      :accordion="radio === 'accordion' ? true : false"
      @change="handleChange"
    >
      <el-collapse-item title="周一" name="1">
        周一启航，新的篇章
      </el-collapse-item>
      <el-collapse-item title="周二" name="2">
        周二律动，携手共进
      </el-collapse-item>
      <el-collapse-item title="周三" name="3">
        周三昂扬，激情不减
      </el-collapse-item>
      <el-collapse-item title="周四" name="4">
        周四精进，事半功倍
      </el-collapse-item>
      <el-collapse-item name="5">
        <template #title>
          周五
          <IconifyIconOnline
            icon="streamline-emojis:beaming-face-with-smiling-eyes"
            class="ml-1"
            width="30"
          />
        </template>
        周五喜悦，收尾归档
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
