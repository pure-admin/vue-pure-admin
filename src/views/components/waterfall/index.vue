<script setup lang="ts">
import { getList } from "./api";
import error from "./error.png";
import loading from "./loading.png";
import { onMounted, reactive, ref } from "vue";
import "vue-waterfall-plugin-next/dist/style.css";
import backTop from "@/assets/svg/back_top.svg?component";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";

const options = reactive({
  // 唯一key值
  rowKey: "id",
  // 卡片之间的间隙
  gutter: 10,
  // 是否有周围的gutter
  hasAroundGutter: true,
  // 卡片在PC上的宽度
  width: 320,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    1200: {
      // 当屏幕宽度小于等于1200
      rowPerView: 4
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2
    }
  },
  // 动画效果
  animationEffect: "animate__fadeInUp",
  // 动画时间
  animationDuration: 1000,
  // 动画延迟
  animationDelay: 300,
  // 背景色
  // backgroundColor: "#2C2E3A",
  // 图片字段选择器，如果层级较深，使用 xxx.xxx.xxx 方式
  imgSelector: "src.original",
  // 加载配置
  loadProps: {
    loading,
    error
  },
  // 是否懒加载
  lazyload: true
});

const page = ref(1);
const list = ref([]);
const pageSize = ref();

/** 加载更多 */
function handleLoadMore() {
  getList({
    page: page.value,
    pageSize: pageSize.value
  }).then(res => {
    list.value.push(...res);
    page.value += 1;
  });
}

function handleDelete(item, index) {
  list.value.splice(index, 1);
}

function handleClick(item) {
  console.log(item);
}

onMounted(() => {
  handleLoadMore();
});
</script>

<template>
  <el-card shadow="never" class="!h-[85vh]">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          瀑布流组件，采用开源的
          <el-link
            href="https://github.com/heikaimu/vue3-waterfall-plugin"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            vue-waterfall-plugin-next
          </el-link>
        </span>
      </div>
    </template>
    <el-scrollbar height="78vh" class="content">
      <Waterfall :list="list" v-bind="options">
        <template #item="{ item, url, index }">
          <div
            class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
            @click="handleClick(item)"
          >
            <div class="overflow-hidden">
              <LazyImg
                :url="url"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
              />
            </div>
            <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
              <h4 class="pb-4 text-gray-50 group-hover:text-yellow-300">
                {{ item.name }}
              </h4>
              <div
                class="pt-3 flex justify-between items-center border-t border-t-gray-600 border-opacity-50"
              >
                <div class="text-gray-50">$ {{ item.price }}</div>
                <div>
                  <button
                    class="px-3 h-7 rounded-full bg-red-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-red-600"
                    @click.stop="handleDelete(item, index)"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>

      <div class="flex justify-center py-10">
        <button
          class="px-5 py-2 rounded-full bg-gray-700 text-md text-white cursor-pointer hover:bg-gray-800 transition-all duration-300"
          @click="handleLoadMore"
        >
          加载更多
        </button>
      </div>

      <el-backtop
        title="回到顶部"
        :right="35"
        :visibility-height="400"
        target=".content .el-scrollbar__wrap"
      >
        <backTop />
      </el-backtop>
    </el-scrollbar>
  </el-card>
</template>
