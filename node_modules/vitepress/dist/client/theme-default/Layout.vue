<template>
  <div class="theme" :class="pageClasses">
    <header class="navbar" v-if="showNavbar">
      <NavBar>
        <template #search>
          <slot name="navbar-search" />
        </template>
      </NavBar>
      <ToggleSideBarButton @toggle="toggleSidebar" />
    </header>
    <aside :class="{ open: openSideBar }">
      <SideBar>
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </SideBar>
    </aside>
    <!-- TODO: make this button accessible -->
    <div class="sidebar-mask" @click="toggleSidebar(false)" />
    <main class="home" aria-labelledby="main-title" v-if="enableHome">
      <Home>
        <template #hero>
          <slot name="home-hero" />
        </template>
        <template #features>
          <slot name="home-features" />
        </template>
        <template #footer>
          <slot name="home-footer" />
        </template>
      </Home>
    </main>
    <main v-else>
      <Page>
        <template #top>
          <slot name="page-top" />
        </template>
        <template #bottom>
          <slot name="page-bottom" />
        </template>
      </Page>
    </main>
  </div>
  <Debug />
</template>

<script>
import { ref, computed, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import Home from './components/Home.vue'
import ToggleSideBarButton from './components/ToggleSideBarButton.vue'
import SideBar from './components/SideBar.vue'
import Page from './components/Page.vue'
import { useRoute, useSiteData, useSiteDataByRoute } from 'vitepress'

export default {
  components: {
    Home,
    NavBar,
    ToggleSideBarButton,
    SideBar,
    Page
  },

  setup() {
    const route = useRoute()
    const siteData = useSiteData()
    const siteRouteData = useSiteDataByRoute()

    const openSideBar = ref(false)
    const enableHome = computed(() => !!route.data.frontmatter.home)

    const showNavbar = computed(() => {
      const { themeConfig } = siteRouteData.value
      const { frontmatter } = route.data
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        siteData.value.title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
      )
    })

    const showSidebar = computed(() => {
      const { frontmatter } = route.data
      const { themeConfig } = siteRouteData.value
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && ((typeof themeConfig.sidebar === 'object') && (Object.keys(themeConfig.sidebar).length != 0)
        || (Array.isArray(themeConfig.sidebar) && themeConfig.sidebar.length != 0))
      )
    })

    const pageClasses = computed(() => {
      return [{
        'no-navbar': !showNavbar.value,
        'sidebar-open': openSideBar.value,
        'no-sidebar': !showSidebar.value
      }]
    })

    const toggleSidebar = (to) => {
      openSideBar.value = typeof to === 'boolean' ? to : !openSideBar.value
    }

    const hideSidebar = toggleSidebar.bind(null, false)
    // close the sidebar when navigating to a different location
    watch(route, hideSidebar)
    // TODO: route only changes when the pathname changes
    // listening to hashchange does nothing because it's prevented in router

    return {
      showNavbar,
      showSidebar,
      openSideBar,
      pageClasses,
      enableHome,
      toggleSidebar
    }
  }
}
</script>
