<template>
  <div class="p-4">
    <el-card shadow="never" class="mb-6">
      <EventListAdmin v-if="isAdmin" />
      <EventListUser v-else @on-registered="refreshTeams" />
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span class="font-bold">{{
          isAdmin ? "报名数据管理" : "我的团队"
        }}</span>
      </template>
      <TeamsAdmin v-if="isAdmin" ref="adminTeamsRef" />
      <TeamsUser v-else ref="userTeamsRef" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import EventListUser from "./components/EventListUser.vue";
import EventListAdmin from "./components/EventListAdmin.vue";
import TeamsUser from "./components/TeamsUser.vue";
import TeamsAdmin from "./components/TeamsAdmin.vue";

const userStore = useUserStoreHook();
const isAdmin = computed(() =>
  userStore.roles.includes("CompetitionAdministrator")
);

const adminTeamsRef = ref();
const userTeamsRef = ref();

const refreshTeams = () => {
  if (isAdmin.value) adminTeamsRef.value?.refresh();
  else userTeamsRef.value?.refresh();
};
</script>
