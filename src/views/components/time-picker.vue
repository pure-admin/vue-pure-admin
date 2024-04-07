<script setup lang="ts">
import { ref, watch } from "vue";

defineOptions({
  name: "TimePicker"
});

const size = ref("default");
const dynamicSize = ref();

/** 时间选择器 */
const value = ref("");
const value1 = ref("");
const value3 = ref();

const value2 = ref(new Date(2016, 9, 10, 18, 30));

const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
const disabledHours = () => {
  return makeRange(0, 16).concat(makeRange(19, 23));
};
const disabledMinutes = (hour: number) => {
  if (hour === 17) {
    return makeRange(0, 29);
  }
  if (hour === 18) {
    return makeRange(31, 59);
  }
};
const disabledSeconds = (hour: number, minute: number) => {
  if (hour === 18 && minute === 30) {
    return makeRange(1, 59);
  }
};

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);

/** 时间选择 */
const value4 = ref("");
const value5 = ref("");
const startTime = ref("");
const endTime = ref("");
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <el-space wrap :size="40">
            <el-link
              v-tippy="{
                content: '点击查看详细文档'
              }"
              href="https://element-plus.org/zh-CN/component/time-picker.html"
              target="_blank"
              style="font-size: 16px; font-weight: 800"
            >
              时间选择器
            </el-link>
            <el-radio-group v-model="size">
              <el-radio value="large">大尺寸</el-radio>
              <el-radio value="default">默认尺寸</el-radio>
              <el-radio value="small">小尺寸</el-radio>
              <el-radio value="disabled">禁用</el-radio>
            </el-radio-group>
          </el-space>
        </div>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/time-picker.vue"
          target="_blank"
        >
          代码位置 src/views/components/time-picker.vue
        </el-link>
      </template>

      <p class="mb-2">日期和时间点</p>
      <el-space wrap>
        <p class="text-[15px]">鼠标滚轮进行选择</p>
        <el-time-picker
          v-model="value"
          placeholder="请选择时间"
          class="!w-[140px]"
          :size="dynamicSize"
          :disabled="size === 'disabled'"
        />
        <p class="text-[15px]">箭头进行选择</p>
        <el-time-picker
          v-model="value1"
          arrow-control
          placeholder="请选择时间"
          class="!w-[140px]"
          :size="dynamicSize"
          :disabled="size === 'disabled'"
        />
      </el-space>
      <el-divider />

      <p class="mb-2">限制时间选择范围</p>
      <el-time-picker
        v-model="value2"
        class="!w-[140px]"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
        placeholder="Arbitrary time"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
      <el-divider />

      <p class="mb-2">任意时间范围</p>
      <el-time-picker
        v-model="value3"
        class="!w-[220px]"
        is-range
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
    </el-card>

    <el-card shadow="never" class="mt-4">
      <template #header>
        <div class="card-header">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/time-select.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            时间选择
          </el-link>
        </div>
      </template>

      <p class="mb-2">固定时间点</p>
      <el-time-select
        v-model="value4"
        placeholder="请选择时间"
        class="!w-[140px]"
        start="08:30"
        step="00:15"
        end="18:30"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />

      <p class="mb-2 mt-4">时间格式</p>
      <el-time-select
        v-model="value5"
        placeholder="请选择时间"
        class="!w-[140px]"
        start="00:00"
        step="00:30"
        end="23:59"
        format="hh:mm A"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />

      <p class="mb-2 mt-4">固定时间范围</p>
      <el-space wrap>
        <el-time-select
          v-model="startTime"
          placeholder="开始时间"
          class="!w-[140px]"
          :max-time="endTime"
          start="08:30"
          step="00:15"
          end="18:30"
          :size="dynamicSize"
          :disabled="size === 'disabled'"
        />
        <el-time-select
          v-model="endTime"
          placeholder="结束时间"
          class="!w-[140px]"
          :min-time="startTime"
          start="08:30"
          step="00:15"
          end="18:30"
          :size="dynamicSize"
          :disabled="size === 'disabled'"
        />
      </el-space>
    </el-card>
  </div>
</template>
