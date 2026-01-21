<template>
  <el-card
    shadow="hover"
    class="award-card border-none relative group shadow-md hover:shadow-lg transition-all"
  >
    <div
      v-if="isAdmin"
      class="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
    >
      <el-button
        type="primary"
        size="small"
        :icon="Edit"
        circle
        @click="handleEdit"
      />
    </div>
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-44 h-60 shrink-0 mb-4 sm:mb-0 relative">
        <el-image
          class="w-full h-full rounded-lg border shadow-sm"
          :src="award.certificate_details?.image_uri"
          :preview-src-list="[award.certificate_details?.image_uri]"
          fit="cover"
          preview-teleported
        >
          <template #error>
            <div
              class="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400"
            >
              <el-icon :size="30"><Picture /></el-icon>
              <span class="text-xs mt-2">暂无证书图片</span>
            </div>
          </template>
        </el-image>
      </div>

      <div class="sm:ml-6 grow flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-lg font-bold text-gray-800 leading-tight mb-1">
              {{ award.competition_details?.title || award.competition_name }}
            </h3>
            <div class="flex gap-2">
              <el-tag size="small" effect="plain" type="info"
                >{{ award.competition_details?.year }}年</el-tag
              >
              <el-tag size="small" effect="plain"
                >{{ award.competition_details?.level?.name }}级赛事</el-tag
              >
            </div>
          </div>
          <el-tag :type="getLevelTag(award.award_level)" effect="dark">{{
            award.award_level
          }}</el-tag>
        </div>

        <div class="grid grid-cols-1 gap-1.5 text-sm mt-2">
          <div class="flex items-center text-gray-600">
            <span class="w-20 shrink-0 text-gray-400">证书编号:</span>
            <span class="text-gray-900 font-mono">{{
              award.certificate_details?.cert_no || "审核中"
            }}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <span class="w-20 shrink-0 text-gray-400">获奖日期:</span>
            <span class="text-gray-900">{{ award.award_date }}</span>
          </div>
          <el-divider class="my-3" />

          <div class="mb-2">
            <span class="text-gray-400 text-xs block mb-1.5">团队成员</span>
            <div class="flex flex-wrap gap-2">
              <el-popover
                v-for="p in award.participant_details"
                :key="p.user_id"
                placement="top"
                :width="240"
                trigger="hover"
              >
                <template #reference>
                  <el-tag
                    size="default"
                    :effect="isMe(p.user_id) ? 'light' : 'plain'"
                    :type="isMe(p.user_id) ? 'primary' : 'info'"
                    class="cursor-help"
                  >
                    {{ p.profile?.real_name || p.user_id }}
                  </el-tag>
                </template>
                <div class="profile-popover text-xs">
                  <p class="font-bold text-sm mb-1">
                    {{ p.profile?.real_name }}
                  </p>
                  <p>学号：{{ p.user_id }}</p>
                  <p>学院：{{ p.profile?.department }}</p>
                  <p>专业：{{ p.profile?.major }}</p>
                </div>
              </el-popover>
            </div>
          </div>

          <div>
            <span class="text-gray-400 text-xs block mb-1.5">指导教师</span>
            <div class="flex flex-wrap gap-2">
              <el-popover
                v-for="ins in award.instructor_details"
                :key="ins.user_id"
                placement="top"
                :width="200"
                trigger="hover"
              >
                <template #reference>
                  <el-tag
                    size="default"
                    type="warning"
                    plain
                    class="cursor-help"
                  >
                    {{ ins.profile?.real_name || ins.user_id }}
                  </el-tag>
                </template>
                <div class="text-xs">
                  <p class="font-bold">{{ ins.profile?.real_name }}</p>
                  <p>工号：{{ ins.user_id }}</p>
                  <p>职称：{{ ins.profile?.title || "教师" }}</p>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { Edit, Picture } from "@element-plus/icons-vue";
import { computed } from "vue";

// 定义组件 Props
const props = defineProps<{
  award: any;
  currentUserId?: string;
}>();

// 定义事件
const emit = defineEmits(["edit"]);

const userStore = useUserStore();

// 权限判断
const isAdmin = computed(() =>
  userStore.roles?.includes("CompetitionAdministrator")
);

const handleEdit = () => {
  emit("edit", props.award);
};

const isMe = (userId: string) => userId === props.currentUserId;

const getLevelTag = (level: string) => {
  if (/特等奖|金奖|冠军|一等奖/.test(level)) return "danger";
  if (/二等奖|银奖/.test(level)) return "warning";
  if (/三等奖|铜奖/.test(level)) return "success";
  return "info";
};
</script>

<style scoped>
.award-card {
  --el-card-padding: 24px;
}

.transition-all:hover {
  transform: translateY(-4px);
}
</style>
