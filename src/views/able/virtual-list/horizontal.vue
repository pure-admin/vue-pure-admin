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
      水平模式 horizontal
      <el-input
        class="mr-2 !w-[1/1.5]"
        clearable
        v-model="search"
        placeholder="Filter..."
        style="width: 300px"
      />
    </div>

    <DynamicScroller
      :items="filteredItems"
      :min-item-size="54"
      direction="horizontal"
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
          :style="{
            width: `${Math.max(130, Math.round((item.id?.length / 20) * 20))}px`
          }"
          class="message"
        >
          <div>
            <IconifyIconOnline
              icon="openmoji:beaming-face-with-smiling-eyes"
              width="40"
            />
            <p class="text-center">{{ item.id }}</p>
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

.notice {
  padding: 24px;
  font-size: 20px;
  color: #999;
}

.message {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 32px;
  padding: 12px;
}
</style>
