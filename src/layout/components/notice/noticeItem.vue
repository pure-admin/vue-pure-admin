<script setup lang="ts">
import { ListItem } from "./data";
import { ref, PropType, nextTick } from "vue";

const props = defineProps({
  noticeItem: {
    type: Object as PropType<ListItem>,
    default: () => {}
  }
});

const titleRef = ref(null);
const titleTooltip = ref(false);
const descriptionRef = ref(null);
const descriptionTooltip = ref(false);

function hoverTitle() {
  nextTick(() => {
    titleRef.value?.scrollWidth > titleRef.value?.clientWidth
      ? (titleTooltip.value = true)
      : (titleTooltip.value = false);
  });
}

function hoverDescription(event, description) {
  // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除
  const tempTag = document.createElement("span");
  tempTag.innerText = description;
  tempTag.className = "getDescriptionWidth";
  document.querySelector("body").appendChild(tempTag);
  const currentWidth = (
    document.querySelector(".getDescriptionWidth") as HTMLSpanElement
  ).offsetWidth;
  document.querySelector(".getDescriptionWidth").remove();

  // cellWidth为容器的宽度
  const cellWidth = event.target.offsetWidth;

  // 当文本宽度大于容器宽度两倍时，代表文本显示超过两行
  currentWidth > 2 * cellWidth
    ? (descriptionTooltip.value = true)
    : (descriptionTooltip.value = false);
}
</script>

<template>
  <div
    class="notice-container border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
  >
    <el-avatar
      v-if="props.noticeItem.avatar"
      :size="30"
      :src="props.noticeItem.avatar"
      class="notice-container-avatar"
    />
    <div class="notice-container-text">
      <div class="notice-text-title text-[#000000d9] dark:text-white">
        <el-tooltip
          popper-class="notice-title-popper"
          :disabled="!titleTooltip"
          :content="props.noticeItem.title"
          placement="top-start"
        >
          <div
            ref="titleRef"
            class="notice-title-content"
            @mouseover="hoverTitle"
          >
            {{ props.noticeItem.title }}
          </div>
        </el-tooltip>
        <el-tag
          v-if="props.noticeItem?.extra"
          :type="props.noticeItem?.status"
          size="small"
          class="notice-title-extra"
        >
          {{ props.noticeItem?.extra }}
        </el-tag>
      </div>

      <el-tooltip
        popper-class="notice-title-popper"
        :disabled="!descriptionTooltip"
        :content="props.noticeItem.description"
        placement="top-start"
      >
        <div
          ref="descriptionRef"
          class="notice-text-description"
          @mouseover="hoverDescription($event, props.noticeItem.description)"
        >
          {{ props.noticeItem.description }}
        </div>
      </el-tooltip>
      <div class="notice-text-datetime text-[#00000073] dark:text-white">
        {{ props.noticeItem.datetime }}
      </div>
    </div>
  </div>
</template>

<style>
.notice-title-popper {
  max-width: 238px;
}
</style>
<style scoped lang="scss">
.notice-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 0;
  // border-bottom: 1px solid #f0f0f0;

  .notice-container-avatar {
    margin-right: 16px;
    background: #fff;
  }

  .notice-container-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;

    .notice-text-title {
      display: flex;
      margin-bottom: 8px;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.5715;
      cursor: pointer;

      .notice-title-content {
        flex: 1;
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .notice-title-extra {
        float: right;
        margin-top: -1.5px;
        font-weight: 400;
      }
    }

    .notice-text-description,
    .notice-text-datetime {
      font-size: 12px;
      line-height: 1.5715;
    }

    .notice-text-description {
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .notice-text-datetime {
      margin-top: 4px;
    }
  }
}
</style>
