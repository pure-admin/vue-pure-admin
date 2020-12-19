import { storageLocal } from "../../utils/storage"
interface stateInter {
  sidebar: {
    opened: Boolean,
    withoutAnimation: Boolean
  },
  device: String
}

const state = {
  sidebar: {
    opened: storageLocal.getItem('sidebarStatus') ? !!+storageLocal.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: (state: stateInter): void => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
     if (state.sidebar.opened) {
      storageLocal.setItem('sidebarStatus', 1)
    } else {
      storageLocal.setItem('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state: stateInter, withoutAnimation: Boolean) => {
    storageLocal.setItem('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state: stateInter, device: String) => {
    state.device = device
  }
}

const actions = {
  // @ts-ignore
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  // @ts-ignore
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // @ts-ignore
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
