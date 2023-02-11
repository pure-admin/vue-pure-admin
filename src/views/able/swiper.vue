<script setup lang="ts">
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";

defineOptions({
  name: "Swiper"
});

SwiperCore.use([Autoplay, Navigation, Pagination]);

const swiperExample: any[] = [
  { id: 0, label: "Default", options: {} },
  {
    id: 1,
    label: "Navigation",
    options: {
      navigation: true
    }
  },
  {
    id: 2,
    label: "Pagination",
    options: {
      pagination: true
    }
  },
  {
    id: 3,
    label: "Pagination dynamic",
    options: {
      pagination: { dynamicBullets: true }
    }
  },
  {
    id: 4,
    label: "Pagination progress",
    options: {
      navigation: true,
      pagination: {
        type: "progressbar"
      }
    }
  },
  {
    id: 5,
    label: "Pagination fraction",
    options: {
      navigation: true,
      pagination: {
        type: "fraction"
      }
    }
  },
  {
    id: 6,
    label: "Slides per view",
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
    label: "Infinite loop",
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
        Swiper插件（
        <el-link
          href="https://github.com/nolimits4web/swiper"
          target="_blank"
          style="font-size: 16px; margin: 0 5px 4px 0"
        >
          github地址
        </el-link>
        ）
      </div>
    </template>
    <el-row :gutter="10">
      <el-col v-for="item in swiperExample" :key="item.id" :span="12">
        <h6 class="py-[24px] text-[24px] font-bold">{{ item.label }}</h6>
        <swiper v-bind="item.options">
          <swiper-slide v-for="i in 5" :key="i">
            <div
              class="flex justify-center items-center h-[240px] border-[1px] border-[#999] text-[18px] font-bold"
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
