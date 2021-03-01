<template>
  <header class="hero">
    <img
      v-if="data.heroImage"
      :src="heroImageSrc"
      :alt="data.heroAlt || 'hero'"
    >

    <h1
      v-if="data.heroText !== null"
      id="main-title"
    >
      {{ data.heroText || siteTitle || 'Hello' }}
    </h1>

    <p
      v-if="data.tagline !== null"
      class="description"
    >
      {{ data.tagline || siteDescription || 'Welcome to your VitePress site' }}
    </p>

    <p
      v-if="data.actionText && data.actionLink"
      class="action"
    >
      <NavBarLink :item="actionLink" />
    </p>
    <slot name="hero" />
  </header>

  <div
    v-if="data.features && data.features.length"
    class="features"
  >
    <div
      v-for="(feature, index) in data.features"
      :key="index"
      class="feature"
    >
      <h2>{{ feature.title }}</h2>
      <p>{{ feature.details }}</p>
    </div>
    <slot name="features" />
  </div>

  <div
    v-if="data.footer"
    class="footer"
  >
    {{ data.footer }}
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import NavBarLink from './NavBarLink.vue'
import { withBase } from '../utils'
import { useRoute, useSiteData } from 'vitepress'

export default defineComponent({
  components: {
    NavBarLink
  },

  setup() {
    const route = useRoute()
    const siteData = useSiteData()

    const data = computed(() => route.data.frontmatter)
    const actionLink = computed(() => ({
      link: data.value.actionLink,
      text: data.value.actionText
    }))
    const heroImageSrc = computed(() => withBase(data.value.heroImage))
    const siteTitle = computed(() => siteData.value.title)
    const siteDescription = computed(() => siteData.value.description)

    return {
      data,
      actionLink,
      heroImageSrc,
      siteTitle,
      siteDescription
    }
  }
})
</script>

<style scoped>
.hero {
  text-align: center;
}

.hero img {
  max-width: 100%;
  max-height: 280px;
  display: block;
  margin: 3rem auto 1.5rem;
}

.hero h1 {
  font-size: 3rem;
}

.hero h1,
.hero .description,
.hero .action {
  margin: 1.8rem auto;
}

.hero .description {
  max-width: 35rem;
  font-size: 1.6rem;
  line-height: 1.3;
  /* TODO: calculating lighten 40% color with using style :vars from `--text-color` */
  color: #6a8bad;
}

::v-deep(.nav-link) {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: var(--accent-color);
  margin-left: 0;
  padding: 0.8rem 1.6rem;
  border-radius: 4px;
  transition: background-color .1s ease;
  box-sizing: border-box;
  /* TODO: calculating darken 10% color with using style vars from `--accent-color` */
  border-bottom: 1px solid #389d70;
}

::v-deep(.nav-link:hover) {
  /* TODO: calculating lighten 10% color with using style vars from `--accent-color` */
  background-color: #4abf8a;
}

.features {
  border-top: 1px solid var(--border-color);
  padding: 1.2rem 0;
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: stretch;
  justify-content: space-between;
}

.feature {
  flex-grow: 1;
  flex-basis: 30%;
  max-width: 30%;
}

.feature h2 {
  font-size: 1.4rem;
  font-weight: 500;
  border-bottom: none;
  padding-bottom: 0;
  /* TODO: calculating lighten 10% color with using style :vars from `--text-color` */
  color: #3a5169;
}

.feature p {
  /* TODO: calculating lighten 25% color with using style :vars from `--text-color` */
  color: #4e6e8e;
}

.footer {
  padding: 2.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  /* TODO: calculating lighten 25% color with using style :vars from `--text-color` */
  color: #4e6e8e;
}

@media screen and (max-width: 719px) {
  .features {
    flex-direction: column;
  }

  .feature {
    max-width: 100%;
    padding: 0 2.5rem;
  }
}

@media screen and (max-width: 429px) {
  .hero img {
    max-height: 210px;
    margin: 2rem auto 1.2rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero h1,
  .hero .description,
  .hero .action {
    margin: 1.2rem auto;
  }

  .hero .description {
    font-size: 1.2rem;
  }

  .hero .action-button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }

  .feature h2 {
    font-size: 1.25rem;
  }
}
</style>
