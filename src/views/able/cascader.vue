<script setup lang="ts">
import {
  provinceAndCityDataPlus,
  provinceAndCityData,
  convertTextToCode,
  regionDataPlus,
  regionData,
  CodeToText
} from "/@/utils/chinaArea";
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
  <el-card>
    <template #header> 区域级联选择器 </template>
    <el-row :gutter="20">
      <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
        <div class="flex flex-col items-center justify-center">
          <span class="imp">
            1. 二级联动（不带“全部”选项）
            <el-cascader
              :options="provinceAndCityData"
              v-model="selectedOptions1"
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
          <span class="imp">
            2. 二级联动（带有“全部”选项）
            <el-cascader
              :options="provinceAndCityDataPlus"
              v-model="selectedOptions3"
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
          <span class="imp">
            3. 三级联动（不带“全部”选项）
            <el-cascader
              :options="regionData"
              v-model="selectedOptions2"
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
          <span class="imp">
            4. 三级联动（带"全部选项"）
            <el-cascader
              :options="regionDataPlus"
              v-model="selectedOptions4"
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

<style scoped lang="scss">
.imp {
  color: var(--el-color-primary);
}
</style>
