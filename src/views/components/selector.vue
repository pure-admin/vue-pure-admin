<script setup lang="ts">
import { ref } from "vue";
import Selector from "@/components/ReSelector";

defineOptions({
  name: "Selector"
});

const selectRange = ref<string>("");
const dataLists = ref([
  {
    title: "基础用法",
    echo: [],
    disabled: false
  },
  {
    title: "回显模式",
    echo: [2, 7],
    disabled: true
  }
]);

const selectedVal = ({ left, right }): void => {
  selectRange.value = `${left}-${right}`;
};
</script>

<template>
  <div>
    <el-card
      v-for="(item, key) in dataLists"
      :key="key"
      class="mb-2"
      shadow="never"
    >
      <template #header>
        <p class="font-medium">{{ item.title }}</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/selector.vue"
          target="_blank"
        >
          代码位置 src/views/components/selector.vue
        </el-link>
      </template>
      <Selector
        :HsKey="key"
        :echo="item.echo"
        :disabled="item.disabled"
        @selectedVal="selectedVal"
      />
      <h4 v-if="!item.disabled" class="mt-3">选中范围：{{ selectRange }}</h4>
    </el-card>
  </div>
</template>
