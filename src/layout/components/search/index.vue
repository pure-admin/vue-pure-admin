<script lang="ts" setup>
import { SearchModal } from "./components";
import { useBoolean } from "../../hooks/useBoolean";
const { bool: show, toggle } = useBoolean();
function handleSearch() {
  toggle();
}
</script>

<template>
  <div
    class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover"
    @click="handleSearch"
  >
    <IconifyIconOffline icon="search" />
  </div>
  <SearchModal v-model:value="show" />
</template>
