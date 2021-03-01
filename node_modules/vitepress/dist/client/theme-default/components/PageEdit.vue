<template>
  <footer class="page-edit">
    <a
      v-if="editLink"
      :href="editLink"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ editLinkText }}
      <OutboundLink />
    </a>
  </footer>
</template>

<script src="./PageEdit"></script>

<style>
.page-edit {
  padding-top: 1rem;
  padding-bottom: 1rem;
  overflow: auto;
}

.page-edit a {
  color: var(--text-color);
  margin-right: 0.25rem;
}
</style>
