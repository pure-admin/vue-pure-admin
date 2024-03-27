<script setup lang="ts">
import { ref, watch } from "vue";
// https://plus-pro-components.com/components/check-card-group.html
import "plus-pro-components/es/components/check-card-group/style/css";
import { PlusCheckCardGroup } from "plus-pro-components";

defineOptions({
  name: "CheckCard"
});

const size = ref("default");
const dynamicSize = ref();
const list = ref("0");
const list1 = ref([]);

const options = [
  {
    title: "标题一",
    value: "0",
    description: "坚持梦想，成就不凡的自己",
    avatar:
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
  },
  {
    title: "标题二",
    value: "1",
    description: "每一次努力，都是成长的契机",
    avatar:
      "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
  }
];

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);
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
            href="https://plus-pro-components.com/components/check-card-group.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            多选卡片组
          </el-link>
          <el-radio-group v-model="size">
            <el-radio value="large">大尺寸</el-radio>
            <el-radio value="default">默认尺寸</el-radio>
            <el-radio value="small">小尺寸</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-space>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/check-card.vue"
        target="_blank"
      >
        代码位置 src/views/components/check-card.vue
      </el-link>
    </template>

    <p class="mb-2 mt-4">单选</p>
    <PlusCheckCardGroup
      v-model="list"
      :options="options"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">多选</p>
    <PlusCheckCardGroup
      v-model="list1"
      :options="options"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
      multiple
    />
  </el-card>
</template>
