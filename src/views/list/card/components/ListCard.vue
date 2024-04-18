<script setup lang="ts">
import { computed, PropType } from "vue";
import shopIcon from "@/assets/svg/shop.svg?component";
import laptopIcon from "@/assets/svg/laptop.svg?component";
import serviceIcon from "@/assets/svg/service.svg?component";
import calendarIcon from "@/assets/svg/calendar.svg?component";
import userAvatarIcon from "@/assets/svg/user_avatar.svg?component";
import More2Fill from "@iconify-icons/ri/more-2-fill";

defineOptions({
  name: "ReCard"
});

interface CardProductType {
  type: number;
  isSetup: boolean;
  description: string;
  name: string;
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>
  }
});

const emit = defineEmits(["manage-product", "delete-item"]);

const handleClickManage = (product: CardProductType) => {
  emit("manage-product", product);
};

const handleClickDelete = (product: CardProductType) => {
  emit("delete-item", product);
};

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": !props.product.isSetup }
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logo__disabled": !props.product.isSetup }
]);
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <div :class="cardLogoClass">
          <shopIcon v-if="product.type === 1" />
          <calendarIcon v-if="product.type === 2" />
          <serviceIcon v-if="product.type === 3" />
          <userAvatarIcon v-if="product.type === 4" />
          <laptopIcon v-if="product.type === 5" />
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            :color="product.isSetup ? '#00a870' : '#eee'"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ product.isSetup ? "已启用" : "已停用" }}
          </el-tag>
          <el-dropdown trigger="click" :disabled="!product.isSetup">
            <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
            <template #dropdown>
              <el-dropdown-menu :disabled="!product.isSetup">
                <el-dropdown-item @click="handleClickManage(product)">
                  管理
                </el-dropdown-item>
                <el-dropdown-item @click="handleClickDelete(product)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-row>
      <p class="list-card-item_detail--name text-text_color_primary">
        {{ product.name }}
      </p>
      <p class="list-card-item_detail--desc text-text_color_regular">
        {{ product.description }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      font-size: 26px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
