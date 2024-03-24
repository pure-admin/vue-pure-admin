<script setup lang="ts">
import { tableDataImage } from "./data";

const columns: TableColumnList = [
  {
    label: "日期",
    prop: "date"
  },
  {
    label: "姓名",
    prop: "name"
  },
  {
    label: "地址",
    prop: "address"
  },
  {
    label: "视频",
    slot: "video"
  },
  {
    label: "图像",
    slot: "image"
  }
];
</script>

<template>
  <pure-table :data="tableDataImage" :columns="columns">
    <template #video>
      <video width="180" height="180" controls>
        <source
          src="https://yiming_chang.gitee.io/pure-admin-doc/video/url.mov"
          type="video/mp4"
        />
      </video>
    </template>
    <template #image="{ row, index }">
      <el-image
        preview-teleported
        loading="lazy"
        :src="row.image"
        :preview-src-list="tableDataImage.map(v => v.image)"
        :initial-index="index"
        fit="cover"
        class="w-[100px] h-[100px]"
      />
    </template>
  </pure-table>
</template>
