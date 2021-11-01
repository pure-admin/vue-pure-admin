<script setup lang="ts">
import { ReNormalCountTo, ReboundCountTo } from "/@/components/ReCountTo";
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card shadow="always">
          <ReNormalCountTo
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
          <ul class="flex">
            <ReboundCountTo
              v-for="(num, inx) of [1, 6, 6, 6]"
              :key="inx"
              :i="num"
              :blur="inx"
              :delay="inx + 1"
            />
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}

:deep(.el-card) {
  text-align: center;
  margin-bottom: 10px;
}
</style>
