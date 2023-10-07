<script setup lang="ts">
import {
  downloadByOnlineUrl,
  downloadByBase64,
  downloadByData,
  downloadByUrl
} from "@pureadmin/utils";
import axios from "axios";

defineOptions({
  name: "Download"
});

const base64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAAAwCAYAAABexZu4AAAAAXNSR0IArs4c6QAAC5pJREFUeF7tnQ9wFNUdx7+/vQQsiOb2orHyp0JuQ/1TpFVbS+2I7RS1aqdlKu2oU2WqQvbQFmtrO7QFpp22U0ZhgNuQInXa6rTFKo5oi3XGPzNqiwIWBDTZS2Boi8aQDQxYId7tr/M2CZNc7u69vdtLLrI7k2GG/b3fe+/3Pvu737597/cIRVw1ydaZEWAmE13MwEwCojj5R+PA/B4IxwA6RuD3uPff3UzYRhneU/X++7s7vn/xe0VUHRYJLTDEAqRqk5qV+2q0senbANwKYKZquVxyBHQy0eNw+XEnYfy9FF0jWbZmjT1bVv/hu4wXZDK57st0V42pbjm04Ly3i9FdzjKnr7bPqiJcWKiOYm2ST6cSxHqyZRkocivA5wVvAH7NMRs+raR34+4xNR1jZ1VrJ7Z1Ji46plSmTEJRy36eACnEbgZX+R00Vd2OaSiNX5lMkFOtbtksq4+BF7pN4yqZnOr9gkbQ19uT8AEeAHCjqkLfckRvOI3xGYXKCa+kRehegL8A4CN9sq8A2qOOWb/Kd50BFFAFLYR4qLGHDWLdap0P0G8DGO+CKgi0rsuMN+YTija1XU/sbs6rhPmPTqLhpnK3M1t/CHFui1eMJ44lW29jooeGAwwm3NLdaDySq67aDZ0T3BOH3wJwbqG2cET7fPeC+peGo739dYQQVzDEsWTbZUzuq8MFhEvpqYcbz9+fqz49aX8bhAcV2rLBMY3bFeQCEwkhrlCI61bsHN8zftyLBFwS2GgXVrTHMY2L8onoVmszQHcqtKWwnnX2BewiKdNDGhLOQmOvTE7cDyGuUIhjVurHDP6ZyiAGJFPQg+pW6jGA58rrYscxG2L55HpfDPG8TI+fl7AQ4gqEONrcdialM6+DaKpssIfcJ7wFF7tAfICAA3DpgKtpaWL3HCLUMXMdiOoYqBs0LcW43UkYG/LVF2tKLWLmNdL2SF7uQoilFgxMYERf7HTL/i6Alb56w+5ykLbFMY1/+innQaW5s92eMasOL556OF/ZM9fan9I0vELA2IL6JQ9DCLGf0SlNduQg3sgR/VDbDoALztcO6p6GC1Xjx1LMEk3avyTCDwvoeMYxjWsK1RFCXMoI+Cs7YhDH1rXNZdd9TLW5THRFd2P8ZVX5UuV6vxhqS7P1EOORyJjI9969Y1pHCHGpVg6m/IhBHG1K/ZyYl6h0g4AlXabxCxXZIGX0ZOoaBl8JwuXE2A7CVsc0HlWpI/TEKlYKRmbEINYt+xkAc2TdYGB7t2lcKpOrtPshxMM3IiMD8VLW9LqUWEzTvyYhb48ZtKDbjP9m+EwSTE0hxMHYUUVLMRDrydQsIDOHNS1GzLUgisHlQwy0E1O7y2gvtIiKate1Xeq67msKDTzomMZEBbnARHx8/p6XK7Q4e317XbonczFAM0C8opSG9aRx9rG7jc5+HZU4TxxN2kkQLijUTw042mUaX5HZQvRPJkPsvugkpi8bKKcKcSRSfZObPrGASbuZgLisLoB2gTObsusT5Uh1ao2AzSqdlzdGXSLfC90QDewu7+9cbfP+j3Km56cswAXE3+nqNeaXzP4QUokQqwAkeqiyhFNFV67VaKrlVJax5hmNIV9nSU/aD4CwWDrQA0CRygYkUAzEymV8trEUiH1WBYpgqcogZ8OoAlAlQOzXHtnyDKS6TcPo/3+KJu3fEeFbMsVM2g3djfVPyeSCvK8M5IAHTLmMz4YWC7HPanyJn6oQ9xnpUcc05nnhRKzJ3syM62XW0zTtskML67cVkvMAKvJiihzMfmlUBjKE2LP6qeKJT3pgjW7tWhj/PelN9itgfFbGXkTTGjoX1tv55JSBK1DREM+S5yNHoZhYb7KXglH0w5SveaEnHmqZYmNiGWs+7j/nmMYXSbdSLQA3yApWE9V1NMbfDSHutYDqi53MrqXcP8XDiV7TMV0rZicOAci7jLHfyHoap6XuNk5UPMSq3tsnPaEnDt4TE/A6AzuI+aWMS97GCNJwtWStzOCGMO4XEEt3p4pSThqnYRRALNqaa7u76nrifGxnT7aHnhgoIZz4mwb6ySEzvj2vU7TsbjGUCr5mJ+lWa5eYLpYJZ0/2Z8tXSkycqx8j+cVOZtdS7o/acEJhuja6ru3L5LpPq9iHopZtq3wxyUQQP7LAaKv0cCKEWD7sI/2xAwoQi17oVuurAF0m65EIJ8SC9s/IBDMuLjmyyNgRQuzzxY6wDK7rK8kJk3blh/pjhzLE9p8AfEPGpoD4rwCulQnK9p+F4URuC8rslquUarz9YQ4nej2xfT+Ae2RsUixpP8yEm2WCYLrXScSF0rxXvvxhKi9V3stjVlom5QdD8mSPZEwcQpwDF3VPrLRljqJW62oC3SWHuPhMO8ozICHE3jCEnriXxpjV8lWGtknGJil7O6DVMY3pMoW57ocQ+8uMGULcS5GebJ8DyogNGwUvqrVSl7jggmsi+jUU89PYF9uozUWHnjj0xANw1ZP210GQbkHz3pp1y/6vLN+ZkGOG1Z0wErInI/t+6IlDTzyICeWYuG0+4EqTWvZBrJYuihmdFMFsv1v1Q4hDiIuCONn6HRBJU/d6EEct+xYC/qDoYQvmPQtj4sEWKCYEC2Pi/hc7tbRqHsQ1a/d+TNOqc2amzAWl3yTJoSeuLE9M5E7qapwuQsi8l8qYFb12QjGciFn2DgY+KXOuJ78kRS17LQHK8a7ogKZpa7oW1j8uq0TFIEJHueaJo02pz4mVUrJ2QpIOa2B5VW85zJ5Y7FofL+unSptUxqycEOtrW78EjVTOczl6EmJ9tX0BqrDV/8ZKeo3ALQzaT8StYPdthhZlUBTgKBhTiGDKDFtOiGut9ukuMiJZt+wSCVkulwn1hWAVd2aHbqX2qZ2rQiscM/6DfP3Um+yrwdgis0MpEFf/7/iKQidoKe/9BHYO+qYfs+xfMXCfrPHlul8uTzyhuaW2OqOd3G4vaf/LGvBrYtrbmYinvHNLTmCys8j4R+V7YrUFM14/2F2uRaqeihw99qY77owJGUqLQ4XEAyyS6EiXIXgqchwgo+LB++x4kEBPZjL8Z1Sl94tE67GmFpESYiKY5jNooRJnTM2DII6u2j2Fxpy2FeBzlBQELFQuiEUzfRg3d6+y4rhKDCdE3gnVX70ghq5EiINoAth1rxuyusrnTEUgDelXUmaIN5Z0CtRogFh2SE+go1WyJw6iNe2OadTnXCIYs+wEA2uDqMWPjnJCHLVSdxK42U97BsmOBoi9ROnubhAmFd1PHwUrwBMvdkxjVd51rjHL/hEDw5r9spwQn/Hgv/WqnuNvqHyZzDmOowBiL2xqsheDvbMHy36NJMQMeqLbjH9NdLLwYYyWfaOXHUhhS3/JFmPe5CQaBp3Pobw4SXHeMdpk30yMh4tq6yiBuC/+Ly10GmggRgcIdbls5h9iehrg64qy/+BCe6BhXv+XY6UdB97T7eKeMv1MPZZJ474jdw/d+hQ0xN4AJ+05IIiE4v5ytI0iiAMC+TjAawESx8GJh2LI5R9izBNHVzBhCRgfLxLmQQBLPfHASsTB09URnktEwltKcxlLGriFiZ+PUOS5QlmF+hazi4Ma8x7G6K3nICRUE26LdkXXvPkJqqoSJ6beBHEojsqVBXHMsp9k4AZZUdkG21zlVXXL9sr1JYsUefamyNo54P4eAM8yIg91m9N2eZlFP8i8kxPiHAvCCs4CVWOyc4fxHxHaRXqO30HgbwKketj9QbC7Xqsa25x9MLuSJ87ugAB6rOZewRSZxuBpBExjwlkERAUj3p/3M8QdAL3DQAeBO5h4ezrjPnt00fldPoxaNtGalftqImN7ZgPa5Sz6AHh9AZAB0AJGi0gsThG84HfRU9kaXYRiXYSFvXPAE8E8EUTnEjCRAbHTvb03D3Bmnwt64nCi4V9FVFF0EW+5JTDL+5UXfy4me/+e5EfbC3L/kuHjzx0xZ4ht/EOu/wNFbO2YhmAeMQAAAABJRU5ErkJggg==";

function down() {
  axios
    .get("https://xiaoxian521.github.io/hyperlink/img/pure.png", {
      responseType: "blob"
    })
    .then(({ data }) => {
      downloadByData(data, "test-data.png");
    });
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <span class="font-medium">文件下载功能</span>
    </template>
    <div class="flex flex-wrap">
      <el-button
        @click="
          downloadByOnlineUrl(
            'https://xiaoxian521.github.io/hyperlink/img/pure.png',
            'test-url.png'
          )
        "
      >
        下载在线图片
      </el-button>

      <el-button @click="downloadByBase64(base64, 'test-base64.png')">
        基于 base64 下载图片
      </el-button>

      <el-button
        @click="
          downloadByUrl(
            'https://github.com/xiaoxian521/xiaoxian521/archive/refs/heads/main.zip',
            'xiaoxian521.zip'
          )
        "
      >
        根据文件地址下载文件
      </el-button>

      <el-button @click="down"> 根据后台接口文件流下载 </el-button>
    </div>
  </el-card>
</template>
