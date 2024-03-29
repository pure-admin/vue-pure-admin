<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import ReCol from "@/components/ReCol";
import { useTransition } from "@vueuse/core";

defineOptions({
  name: "Statistic"
});

const value = ref(Date.now() + 1000 * 60 * 60 * 7);
const value1 = ref(Date.now() + 1000 * 60 * 60 * 24 * 2);
const value2 = ref(dayjs().add(1, "month").startOf("month"));

const source = ref(0);
const outputValue = useTransition(source, {
  duration: 1500
});
source.value = 36000;

function reset() {
  value1.value = Date.now() + 1000 * 60 * 60 * 24 * 2;
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/statistic.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            统计组件
          </el-link>
        </div>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/statistic.vue"
          target="_blank"
        >
          代码位置 src/views/components/statistic.vue
        </el-link>
      </template>

      <el-row :gutter="24">
        <re-col :value="6" :xs="24" :sm="24">
          <el-statistic title="需求人数" :value="outputValue" />
        </re-col>

        <re-col :value="6" :xs="24" :sm="24">
          <el-countdown title="距离答疑结束还剩" :value="value" />
        </re-col>

        <re-col :value="6" :xs="24" :sm="24">
          <el-countdown
            title="VIP到期时间还剩"
            format="HH:mm:ss"
            :value="value1"
          />
          <el-button class="mt-2" type="primary" text bg @click="reset">
            重置
          </el-button>
        </re-col>

        <re-col :value="6" :xs="24" :sm="24">
          <el-countdown format="DD天 HH时 mm分 ss秒" :value="value2">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <IconifyIconOnline icon="ep:calendar" class="mr-2" />
                距离下个月还剩
              </div>
            </template>
          </el-countdown>
          <div class="mt-2">{{ value2.format("YYYY-MM-DD") }}</div>
        </re-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.el-col {
  text-align: center;
}
</style>
