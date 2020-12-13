interface stateInter {
  sidebar: {
    withoutAnimation: Boolean
  },
  device: String
}

const state = {
  sidebar: {
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: (state: stateInter): void => {
    state.sidebar.withoutAnimation = false
  },
  CLOSE_SIDEBAR: (state: stateInter, withoutAnimation: Boolean) => {
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
