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

function onResize() {
  console.log("resize");
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
      />
      <el-tag effect="dark">垂直模式vertical</el-tag>
    </div>

    <DynamicScroller
      :items="filteredItems"
      :min-item-size="54"
      class="scroller"
      @resize="onResize"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.message]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
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

.message {
  display: flex;
  min-height: 32px;
  padding: 12px;
  box-sizing: border-box;
}

.avatar {
  flex: auto 0 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.index,
.text {
  flex: 1;
}

.text {
  max-width: 400px;
}

.index {
  opacity: 0.5;
}

.index span {
  display: inline-block;
  width: 160px;
  text-align: right;
}
</style>
