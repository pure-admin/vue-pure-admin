<script setup lang="ts">
import { ref, computed } from "vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";

const items = ref([]);
const search = ref("");

for (let i = 0; i < 800; i++) {
  items.value.push({
    id: i
  });
}

const filteredItems = computed(() => {
  if (!search.value) return items.value;
  const lowerCaseSearch = search.value;
  return items.value.filter(i => i.id == lowerCaseSearch);
});
</script>

<template>
  <div class="dynamic-scroller-demo">
    <div class="flex-ac mb-4 shadow-2xl">
      垂直模式 vertical
      <el-input
        class="!w-[350px]"
        clearable
        v-model="search"
        placeholder="Filter..."
      />
    </div>

    <DynamicScroller
      :items="filteredItems"
      :min-item-size="54"
      class="scroller"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.id]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
          class="message"
        >
          <div class="flex items-center">
            <IconifyIconOnline
              icon="openmoji:beaming-face-with-smiling-eyes"
              width="40"
            />
            <span>{{ item.id }}</span>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped>
.dynamic-scroller-demo {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroller {
  flex: auto 1 1;
}

.message {
  box-sizing: border-box;
  display: flex;
  min-height: 32px;
  padding: 12px;
}
</style>
