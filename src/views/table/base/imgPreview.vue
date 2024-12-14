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
      <video
        width="180"
        height="180"
        controls
        muted
        poster="http://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg"
      >
        <source
          src="http://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4"
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
