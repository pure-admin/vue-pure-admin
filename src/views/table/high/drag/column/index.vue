<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, dataList, columnsDrag } = useColumns();
</script>

<template>
  <div class="flex">
    <el-scrollbar height="700px">
      <code>
        <pre class="w-[700px]"> {{ columnsDrag }}</pre>
      </code>
    </el-scrollbar>
    <pure-table row-key="id" :data="dataList" :columns="columns" />
  </div>
</template>
