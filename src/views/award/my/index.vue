<template>
  <div class="main p-4">
    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">我的获奖记录</span>
          <el-button
            :icon="useRenderIcon('refresh')"
            circle
            @click="loadData"
          />
        </div>
      </template>

      <div v-loading="loading">
        <el-empty
          v-if="awards.length === 0"
          description="暂无获奖记录，继续加油哦！"
        />

        <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <el-card
            v-for="item in awards"
            :key="item.id"
            shadow="hover"
            class="border-none shadow-md hover:shadow-lg transition-all"
          >
            <div class="flex flex-col sm:flex-row">
              <div
                class="w-full sm:w-40 h-56 shrink-0 mb-4 sm:mb-0 bg-gray-50 rounded-lg overflow-hidden border"
              >
                <el-image
                  style="width: 100%; height: 100%"
                  :src="item.certificate_details?.image_uri"
                  :preview-src-list="[item.certificate_details?.image_uri]"
                  fit="contain"
                  preview-teleported
                >
                  <template #error>
                    <div
                      class="flex flex-col items-center justify-center h-full text-gray-400"
                    >
                      <el-icon :size="30"><Picture /></el-icon>
                      <span class="text-xs mt-2">证书加载失败</span>
                    </div>
                  </template>
                </el-image>
              </div>

              <div class="sm:ml-6 grow">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-bold text-gray-800 leading-tight">
                    {{ item.competition_name }}
                  </h3>
                  <el-tag :type="getLevelTag(item.award_level)" effect="dark">
                    {{ item.award_level }}
                  </el-tag>
                </div>

                <div class="grid grid-cols-1 gap-2 text-sm">
                  <div class="flex items-center text-gray-600">
                    <span class="w-20 shrink-0">证书编号：</span>
                    <span class="text-gray-900 font-mono">{{
                      item.certificate_details?.cert_no || "未录入"
                    }}</span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <span class="w-20 shrink-0">获奖日期：</span>
                    <span class="text-gray-900">{{ item.award_date }}</span>
                  </div>
                  <el-divider class="my-2" />

                  <div>
                    <span class="text-gray-500 text-xs block mb-1"
                      >团队成员</span
                    >
                    <div class="flex flex-wrap gap-1">
                      <el-tag
                        v-for="p in item.participant_details"
                        :key="p.user_id"
                        size="small"
                        round
                        :effect="isMe(p.user_id) ? 'light' : 'plain'"
                        :type="isMe(p.user_id) ? 'primary' : 'info'"
                      >
                        {{ p.user_id }}
                      </el-tag>
                    </div>
                  </div>

                  <div class="mt-1">
                    <span class="text-gray-500 text-xs block mb-1"
                      >指导教师</span
                    >
                    <div class="flex flex-wrap gap-1">
                      <el-tag
                        v-for="ins in item.instructor_details"
                        :key="ins.user_id"
                        size="small"
                        type="warning"
                        plain
                      >
                        {{ ins.user_id }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Picture } from "@element-plus/icons-vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getMyAwards } from "@/api/award";
import { message } from "@/utils/message";
import { getUserProfile } from "@/api/user";
import form from "element-plus/es/components/form/index.mjs";

const loading = ref(false);
const awards = ref([]);

const isMe = (userId: string) => {
  // 优先使用接口获取到的 user_id 进行比对
  return userId === form.value.user_id;
};

/** 也可以在 loadProfile 成功后，同步更新全局状态或本地变量 */
const loadProfile = async () => {
  try {
    const res = await getUserProfile();
    if (res) {
      form.value = { ...form.value, ...res };
      // 这里的 real_name 就是我们要找的用户真实姓名
      console.log("当前登录用户：", form.value.real_name);
    }
  } catch (e) {
    console.error("加载个人资料失败", e);
  }
};

/** 根据奖项等级返回颜色 */
const getLevelTag = (level: string) => {
  if (/特等奖|金奖|冠军/.test(level)) return "danger";
  if (/一等奖|银奖/.test(level)) return "warning";
  if (/二等奖|铜奖/.test(level)) return "success";
  return "info";
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getMyAwards();
    awards.value = Array.isArray(res) ? res : (res as any).data;
  } catch (e) {
    message("加载获奖记录失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  // 并行请求：个人资料 和 获奖列表
  await Promise.all([
    loadProfile(),
    loadData() // 这里的 loadData 是指获取获奖列表的函数
  ]);
  loading.value = false;
});
</script>

<style scoped>
.el-card {
  --el-card-padding: 20px;
}

/* 卡片悬浮微动动画 */
.transition-all:hover {
  transform: translateY(-2px);
}
</style>
