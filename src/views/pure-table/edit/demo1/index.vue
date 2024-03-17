<script setup lang="ts">
import { useColumns } from "./columns";
import Empty from "../empty.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ep/plus";
import Delete from "@iconify-icons/ep/delete";

const { columns, dataList, onAdd, onDel } = useColumns();
</script>

<template>
  <div class="flex">
    <el-scrollbar height="700px">
      <code>
        <pre class="w-[700px]"> {{ dataList }}</pre>
      </code>
    </el-scrollbar>
    <pure-table
      align-whole="center"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      row-key="id"
      :data="dataList"
      :columns="columns"
    >
      <template #empty>
        <Empty fill="var(--el-svg-monochrome-grey)" class="m-auto" />
      </template>
      <template #append>
        <el-button
          plain
          class="w-full my-2"
          :icon="useRenderIcon(AddFill)"
          @click="onAdd"
        >
          添加一行数据
        </el-button>
      </template>
      <template #operation="{ row }">
        <el-button
          class="reset-margin"
          link
          type="primary"
          :icon="useRenderIcon(Delete)"
          @click="onDel(row)"
        />
      </template>
    </pure-table>
  </div>
</template>
