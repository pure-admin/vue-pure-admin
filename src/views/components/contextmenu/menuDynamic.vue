<template>
  <div>
    <h1>动态菜单</h1>
    <div v-contextmenu:contextmenu class="wrapper">
      <code>右键点击此区域</code>
    </div>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-group title="操作">
        <v-contextmenu-item :hide-on-click="false" @click="extra.push('item')">
          添加菜单
        </v-contextmenu-item>
        <v-contextmenu-item :hide-on-click="false" @click="extra.push('group')">
          添加菜单组
        </v-contextmenu-item>
        <v-contextmenu-item
          :hide-on-click="false"
          @click="extra.push('submenu')"
        >
          添加子菜单
        </v-contextmenu-item>
        <v-contextmenu-item :hide-on-click="false" @click="extra.pop()">
          删除
        </v-contextmenu-item>
      </v-contextmenu-group>

      <template v-for="(item, index) of extra" :key="index">
        <v-contextmenu-divider />

        <v-contextmenu-group
          v-if="item === 'group'"
          :title="`菜单组 ${index + 1}`"
        >
          <v-contextmenu-item>菜单1</v-contextmenu-item>
          <v-contextmenu-item>菜单2</v-contextmenu-item>
          <v-contextmenu-item>菜单3</v-contextmenu-item>
        </v-contextmenu-group>

        <v-contextmenu-submenu
          v-else-if="item === 'submenu'"
          :title="`子菜单 ${index + 1}`"
        >
          <v-contextmenu-item>菜单1</v-contextmenu-item>
          <v-contextmenu-item>菜单2</v-contextmenu-item>
          <v-contextmenu-item>菜单3</v-contextmenu-item>
        </v-contextmenu-submenu>

        <v-contextmenu-item v-else>菜单 {{ index + 1 }}</v-contextmenu-item>
      </template>
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
  name: "ExampleDynamic",

  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    [ContextmenuDivider.name]: ContextmenuDivider,
    [ContextmenuSubmenu.name]: ContextmenuSubmenu,
    [ContextmenuGroup.name]: ContextmenuGroup
  },

  directives: {
    contextmenu: directive
  },

  data() {
    return {
      extra: []
    };
  },

  methods: {
    addItem(type = "item") {
      this.extra.push(type);
    },
    removeItem() {
      this.extra.pop();
    }
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
  margin-bottom: 30px;
  background-color: rgb(90 167 164 / 20%);
  border: 3px dashed rgb(90 167 164 / 90%);
  border-radius: 8px;
}
</style>
