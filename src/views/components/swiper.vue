<script setup lang="ts">
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

defineOptions({
  name: "Swiper"
});

SwiperCore.use([Autoplay, Navigation, Pagination]);

const swiperExample: any[] = [
  { id: 0, label: "基础滑动", options: {} },
  {
    id: 1,
    label: "按钮切换",
    options: {
      navigation: true
    }
  },
  {
    id: 2,
    label: "分页器",
    options: {
      pagination: true
    }
  },
  {
    id: 3,
    label: "分页器 / 动态指示点",
    options: {
      pagination: { dynamicBullets: true }
    }
  },
  {
    id: 4,
    label: "分页器 / 进度条",
    options: {
      navigation: true,
      pagination: {
        type: "progressbar"
      }
    }
  },
  {
    id: 5,
    label: "分页器 / 分式",
    options: {
      navigation: true,
      pagination: {
        type: "fraction"
      }
    }
  },
  {
    id: 6,
    label: "一次显示多个Slides",
    options: {
      pagination: {
        clickable: true
      },
      slidesPerView: 3,
      spaceBetween: 30
    }
  },
  {
    id: 7,
    label: "无限循环",
    options: {
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
      navigation: true,
      pagination: {
        clickable: true
      },
      loop: true
    }
  }
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        <el-link
          href="https://github.com/nolimits4web/swiper"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          Swiper插件
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/swiper.vue"
        target="_blank"
      >
        代码位置 src/views/components/swiper.vue
      </el-link>
    </template>
    <el-row :gutter="10">
      <el-col v-for="item in swiperExample" :key="item.id" :span="12">
        <h6 class="py-[16px] text-base">{{ item.label }}</h6>
        <swiper v-bind="item.options">
          <swiper-slide v-for="i in 5" :key="i">
            <div
              class="flex justify-center items-center h-[240px] border border-[#999]"
            >
              Slide{{ i }}
            </div>
          </swiper-slide>
        </swiper>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped lang="scss">
:deep(.el-card__body) {
  padding-top: 0;
}
</style>
