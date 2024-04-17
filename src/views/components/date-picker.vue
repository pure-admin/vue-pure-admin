<script setup lang="ts">
import { ref, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({
  name: "DatePicker"
});

const size = ref("default");
const dynamicSize = ref();

const value = ref("");
const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const value1 = ref("");
const value2 = ref("");
const value3 = ref("");
const value4 = ref("");

const value5 = ref("");
const shortcuts1 = [
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "上个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "三个月前",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

const value6 = ref("");
const shortcuts2 = [
  {
    text: "本月",
    value: [new Date(), new Date()]
  },
  {
    text: "今年",
    value: () => {
      const end = new Date();
      const start = new Date(new Date().getFullYear(), 0);
      return [start, end];
    }
  },
  {
    text: "六个月前",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return [start, end];
    }
  }
];

const value7 = ref("");
const dateFormat = ref("");

const value8 = ref("");

const value9 = ref("2023-10-30");
const holidays = [
  "2023-10-22",
  "2023-10-23",
  "2023-10-24",
  "2023-10-25",
  "2023-10-26",
  "2023-10-27",
  "2023-10-28",
  "2023-10-29",
  "2023-10-30",
  "2023-10-31"
];

const isHoliday = ({ dayjs }) => {
  return holidays.includes(dayjs.format("YYYY-MM-DD"));
};

watch(size, val =>
  val === "disabled"
    ? (dynamicSize.value = "default")
    : (dynamicSize.value = size.value)
);
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-space wrap :size="40">
          <el-link
            v-tippy="{
              content: '点击查看详细文档'
            }"
            href="https://element-plus.org/zh-CN/component/date-picker.html"
            target="_blank"
            style="font-size: 16px; font-weight: 800"
          >
            日期选择器
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
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/date-picker.vue"
        target="_blank"
      >
        代码位置 src/views/components/date-picker.vue
      </el-link>
    </template>

    <p class="mb-2">选择某一天</p>
    <el-date-picker
      v-model="value"
      type="date"
      class="!w-[160px]"
      placeholder="请选择"
      :disabled-date="disabledDate"
      :shortcuts="shortcuts"
      :popper-options="{
        placement: 'bottom-start'
      }"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">选择周、月、年或多个日期</p>
    <el-space wrap>
      <el-date-picker
        v-model="value1"
        type="week"
        class="!w-[160px]"
        format="YYYY年第ww周"
        placeholder="选择某年中的某周"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
      <el-date-picker
        v-model="value2"
        type="month"
        class="!w-[160px]"
        placeholder="选择某月"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
      <el-date-picker
        v-model="value3"
        type="year"
        class="!w-[160px]"
        placeholder="选择某年"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
      <el-date-picker
        v-model="value4"
        type="dates"
        class="!w-[160px]"
        placeholder="选择多个日期"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
    </el-space>

    <p class="mb-2 mt-4">选择一段时间</p>
    <el-date-picker
      v-model="value5"
      type="daterange"
      class="!w-[240px]"
      unlink-panels
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :shortcuts="shortcuts1"
      :popper-options="{
        placement: 'bottom-start' // 下拉面板出现的位置，或 'top-start'、'bottom-end'、'top-end' 等，具体看 https://popper.js.org/docs/v2/constructors/#options
      }"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">选择月份范围</p>
    <el-date-picker
      v-model="value6"
      type="monthrange"
      unlink-panels
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
      :shortcuts="shortcuts2"
      :popper-options="{
        placement: 'bottom-start'
      }"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">日期格式</p>
    <el-radio-group
      v-model="dateFormat"
      class="mb-2"
      :disabled="size === 'disabled'"
      @change="value7 = ''"
    >
      <el-radio value="">Date</el-radio>
      <el-radio value="YYYY-MM-DD">年月日</el-radio>
      <el-radio value="x">时间戳</el-radio>
    </el-radio-group>
    <br />
    <el-space wrap>
      <el-date-picker
        v-model="value7"
        type="date"
        class="!w-[160px]"
        placeholder="请选择日期"
        format="YYYY/MM/DD"
        :value-format="dateFormat"
        :size="dynamicSize"
        :disabled="size === 'disabled'"
      />
      <span class="ml-2">{{ value7 }}</span>
    </el-space>

    <p class="mb-2 mt-4">自定义前缀</p>
    <el-date-picker
      v-model="value8"
      type="date"
      class="!w-[160px]"
      placeholder="请选择日期"
      :prefix-icon="useRenderIcon('twemoji:spiral-calendar')"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    />

    <p class="mb-2 mt-4">自定义内容</p>
    <el-date-picker
      v-model="value9"
      type="date"
      placeholder="请选择日期"
      format="YYYY/MM/DD"
      value-format="YYYY-MM-DD"
      :size="dynamicSize"
      :disabled="size === 'disabled'"
    >
      <template #default="cell">
        <div class="cell" :class="{ current: cell.isCurrent }">
          <span class="text">{{ cell.text }}</span>
          <span v-if="isHoliday(cell)" class="holiday" />
        </div>
      </template>
    </el-date-picker>
  </el-card>
</template>

<style scoped>
.cell {
  box-sizing: border-box;
  height: 30px;
  padding: 3px 0;
}

.cell .text {
  position: absolute;
  left: 50%;
  display: block;
  width: 24px;
  height: 24px;
  margin: 0 auto;
  line-height: 24px;
  border-radius: 50%;
  transform: translateX(-50%);
}

.cell.current .text {
  color: #fff;
  background: #626aef;
}

.cell .holiday {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--el-color-danger);
  border-radius: 50%;
  transform: translateX(-50%);
}
</style>
