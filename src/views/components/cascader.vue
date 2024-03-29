<script setup lang="ts">
import {
  provinceAndCityDataPlus,
  provinceAndCityData,
  convertTextToCode,
  regionDataPlus,
  regionData,
  CodeToText
} from "@/utils/chinaArea";
import { ref } from "vue";

defineOptions({
  name: "Cascader"
});

const selectedOptions1 = ref(["110000", "110100"]);
const selectedOptions2 = ref(["120000", "120100", "120101"]);
const selectedOptions3 = ref(["130000", ""]);
const selectedOptions4 = ref(["120000", "120100", ""]);

const handleChange = value => {
  console.log(value);
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <p class="font-medium">区域级联选择器</p>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/cascader.vue"
        target="_blank"
      >
        代码位置 src/views/components/cascader.vue
      </el-link>
    </template>
    <el-row :gutter="24">
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <div class="flex flex-col items-center justify-center">
          <span class="text-[var(--el-color-primary)]">
            1. 二级联动（不带“全部”选项）
            <el-cascader
              v-model="selectedOptions1"
              :options="provinceAndCityData"
              @change="handleChange"
            />
          </span>
          <div class="leading-10">
            <div>绑定值：{{ selectedOptions1 }}</div>
            <div>
              区域码转汉字：
              {{ CodeToText[selectedOptions1[0]] }},
              {{ CodeToText[selectedOptions1[1]] }}
            </div>
            <div>
              汉字转区域码：
              {{
                convertTextToCode(
                  CodeToText[selectedOptions1[0]],
                  CodeToText[selectedOptions1[1]]
                )
              }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <div class="flex flex-col items-center justify-center mt-3">
          <span class="text-[var(--el-color-primary)]">
            2. 二级联动（带有“全部”选项）
            <el-cascader
              v-model="selectedOptions3"
              :options="provinceAndCityDataPlus"
              @change="handleChange"
            />
          </span>
          <div class="leading-10">
            <div>绑定值：{{ selectedOptions3 }}</div>
            <div>
              区域码转汉字：
              {{ CodeToText[selectedOptions3[0]] }},
              {{ CodeToText[selectedOptions3[1]] }}
            </div>
            <div>
              汉字转区域码：
              {{
                convertTextToCode(
                  CodeToText[selectedOptions3[0]],
                  CodeToText[selectedOptions3[1]]
                )
              }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <div class="flex flex-col items-center justify-center mt-3">
          <span class="text-[var(--el-color-primary)]">
            3. 三级联动（不带“全部”选项）
            <el-cascader
              v-model="selectedOptions2"
              :options="regionData"
              @change="handleChange"
            />
          </span>
          <div class="leading-10">
            <div>绑定值：{{ selectedOptions2 }}</div>
            <div>
              区域码转汉字：
              {{ CodeToText[selectedOptions2[0]] }},
              {{ CodeToText[selectedOptions2[1]] }},
              {{ CodeToText[selectedOptions2[2]] }}
            </div>
            <div>
              汉字转区域码：
              {{
                convertTextToCode(
                  CodeToText[selectedOptions2[0]],
                  CodeToText[selectedOptions2[1]],
                  CodeToText[selectedOptions2[2]]
                )
              }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <div class="flex flex-col items-center justify-center mt-3">
          <span class="text-[var(--el-color-primary)]">
            4. 三级联动（带"全部选项"）
            <el-cascader
              v-model="selectedOptions4"
              :options="regionDataPlus"
              @change="handleChange"
            />
          </span>
          <div class="leading-10">
            <div>绑定值：{{ selectedOptions4 }}</div>
            <div>
              区域码转汉字：
              {{ CodeToText[selectedOptions4[0]] }},
              {{ CodeToText[selectedOptions4[1]] }},
              {{ CodeToText[selectedOptions4[2]] }}
            </div>
            <div>
              汉字转区域码：
              {{
                convertTextToCode(
                  CodeToText[selectedOptions4[0]],
                  CodeToText[selectedOptions4[1]],
                  CodeToText[selectedOptions4[2]]
                )
              }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
