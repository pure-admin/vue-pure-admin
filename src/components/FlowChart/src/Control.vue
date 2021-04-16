<template>
  <div class="control-container">
    <ul>
      <li
        v-for="(item,key) in titleLists"
        :key="key"
        :title="item.text"
        :style="{background: focusIndex === key ? '#ccc' : ''}"
        @mouseenter.prevent="onEnter(key)"
        @mouseleave.prevent="focusIndex = -1"
      >
        <button ref="controlButton" @click="onControl(item,key)">
          <span :class="'iconfont ' + item.icon"></span>
          <p>{{ item.text }}</p>
        </button>
      </li>
    </ul>
    <!-- <el-button size="small" @click="$_zoomIn">放大</el-button>
      <el-button size="small" @click="$_zoomOut">缩小</el-button>
      <el-button size="small" @click="$_zoomReset">大小适应</el-button>
      <el-button size="small" @click="$_translateRest">定位还原</el-button>
      <el-button size="small" @click="$_reset">还原(大小&定位)</el-button>
      <el-button size="small" @click="$_undo" :disabled="undoDisable">上一步(ctrl+z)</el-button>
      <el-button size="small" @click="$_redo" :disabled="redoDisable">下一步(ctrl+y)</el-button>
      <el-button size="small" @click="$_download">下载图片</el-button>
      <el-button size="small" @click="$_catData">查看数据</el-button>
    <el-button v-if="catTurboData" size="small" @click="$_catTurboData">查看turbo数据</el-button>-->
  </div>
</template>

<script>
export default {
  name: "Control",
  props: {
    lf: Object || String,
    catTurboData: Boolean,
  },
  data() {
    return {
      undoDisable: true,
      redoDisable: true,
      focusIndex: -1,
      titleLists: [
        {
          icon: "icon-zoom-out-hs",
          text: "缩小",
        },
        {
          icon: "icon-enlarge-hs",
          text: "放大",
        },
        {
          icon: "icon-full-screen-hs",
          text: "适应",
        },
        {
          icon: "icon-previous-hs",
          text: "上一步",
        },
        {
          icon: "icon-next-step-hs",
          text: "下一步",
        },
      ],
    };
  },
  mounted() {
    this.$props.lf.on("history:change", ({ data: { undoAble, redoAble } }) => {
      this.$data.undoDisable = !undoAble;
      this.$data.redoDisable = !redoAble;
    });
  },
  methods: {
    onControl(item, key) {
      ["zoom", "zoom", "resetZoom", "undo", "redo"].forEach((v, i) => {
        let domControl = this.$props.lf;
        if (key === 1) {
          domControl.zoom(true);
        }
        if (key === i) {
          domControl[v]();
        }
      });
    },
    onEnter(key) {
      this.focusIndex = key;
    },
    $_zoomIn() {
      this.$props.lf.zoom(true);
    },
    $_zoomOut() {
      this.$props.lf.zoom(false);
    },
    $_zoomReset() {
      this.$props.lf.resetZoom();
    },
    $_translateRest() {
      this.$props.lf.resetTranslate();
    },
    $_reset() {
      this.$props.lf.resetZoom();
      this.$props.lf.resetTranslate();
    },
    $_undo() {
      this.$props.lf.undo();
    },
    $_redo() {
      this.$props.lf.redo();
    },
    $_download() {
      this.$props.lf.getSnapshot();
    },
    $_catData() {
      this.$emit("catData");
    },
    $_catTurboData() {
      this.$emit("catTurboData");
    },
  },
};
</script>

<style scoped>
@import "./assets/iconfont/iconfont.css";
.control-container {
  position: absolute;
  right: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  box-shadow: 0 1px 4px rgb(0 0 0 / 30%);
  border-radius: 5px;
}
.iconfont {
  font-size: 25px;
}
.control-container p {
  margin: 0;
  font-size: 12px;
}
.control-container ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2px;
}
.control-container ul li {
  width: 60px;
  text-align: center;
  cursor: pointer;
  /* pointer-events: none; */
}
</style>
