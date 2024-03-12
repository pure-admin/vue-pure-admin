<script setup lang="tsx">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const columns = [
  {
    label: "IP 地址",
    prop: "ip",
    minWidth: 100
  },
  {
    label: "地点",
    prop: "address",
    minWidth: 100
  },
  {
    label: "操作系统",
    prop: "system",
    minWidth: 100
  },
  {
    label: "浏览器类型",
    prop: "browser",
    minWidth: 100
  },
  {
    label: "所属模块",
    prop: "module",
    minWidth: 100
  },
  {
    label: "请求时间",
    prop: "requestTime",
    minWidth: 100
  },
  {
    label: "请求方法",
    prop: "method",
    minWidth: 100
  },
  {
    label: "请求耗时",
    prop: "takesTime",
    minWidth: 100
  },
  {
    label: "请求接口",
    prop: "url",
    minWidth: 100
  },
  {
    label: "TraceId",
    cellRenderer: () => {
      return (
        <el-tag size="large" class="!text-base">
          text
        </el-tag>
      );
    },
    minWidth: 100
  }
];
</script>

<template>
  <div>
    <el-scrollbar>
      <PureDescriptions
        border
        :data="Array.of(props.data)"
        :columns="columns"
        :column="5"
      />
    </el-scrollbar>
  </div>
</template>
