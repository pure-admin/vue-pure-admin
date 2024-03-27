<script setup lang="ts">
import { ReNormalCountTo, ReboundCountTo } from "@/components/ReCountTo";

defineOptions({
  name: "CountTo"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <p class="font-medium">数字动画</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/count-to.vue"
          target="_blank"
        >
          代码位置 src/views/components/count-to.vue
        </el-link>
      </div>
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
