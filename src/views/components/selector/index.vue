<template>
  <el-card class="box-card" style="margin:20px">
    <template #header>
      <div class="card-header">
        <span>基本使用</span>
      </div>
    </template>
    <Selector />
  </el-card>
</template>

<script lang='ts'>
import Selector from "../../../components/selector/index.vue";
export default {
  components: { Selector },
  setup() {
    return {};
  },
};
</script>

<style scoped>
</style>
