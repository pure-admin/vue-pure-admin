<script setup lang="ts">
import { ref, computed } from "vue";
import { generateMessage } from "./data";

const items = ref([]);
const search = ref("");

for (let i = 0; i < 10000; i++) {
  items.value.push({
    id: i,
    ...generateMessage()
  });
}

const filteredItems = computed(() => {
  if (!search.value) return items.value;
  const lowerCaseSearch = search.value.toLowerCase();
  return items.value.filter(i =>
    i.message.toLowerCase().includes(lowerCaseSearch)
  );
});

function changeMessage(message) {
  Object.assign(message, generateMessage());
}
</script>

<template>
  <div class="dynamic-scroller-demo">
    <div class="flex justify-around mb-4">
      <el-input
        class="mr-2 !w-1/1.5"
        clearable
        v-model="search"
        placeholder="Filter..."
        style="width: 300px"
      />
      <el-tag effect="dark">水平模式horizontal</el-tag>
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
          :size-dependencies="[item.message]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
          :style="{
            width: `${Math.max(
              130,
              Math.round((item.message.length / 20) * 20)
            )}px`
          }"
          class="message"
          @click="changeMessage(item)"
        >
          <div class="avatar">
            <IconifyIconOnline
              icon="openmoji:beaming-face-with-smiling-eyes"
              width="40"
            />
          </div>
          <div class="text">
            {{ item.message }}
          </div>
          <div class="index">
            <span>{{ item.id }} (id)</span>
            <span>{{ index }} (index)</span>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<style scoped>
.dynamic-scroller-demo {
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  min-height: 32px;
  padding: 12px;
  box-sizing: border-box;
}

.avatar {
  flex: auto 0 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.avatar .image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
}

.index,
.text {
  flex: 1;
}

.text {
  margin-bottom: 12px;
}

.index {
  opacity: 0.5;
}

.index span {
  display: block;
}
</style>
