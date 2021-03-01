import { createStore } from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'

export default createStore({
  getters,
  modules: {
    app,
    settings
  }
})
