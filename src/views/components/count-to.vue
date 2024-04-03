<script setup lang="ts">
import { ReNormalCountTo, ReboundCountTo } from "@/components/ReCountTo";
import ReCodePath from "@/components/ReCodePath";

defineOptions({
  name: "CountTo"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <ReCodePath />
    </template>
    <ReNormalCountTo
      prefix="$"
      :duration="1000"
      :color="'#409EFF'"
      :fontSize="'2em'"
      :startVal="1"
      :endVal="1000"
    />
    <br />
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
</template>
