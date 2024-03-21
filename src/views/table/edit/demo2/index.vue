<script setup lang="ts">
import { useColumns } from "./columns";

const { editMap, columns, dataList, onEdit, onSave, onCancel } = useColumns();
</script>

<template>
  <div class="flex">
    <el-scrollbar>
      <code>
        <pre class="w-[400px]"> {{ dataList }}</pre>
      </code>
    </el-scrollbar>
    <pure-table
      row-key="id"
      align-whole="center"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      :data="dataList"
      :columns="columns"
    >
      <template #operation="{ row, index }">
        <el-button
          v-if="!editMap[index]?.editable"
          class="reset-margin"
          link
          type="primary"
          @click="onEdit(row, index)"
        >
          修改
        </el-button>
        <div v-else>
          <el-button
            class="reset-margin"
            link
            type="primary"
            @click="onSave(index)"
          >
            保存
          </el-button>
          <el-button class="reset-margin" link @click="onCancel(index)">
            取消
          </el-button>
        </div>
      </template>
    </pure-table>
  </div>
</template>
