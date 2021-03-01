<template>
  <nav class="nav-links" v-if="navData || repoInfo">
    <template v-if="navData">
      <template v-for="item of navData">
        <NavDropdownLink v-if="item.items" :item="item" />
        <NavBarLink v-else :item="item" />
      </template>
    </template>
    <NavDropdownLink v-if="localeCandidates" :item="localeCandidates" />
    <NavBarLink v-if="repoInfo" :item="repoInfo" />
  </nav>
</template>

<script src="./NavBarLinks"></script>

<style>
.nav-links {
  display: flex;
  align-items: center;
  height: 35px;
  list-style-type: none;
  transform: translateY(1px);
}

@media screen and (max-width: 719px) {
  .nav-links {
    display: block;
    height: auto;
    padding: 0.5rem 0 1rem;
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
