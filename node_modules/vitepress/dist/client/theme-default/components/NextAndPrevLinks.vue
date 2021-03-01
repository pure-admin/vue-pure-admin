<template>
  <div v-if="hasLinks" class="links-wrapper">
    <div class="prev-link">
      <div v-if="prev">
      ← <a :href="prev.link">{{ prev.text }}</a>
      </div>
    </div>
    <div class="next-link">
      <div v-if="next">
        <a :href="next.link">{{ next.text }}</a> →
      </div>
    </div>
  </div>
</template>

<script src="./NextAndPrevLinks"></script>

<style>
.links-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.links-wrapper a {
  font-weight: 500;
}

.links-wrapper a:hover {
  text-decoration: none !important;
}
</style>
