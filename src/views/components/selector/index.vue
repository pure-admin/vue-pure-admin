<script setup lang="ts">
import { ref } from "vue";
import Selector from "/@/components/ReSelector";

defineOptions({
  name: "Selector"
});

let selectRange = ref<string>("");
let dataLists = ref([
  {
    title: "基本使用",
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
    <el-card class="box-card" v-for="(item, key) in dataLists" :key="key">
      <template #header>
        <div class="card-header">
          <span>{{ item.title }}</span>
        </div>
      </template>
      <Selector
        :HsKey="key"
        :echo="item.echo"
        @selectedVal="selectedVal"
        :disabled="item.disabled"
      />
      <h4 v-if="!item.disabled">选中范围：{{ selectRange }}</h4>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 10px;
}
</style>
