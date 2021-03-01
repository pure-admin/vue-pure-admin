<template>
  <div class="content">
    <slot name="top" />
    <Content />
    <NextAndPrevLinks />
    <PageEdit />
    <slot name="bottom" />
  </div>
</template>

<script>
import NextAndPrevLinks from './NextAndPrevLinks.vue'
import PageEdit from './PageEdit.vue'
export default {
  components: { NextAndPrevLinks, PageEdit }
}
</script>

<style>
.content {
  margin: 0 auto;
  padding: 0.025rem 2.5rem 2rem;
  /* if this is moved to a variable, add it to BuySellAds.vue */
  max-width: 50rem;
}

.content a {
  color: var(--accent-color);
}

.content a:hover {
  text-decoration: underline;
}

.content img {
  max-width: 100%;
}
/*
.content div > h1:first-child, .content div > h2:first-child {
  margin-top: 0;
} */
</style>
