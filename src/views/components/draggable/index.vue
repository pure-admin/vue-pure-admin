<script setup lang="ts">
import { ref, onMounted } from "vue";
import draggable from "vuedraggable/src/vuedraggable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "Draggable"
});

let gridLists = ref<Array<Object>>([
  { grid: "cn", num: 1 },
  { grid: "cn", num: 2 },
  { grid: "cn", num: 3 },
  { grid: "cn", num: 4 },
  { grid: "cn", num: 5 },
  { grid: "cn", num: 6 },
  { grid: "cn", num: 7 },
  { grid: "cn", num: 8 },
  { grid: "cn", num: 9 }
]);

let lists = ref<Array<Object>>([
  { people: "cn", id: 1, name: "www.itxst.com" },
  { people: "cn", id: 2, name: "www.baidu.com" },
  { people: "cn", id: 3, name: "www.taobao.com" },
  { people: "cn", id: 4, name: "www.google.com" }
]);

let cutLists = ref([
  { people: "cn", id: 1, name: "cut1" },
  { people: "cn", id: 2, name: "cut2" },
  { people: "cn", id: 3, name: "cut3" },
  { people: "cn", id: 4, name: "cut4" }
]);

const change = (evt): void => {
  console.log("evt: ", evt);
};

onMounted(() => {
  // 使用原生sortable实现元素位置切换
  // @ts-ignore
  new Sortable(document.querySelector(".cut-container"), {
    swap: true,
    forceFallback: true,
    chosenClass: "chosen",
    swapClass: "highlight",
    animation: 300
  });
});
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>
          拖拽组件，采用开源的
          <el-link
            href="https://sortablejs.github.io/vue.draggable.next/#/simple"
            target="_blank"
            :icon="useRenderIcon('rank')"
            style="font-size: 16px; margin: 0 4px 5px"
          >
            vuedraggable
          </el-link>
        </span>
      </div>
    </template>
    <div class="drag-container">
      <!-- grid列表拖拽 -->
      <el-row :gutter="25">
        <el-col :xs="25" :sm="8" :md="8" :lg="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>grid列表拖拽</span>
              </div>
            </template>
            <draggable
              v-model="gridLists"
              class="grid-container"
              item-key="grid"
              animation="300"
              chosenClass="chosen"
              forceFallback="true"
            >
              <template #item="{ element }">
                <div :class="'item' + ' ' + 'item-' + element.num">
                  {{ element.num }}
                </div>
              </template>
            </draggable>
          </el-card>
        </el-col>

        <el-col :xs="25" :sm="8" :md="8" :lg="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>单列拖拽</span>
              </div>
            </template>
            <!-- 单列拖拽 -->
            <draggable
              v-model="lists"
              item-key="name"
              @change="change"
              chosen-class="chosen"
              force-fallback="true"
              animation="300"
            >
              <template #item="{ element, index }">
                <div class="item-single">{{ element.name }} {{ index }}</div>
              </template>
            </draggable>
          </el-card>
        </el-col>

        <el-col :xs="25" :sm="8" :md="8" :lg="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>拖拽实现元素位置切换</span>
              </div>
            </template>
            <!-- 拖拽实现元素位置切换 -->
            <div class="cut-container">
              <div
                class="item-cut"
                v-for="(item, index) in cutLists"
                :key="index"
              >
                <p>{{ item.name }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
/* grid列表拖拽 */
.grid-container {
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.3%;
  grid-template-rows: 33.3% 33.3% 33.3%;
}

.item-single {
  font-size: 1.5em;
  height: 77px;
  text-align: center;
  line-height: 85px;
  border: 1px solid #e5e4e9;
  cursor: move;
}

.item-cut {
  font-size: 1.5em;
  height: 77px;
  line-height: 77px;
  text-align: center;
  border: 1px solid #e5e4e9;
  cursor: move;
}

.item {
  font-size: 2em;
  text-align: center;
  line-height: 100px;
  border: 1px solid #e5e4e9;
  cursor: move;
  @media screen and (max-width: 750px) {
    line-height: 90px;
  }
}

.item-1 {
  background-color: #ef342a;
}

.item-2 {
  background-color: #f68f26;
}

.item-3 {
  background-color: #4ba946;
}

.item-4 {
  background-color: #0376c2;
}

.item-5 {
  background-color: #c077af;
}

.item-6 {
  background-color: #f8d29d;
}

.item-7 {
  background-color: #b5a87f;
}

.item-8 {
  background-color: #d0e4a9;
}

.item-9 {
  background-color: #4dc7ec;
}

.chosen {
  border: solid 2px #3089dc !important;
}
</style>
