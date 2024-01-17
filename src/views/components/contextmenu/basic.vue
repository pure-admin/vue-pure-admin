<template>
  <div>
    <p class="mb-2">基础用法</p>
    <div v-contextmenu:contextmenu class="wrapper">
      <code>右键点击此区域</code>
    </div>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item>GitHub</v-contextmenu-item>
      <v-contextmenu-item>GitLab</v-contextmenu-item>

      <v-contextmenu-divider />

      <v-contextmenu-submenu title="蔬菜菜">
        <v-contextmenu-item>土豆</v-contextmenu-item>

        <v-contextmenu-submenu title="青菜">
          <v-contextmenu-item>小油菜</v-contextmenu-item>
          <v-contextmenu-item>空心菜</v-contextmenu-item>
        </v-contextmenu-submenu>

        <v-contextmenu-item>黄瓜</v-contextmenu-item>
      </v-contextmenu-submenu>

      <v-contextmenu-item disabled>菠萝蜜</v-contextmenu-item>

      <v-contextmenu-divider />

      <v-contextmenu-item>哈密瓜</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuDivider,
  ContextmenuSubmenu,
  ContextmenuGroup
} from "v-contextmenu";

export default defineComponent({
  name: "ExampleSimple",

  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    [ContextmenuDivider.name]: ContextmenuDivider,
    [ContextmenuSubmenu.name]: ContextmenuSubmenu,
    [ContextmenuGroup.name]: ContextmenuGroup
  },

  directives: {
    contextmenu: directive
  }
});
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  background-color: rgb(90 167 164 / 20%);
  border: 3px dashed rgb(90 167 164 / 90%);
  border-radius: 8px;
}
</style>
