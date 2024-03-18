<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, dataList } = useColumns();
</script>

<template>
  <div class="flex">
    <el-scrollbar>
      <code>
        <pre class="w-[400px]"> {{ dataList }}</pre>
      </code>
    </el-scrollbar>
    <pure-table
      class="!w-[30vw]"
      row-key="id"
      border
      :data="dataList"
      :columns="columns"
    />
  </div>
</template>
