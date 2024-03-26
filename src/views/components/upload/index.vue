<script setup lang="ts">
import axios from "axios";
import Sortable from "sortablejs";
import UploadForm from "./form.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import type { UploadFile } from "element-plus";
import { getKeyList, extractFields, downloadByData } from "@pureadmin/utils";

import Add from "@iconify-icons/ep/plus";
import Eye from "@iconify-icons/ri/eye-line";
import Delete from "@iconify-icons/ri/delete-bin-7-line";

defineOptions({
  name: "PureUpload"
});

const fileList = ref([]);
const router = useRouter();
const curOpenImgIndex = ref(0);
const dialogVisible = ref(false);

const urlList = computed(() => getKeyList(fileList.value, "url"));
const imgInfos = computed(() => extractFields(fileList.value, "name", "size"));

const getImgUrl = name => new URL(`./imgs/${name}.jpg`, import.meta.url).href;
const srcList = Array.from({ length: 3 }).map((_, index) => {
  return getImgUrl(index + 1);
});

/** 上传文件前校验 */
const onBefore = file => {
  if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    message("只能上传图片");
    return false;
  }
  const isExceed = file.size / 1024 / 1024 > 2;
  if (isExceed) {
    message(`单个图片大小不能超过2MB`);
    return false;
  }
};

/** 超出最大上传数时触发 */
const onExceed = () => {
  message("最多上传3张图片，请先删除在上传");
};

/** 移除上传的文件 */
const handleRemove = (file: UploadFile) => {
  fileList.value.splice(fileList.value.indexOf(file), 1);
};

/** 大图预览 */
const handlePictureCardPreview = (file: UploadFile) => {
  curOpenImgIndex.value = fileList.value.findIndex(img => img.uid === file.uid);
  dialogVisible.value = true;
};

const getUploadItem = () => document.querySelectorAll("#pure-upload-item");

/** 缩略图拖拽排序 */
const imgDrop = uid => {
  const CLASSNAME = "el-upload-list";
  const _curIndex = fileList.value.findIndex(img => img.uid === uid);
  getUploadItem()?.[_curIndex]?.classList?.add(`${CLASSNAME}__item-actions`);
  const wrapper: HTMLElement = document.querySelector(`.${CLASSNAME}`);
  Sortable.create(wrapper, {
    handle: `.${CLASSNAME}__item`,
    onEnd: ({ newIndex, oldIndex }) => {
      const oldFile = fileList.value[oldIndex];
      fileList.value.splice(oldIndex, 1);
      fileList.value.splice(newIndex, 0, oldFile);
      // fix: https://github.com/SortableJS/Sortable/issues/232 (firefox is ok, but chromium is bad. see https://bugs.chromium.org/p/chromium/issues/detail?id=410328)
      getUploadItem().forEach(ele => {
        ele.classList.remove(`${CLASSNAME}__item-actions`);
      });
    }
  });
};

/** 下载图片 */
const onDownload = () => {
  [
    { name: "巴旦木.jpeg", type: "img" },
    { name: "恭喜发财.png", type: "img" },
    { name: "可爱动物.gif", type: "gif" },
    { name: "pure-upload.csv", type: "other" },
    { name: "pure-upload.txt", type: "other" }
  ].forEach(img => {
    axios
      .get(`https://xiaoxian521.github.io/hyperlink/${img.type}/${img.name}`, {
        responseType: "blob"
      })
      .then(({ data }) => {
        downloadByData(data, img.name);
      });
  });
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <el-link
          v-tippy="{
            content: '点击查看详细文档'
          }"
          href="https://element-plus.org/zh-CN/component/upload.html"
          target="_blank"
          style="font-size: 16px; font-weight: 800"
        >
          文件上传
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/components/upload"
        target="_blank"
      >
        代码位置 src/views/components/upload
      </el-link>
    </template>

    <el-button class="mb-4" text bg @click="onDownload">
      点击下载安全文件进行上传测试
    </el-button>
    <p class="mb-4">
      综合示例<span class="text-[14px]">
        （ <span class="text-[red]">自动上传</span>
        、拖拽上传、拖拽排序、设置请求头、上传进度、大图预览、多选文件、最大文件数量、文件类型限制、文件大小限制、删除文件）
      </span>
    </p>
    <p v-show="fileList.length > 0" class="mb-4">
      {{ imgInfos }}
    </p>
    <el-upload
      v-model:file-list="fileList"
      drag
      multiple
      class="pure-upload"
      list-type="picture-card"
      accept="image/jpeg,image/png,image/gif"
      action="https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b"
      :limit="3"
      :headers="{ Authorization: 'eyJhbGciOiJIUzUxMiJ9.admin' }"
      :on-exceed="onExceed"
      :before-upload="onBefore"
    >
      <IconifyIconOffline :icon="Add" class="m-auto mt-4" width="30" />
      <template #file="{ file }">
        <div
          v-if="file.status == 'ready' || file.status == 'uploading'"
          class="mt-[35%] m-auto"
        >
          <p class="font-medium">文件上传中</p>
          <el-progress
            class="mt-2"
            :stroke-width="2"
            :text-inside="true"
            :show-text="false"
            :percentage="file.percentage"
          />
        </div>
        <div v-else @mouseenter.stop="imgDrop(file.uid)">
          <img
            class="el-upload-list__item-thumbnail select-none"
            :src="file.url"
          />
          <span
            id="pure-upload-item"
            :class="[
              'el-upload-list__item-actions',
              fileList.length > 1 && '!cursor-move'
            ]"
          >
            <span
              title="查看"
              class="hover:text-primary"
              @click="handlePictureCardPreview(file)"
            >
              <IconifyIconOffline
                :icon="Eye"
                class="hover:scale-125 duration-100"
              />
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <span title="移除" class="hover:text-[var(--el-color-danger)]">
                <IconifyIconOffline
                  :icon="Delete"
                  class="hover:scale-125 duration-100"
                />
              </span>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <!-- 有时文档没写并不代表没有，多看源码好处多多😝 https://github.com/element-plus/element-plus/tree/dev/packages/components/image-viewer/src （emm...这让我想起刚开始写这个项目时，很多东西只有英文或者没有文档，需要看源码时，想笑🥹。那些美好时光都给这些坑了，giao） -->
    <el-image-viewer
      v-if="dialogVisible"
      :initialIndex="curOpenImgIndex"
      :url-list="urlList"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      @close="dialogVisible = false"
      @switch="index => (curOpenImgIndex = index)"
    />
    <!-- 将自定义内容插入到body里，有了它在图片预览的时候，想插入个分页器或者别的东东在预览区某个位置就很方便咯（用户需求可以很灵活，开源组件库几乎不可能尽善尽美，很多时候寻找别的解决途径或许更好） -->
    <teleport to="body">
      <div
        v-if="fileList[curOpenImgIndex] && dialogVisible"
        effect="dark"
        round
        size="large"
        type="info"
        class="img-name"
      >
        <p class="text-[#fff] dark:text-black">
          {{ fileList[curOpenImgIndex].name }}
        </p>
      </div>
    </teleport>
    <p class="el-upload__tip">
      可拖拽上传最多3张单个不超过2MB且格式为jpeg/png/gif的图片
    </p>
    <el-divider />

    <p class="mb-4 mt-4">
      结合表单校验进行<span class="text-[red]">手动上传</span>
      <span class="text-[14px]">
        （可先打开浏览器控制台找到Network，然后填写表单内容后点击点提交观察请求变化）
      </span>
    </p>
    <div class="flex justify-between">
      <UploadForm />
      <div>
        <p class="text-center">上传接口相关截图</p>
        <el-image
          class="w-[200px] rounded-md"
          :src="srcList[0]"
          :preview-src-list="srcList"
          fit="cover"
        />
      </div>
    </div>
    <el-divider />

    <div class="flex flex-wrap">
      <p>
        裁剪、上传头像请参考
        <span
          class="font-bold text-[18x] cursor-pointer hover:text-[red]"
          @click="router.push({ name: 'SystemUser' })"
        >
          系统管理-用户管理
        </span>
        表格操作栏中的上传头像功能
      </p>
      <p class="text-[red] text-[12px] flex flex-auto items-center justify-end">
        免责声明：上传接口使用免费开源的
        <el-link
          href="https://designer.mocky.io/"
          target="_blank"
          style="font-size: 16px; font-weight: 800"
        >
          &nbsp;Mocky&nbsp;
        </el-link>
        <span class="font-bold text-[18x]"> 请不要上传重要信息 </span
        >，如果造成任何损失，我们概不负责
      </p>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
:deep(.card-header) {
  display: flex;

  .header-right {
    display: flex;
    flex: auto;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
  }
}

:deep(.pure-upload) {
  .el-upload-dragger {
    background-color: transparent;
    border: none;
  }
}

.img-name {
  position: absolute;
  bottom: 80px;
  left: 50%;
  z-index: 4000;
  padding: 5px 23px;
  background-color: var(--el-text-color-regular);
  border-radius: 22px;
  transform: translateX(-50%);

  /** 将下面的 left: 50%; bottom: 80px; transform: translateX(-50%); 注释掉
   *  解开下面 left: 40px; top: 40px; 注释，体验不一样的感觉。啊？还是差强人意，自己调整位置吧🥹
   */
  // left: 40px;
  // top: 40px;
}
</style>
