<template>
  <div style="margin:10px">
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card shadow="always">
          <CountTo prefix="$" :color="'#409EFF'" :startVal="1" :endVal="1000" />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always">
          <CountTo prefix="$" :color="'green'" :startVal="1" :endVal="1500" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import CountTo from "../../../components/countTo/src/index.vue";
export default {
  components: {
    CountTo
  },
  setup() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  text-align: center;
}
</style>
