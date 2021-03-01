<template>
  <div class="dropdown-wrapper" :class="{ open }">
    <button
      class="dropdown-title"
      type="button"
      :aria-label="item.ariaLabel"
      @click="setOpen(!open)"
    >
      <span>{{ item.text }}</span>
      <span class="arrow" :class="open ? 'down' : 'right'" />
    </button>

    <ul class="nav-dropdown">
      <li v-for="(subItem, index) in item.items" :key="subItem.link || index" class="dropdown-item">
        <h4 v-if="subItem.items">{{ subItem.text }}</h4>
        <ul v-if="subItem.items" class="dropdown-subitem-wrapper">
          <li
            v-for="childSubItem in subItem.items"
            :key="childSubItem.link"
            class="dropdown-subitem"
          >
            <NavBarLink
              :item="childSubItem"
              @focusout="
                  isLastItemOfArray(childSubItem, subItem.items) &&
                    isLastItemOfArray(subItem, item.items) &&
                    setOpen(false)
                "
            />
          </li>
        </ul>

        <NavBarLink
          v-else
          :item="subItem"
          @focusout="isLastItemOfArray(subItem, item.items) && setOpen(false)"
        />
      </li>
    </ul>
  </div>
</template>

<script src="./NavDropdownLink"></script>

<style>
.dropdown-wrapper {
  position: relative;
  cursor: pointer;
  display: block;
  margin-left: 1.5rem;
}

.dropdown-wrapper .dropdown-title {
  font: inherit;
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  height: 1.75rem;
  line-height: 1.75rem;
  padding: inherit;
  background: transparent;
  border: none;
}

.dropdown-wrapper .dropdown-title:hover {
  border-color: transparent;
}

.dropdown-wrapper .dropdown-title .arrow {
  display: inline-block;
  vertical-align: middle;
  margin-top: -1px;
  margin-left: 0.4rem;
}

.dropdown-wrapper .nav-dropdown .dropdown-item {
  color: inherit;
  line-height: 1.7rem;
}

.dropdown-wrapper .nav-dropdown .dropdown-item h4 {
  margin: 0.45rem 0 0;
  border-top: 1px solid #eee;
  padding: 0.45rem 1.5rem 0 1.25rem;
}

.dropdown-wrapper .nav-dropdown .dropdown-item .nav-item {
  margin-left: 0.5rem;
}

.dropdown-wrapper .nav-dropdown .dropdown-item .dropdown-subitem-wrapper {
  padding: 0;
  list-style: none;
}

.dropdown-wrapper
  .nav-dropdown
  .dropdown-item
  .dropdown-subitem-wrapper
  .dropdown-subitem {
  font-size: 0.9em;
}

.dropdown-wrapper .nav-dropdown .dropdown-item a {
  display: block;
  line-height: 1.7rem;
  position: relative;
  border-bottom: none;
  font-weight: 400;
  margin-bottom: 0;
  margin-left: 0;
  padding: 0 1.5rem 0 1.25rem;
}

.dropdown-wrapper .nav-dropdown .dropdown-item a:hover {
  color: var(--accent-color);
}

.dropdown-wrapper .nav-dropdown .dropdown-item a.active {
  color: var(--accent-color);
}

.dropdown-wrapper .nav-dropdown .dropdown-item a.active::after {
  content: '';
  width: 0;
  height: 0;
  border-left: 5px solid var(--accent-color);
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  position: absolute;
  top: calc(50% - 1.5px);
  left: 8px;
}

.dropdown-wrapper .nav-dropdown .dropdown-item:first-child h4 {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

.dropdown-wrapper {
  height: 1.8rem;
}

.dropdown-wrapper:hover .nav-dropdown,
.dropdown-wrapper.open .nav-dropdown {
  display: block;
}

.dropdown-wrapper.open:blur {
  display: none;
}

.dropdown-wrapper .dropdown-title .arrow {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #aaa;
  border-bottom: 0;
}

.dropdown-wrapper .nav-dropdown {
  display: none;
  height: auto !important;
  box-sizing: border-box;
  max-height: calc(100vh - 2.7rem);
  overflow-y: auto;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  padding: 0.6rem 0;
  border: 1px solid #ddd;
  border-bottom-color: #ccc;
  text-align: left;
  border-radius: 0.25rem;
  white-space: nowrap;
  margin: 0;
}

@media screen and (max-width: 719px) {
  .dropdown-wrapper {
    height: auto;
    margin-left: 1.5rem;
  }

  .dropdown-wrapper .dropdown-title {
    font-size: 1rem;
    font-weight: 600;
  }

  .dropdown-wrapper .nav-dropdown {
    position: relative;
    top: none;
    right: none;
    border: none;
    padding: 4px 0;
    background-color: transparent;
  }

  .dropdown-wrapper:hover .nav-dropdown {
    display: none;
  }

  .dropdown-wrapper.open .nav-dropdown {
    display: block;
  }

  .dropdown-wrapper .nav-dropdown .dropdown-item .nav-item {
    margin: 0;
    padding: 0;
  }

  .dropdown-wrapper .nav-dropdown .dropdown-item .nav-link {
    font-size: 0.9rem;
  }
}
</style>
