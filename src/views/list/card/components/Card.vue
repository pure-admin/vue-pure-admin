<script setup lang="ts">
import { computed, PropType } from "vue";
import shopIcon from "/@/assets/svg/shop.svg?component";
import laptopIcon from "/@/assets/svg/laptop.svg?component";
import serviceIcon from "/@/assets/svg/service.svg?component";
import calendarIcon from "/@/assets/svg/calendar.svg?component";
import userAvatarIcon from "/@/assets/svg/user_avatar.svg?component";

export interface CardProductType {
  type: number;
  isSetup: boolean;
  description: string;
  name: string;
}

defineOptions({
  name: "ReCard"
});

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
    <div class="list-card-item_detail">
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
          <el-dropdown
            trigger="click"
            :disabled="!product.isSetup"
            max-height="2"
          >
            <IconifyIconOffline icon="more-vertical" class="icon-more" />
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
      <p class="list-card-item_detail--name">{{ product.name }}</p>
      <p class="list-card-item_detail--desc">{{ product.description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
$text-color-disabled: rgba(0, 0, 0, 0.26);

.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);

  &_detail {
    flex: 1;
    background: #fff;
    padding: 24px 32px;
    min-height: 140px;

    &--logo {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #e0ebff;
      font-size: 32px;
      color: #0052d9;

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

    .icon-more {
      font-size: 24px;
      color: rgba(36, 36, 36, 1);
    }

    &--name {
      margin: 24px 0 8px 0;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.9);
    }

    &--desc {
      font-size: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 24px;
      height: 40px;
    }
  }

  &__disabled {
    color: $text-color-disabled;

    .icon-more {
      color: $text-color-disabled;
    }

    .list-card-item_detail--name {
      color: $text-color-disabled;
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
