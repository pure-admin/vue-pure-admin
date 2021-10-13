<script setup lang="ts">
import { ref } from "vue";
import { storageSession } from "/@/utils/storage";

const auth = ref<boolean>(storageSession.getItem("info").username || "admin");

function changRole(value) {
  storageSession.setItem("info", {
    username: value,
    accessToken: `eyJhbGciOiJIUzUxMiJ9.${value}`
  });
  window.location.reload();
}
</script>

<template>
  <div class="app-container">
    <el-radio-group v-model="auth" @change="changRole">
      <el-radio-button label="admin"></el-radio-button>
      <el-radio-button label="test"></el-radio-button>
    </el-radio-group>
    <p v-auth="'v-admin'">只有admin可看</p>
    <p v-auth="'v-test'">只有test可看</p>
  </div>
</template>
