<script lang="ts">
export default {
  name: "ListCard"
};
</script>

<script setup lang="ts">
import { getCardList } from "/@/api/list";
import ReCard from "/@/components/ReCard";
import { ref, onMounted, nextTick } from "vue";
import DialogForm from "./components/DialogForm.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const INITIAL_DATA = {
  name: "",
  status: "",
  description: "",
  type: "",
  mark: ""
};

const pagination = ref({ current: 1, pageSize: 12, total: 0 });

const productList = ref([]);
const dataLoading = ref(true);

const getCardListData = async () => {
  try {
    const { data } = await getCardList();
    productList.value = data.list;
    pagination.value = {
      ...pagination.value,
      total: data.list.length
    };
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

onMounted(() => {
  getCardListData();
});

const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const searchValue = ref("");

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
};
const onCurrentChange = (current: number) => {
  pagination.value.current = current;
};
const handleDeleteItem = product => {
  ElMessageBox.confirm(
    product
      ? `确认删除后${product.name}的所有产品信息将被清空, 且无法恢复`
      : "",
    "提示",
    {
      type: "warning"
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
    })
    .catch(() => {});
};
const handleManageProduct = product => {
  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = { ...product, status: product?.isSetup ? "1" : "0" };
  });
};
</script>

<template>
  <div>
    <div class="list-card-operation">
      <el-button @click="formDialogVisible = true"> 新建产品 </el-button>
      <div class="search-input">
        <el-input
          v-model="searchValue"
          placeholder="请输入你需要搜索的内容"
          clearable
        >
          <template #suffix>
            <el-icon class="el-input__icon">
              <IconifyIconOffline v-if="searchValue === ''" icon="search" />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <div
      v-loading="dataLoading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <template v-if="pagination.total > 0">
        <div class="list-card-items">
          <el-row :gutter="16">
            <el-col
              v-for="product in productList.slice(
                pagination.pageSize * (pagination.current - 1),
                pagination.pageSize * pagination.current
              )"
              :key="product.index"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <ReCard
                class="list-card-item"
                :product="product"
                @delete-item="handleDeleteItem"
                @manage-product="handleManageProduct"
              />
            </el-col>
          </el-row>
        </div>
        <div class="list-card-pagination">
          <el-pagination
            v-model:currentPage="pagination.current"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[12, 24, 36]"
            layout="total, sizes, prev, pager, next"
            @size-change="onPageSizeChange"
            @current-change="onCurrentChange"
          />
        </div>
      </template>
    </div>
    <DialogForm v-model:visible="formDialogVisible" :data="formData" />
  </div>
</template>

<style scoped lang="scss">
.list-card {
  &-operation {
    display: flex;
    justify-content: space-between;

    .search-input {
      width: 360px;
    }
  }

  &-items {
    margin: 14px 0 24px 0;
  }

  &-pagination {
    padding: 16px;
  }
}
</style>
