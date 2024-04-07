<script setup lang="ts">
import { ref } from "vue";
import Mint from "mint-filter";

defineOptions({
  name: "Sensitive"
});

// 自定义敏感词字典
const words = ["脑残", "废物", "白痴", "三八", "智障"];

const modelValue = ref();
const mint = new Mint(words);

function onInput() {
  modelValue.value = mint.filter(modelValue.value).text;
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <p class="font-medium">敏感词过滤</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/sensitive.vue"
          target="_blank"
        >
          代码位置 src/views/able/sensitive.vue
        </el-link>
      </div>
    </template>
    <div class="flex flex-wrap gap-2 my-2">
      <span>自定义敏感词</span>
      <el-tag
        v-for="(word, index) in words"
        :key="index"
        type="warning"
        class="mx-1"
        effect="dark"
        round
      >
        {{ word }}
      </el-tag>
    </div>
    <el-input v-model="modelValue" @input="onInput" />
    <p class="mt-2">{{ modelValue }}</p>
  </el-card>
</template>
