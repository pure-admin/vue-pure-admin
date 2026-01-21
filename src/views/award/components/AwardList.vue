<template>
  <div v-loading="loading">
    <el-empty v-if="awards.length === 0" description="暂无获奖记录" />
    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <AwardCard
        v-for="item in awards"
        :key="item.id"
        :award="item"
        :currentUserId="currentUserId"
        @edit="$emit('edit', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AwardCard from "./AwardCard.vue";

defineProps<{
  awards: any[];
  loading: boolean;
  currentUserId?: string;
}>();
</script>
