<template>
  <div class="nav-item">
    <a
      class="nav-link"
      :class="classes"
      :href="href"
      :target="target"
      :rel="rel"
      :aria-label="item.ariaLabel"
    >
      {{ item.text }}
      <OutboundLink v-if="isExternalLink" />
    </a>
  </div>
</template>

<script src="./NavBarLink"></script>

<style>
.nav-item {
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
  line-height: 2rem;
}

@media screen and (max-width: 719px) {
  .nav-item {
    display: block;
    margin-left: 0;
    padding: 0.3rem 1.5rem;
  }
}

.nav-link {
  display: block;
  margin-bottom: -2px;
  border-bottom: 2px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4rem;
  color: var(--text-color);
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.active {
  border-bottom-color: var(--accent-color);
}

.nav-link.external:hover {
  border-bottom-color: transparent;
}

@media screen and (max-width: 719px) {
  .nav-link {
    line-height: 1.7;
    font-size: 1em;
    font-weight: 600;
    border-bottom: none;
    margin-bottom: 0;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--accent-color);
  }
}
</style>
