<template>
  <el-card class="box-card" style="margin:20px">
    <template #header>
      <div class="card-header">
        <span>基本使用</span>
      </div>
    </template>
    <Selector @selectedVal="selectedVal" />
    <h4>选中范围：{{ selectRange }}</h4>
  </el-card>
</template>

<script lang='ts'>
import { ref } from "vue";
import Selector from "/@/components/selector/index.vue";
export default {
  components: { Selector },
  setup() {
    let selectRange = ref(null);

    const selectedVal = ({ left, right, whole }) => {
      selectRange.value = `${left}-${right}`;
    };

    return {
      selectedVal,
      selectRange
    };
  }
};
</script>

<style scoped>
</style>
