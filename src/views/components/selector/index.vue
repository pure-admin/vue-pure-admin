<template>
  <div>
    <el-card
      class="box-card"
      style="margin: 10px"
      v-for="(item, key) in dataLists"
      :key="key"
    >
      <template #header>
        <div class="card-header">
          <span>{{ item.title }}</span>
        </div>
      </template>
      <Selector
        :HsKey="key"
        :echo="item.echo"
        @selectedVal="selectedVal"
        :disabled="item.disabled"
      />
      <h4 v-if="!item.disabled">选中范围：{{ selectRange }}</h4>
    </el-card>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Selector from "/@/components/ReSelector";

export default {
  components: { Selector },
  setup() {
    let selectRange = ref(null);
    let dataLists = ref([
      {
        title: "基本使用",
        echo: [],
        disabled: false
      },
      {
        title: "回显模式",
        echo: [2, 7],
        disabled: true
      }
    ]);

    const selectedVal = ({ left, right }) => {
      selectRange.value = `${left}-${right}`;
    };

    return {
      selectedVal,
      selectRange,
      dataLists
    };
  }
};
</script>
