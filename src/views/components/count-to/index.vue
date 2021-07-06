<template>
  <div style="margin: 10px">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card shadow="always">
          <CountTo
            prefix="$"
            :duration="1000"
            :color="'#409EFF'"
            :fontSize="'2.3em'"
            :startVal="1"
            :endVal="1000"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card shadow="always">
          <CountTo
            prefix="$"
            :duration="2000"
            :color="'green'"
            :fontSize="'2.3em'"
            :startVal="1"
            :endVal="2000"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import CountTo from "/@/components/ReCountTo";
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
  margin-bottom: 10px;
}
</style>
