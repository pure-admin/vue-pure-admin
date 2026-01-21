<template>
  <el-tooltip
    v-if="item.status === 'success'"
    content="点击可重新搜索修正"
    placement="top"
  >
    <el-tag
      :type="type === 'student' ? 'success' : 'warning'"
      effect="plain"
      class="cursor-pointer hover:shadow-sm"
      @click="$emit('search')"
    >
      {{ realName }}
      <el-icon class="ml-1 opacity-50"><Edit /></el-icon>
    </el-tag>
  </el-tooltip>

  <el-select
    v-else-if="item.status === 'multiple'"
    :model-value="item.selected_id"
    placeholder="请选择"
    size="small"
    class="w-32"
    @change="handleSelectChange"
  >
    <el-option
      v-for="opt in item.options"
      :key="opt.user_id"
      :label="`${opt.real_name} (${opt.user_id})`"
      :value="opt.user_id"
    />
  </el-select>

  <el-tooltip v-else content="点击搜索并修正" placement="top">
    <el-tag
      type="danger"
      class="cursor-pointer hover:opacity-80"
      @click="$emit('search')"
    >
      {{ item.origin_name }} <el-icon><Search /></el-icon>
    </el-tag>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Search, Edit } from "@element-plus/icons-vue";

const props = defineProps<{
  item: any;
  type: "student" | "teacher";
}>();

const emit = defineEmits(["search", "update:selected_id", "change"]);

const realName = computed(() => {
  if (props.item.selected_id && props.item.options?.length) {
    const opt = props.item.options.find(
      (o: any) => o.user_id == props.item.selected_id
    );
    return opt ? opt.real_name : props.item.origin_name;
  }
  return props.item.options?.[0]?.real_name || props.item.origin_name;
});
const handleSelectChange = (val: any) => {
  // 不直接修改 item.selected_id
  // 而是通知父组件：我想把这个 ID 改成 val
  emit("change", val);
};
</script>
