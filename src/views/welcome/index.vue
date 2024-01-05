<script setup lang="ts">
import { chartData } from "./data";
import ReCol from "@/components/ReCol";
import { useDark } from "@pureadmin/utils";
import lineChart from "./components/lineChart.vue";
import roundChart from "./components/roundChart.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";

defineOptions({
  name: "Welcome"
});

const { isDark } = useDark();
</script>

<template>
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-for="(item, index) in chartData"
        :key="index"
        :value="6"
        :md="12"
        :sm="12"
        :xs="24"
        class="mb-[18px]"
      >
        <el-card shadow="never">
          <div class="flex justify-between">
            <span class="text-md font-medium text-text_color_regular">
              {{ item.name }}
            </span>
            <div
              class="w-8 h-8 flex justify-center items-center rounded-md"
              :style="{
                backgroundColor: isDark ? 'transparent' : item.bgColor
              }"
            >
              <IconifyIconOffline
                :icon="item.icon"
                :color="item.color"
                width="18"
              />
            </div>
          </div>
          <div class="flex justify-between items-start mt-3">
            <div class="w-1/2">
              <ReNormalCountTo
                :duration="item.duration"
                :fontSize="'1.6em'"
                :startVal="100"
                :endVal="item.value"
              />
              <p class="font-medium text-green-500">{{ item.percent }}</p>
            </div>
            <lineChart
              v-if="item.data.length > 1"
              class="!w-1/2"
              :color="item.color"
              :data="item.data"
            />
            <roundChart v-else class="!w-1/2" />
          </div>
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card) {
  --el-card-border-color: none;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
