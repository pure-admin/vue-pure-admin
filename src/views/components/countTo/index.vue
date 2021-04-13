<template>
  <div style="margin:10px">
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card shadow="always">
          <CountTo
            prefix="$"
            :duration="1000"
            :color="'#409EFF'"
            :fontSize="'60px'"
            :startVal="1"
            :endVal="1000"
          />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always">
          <CountTo
            prefix="$"
            :duration="2000"
            :color="'green'"
            :fontSize="'60px'"
            :startVal="1"
            :endVal="2000"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import CountTo from "/@/components/countTo";
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
