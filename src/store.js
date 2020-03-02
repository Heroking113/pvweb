import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: {},
    classId: '',
    testId: '',
    username: '',
    chapterId: '',
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
      localStorage.setItem('state', JSON.stringify(this.state))
    },
    setUserStatus (state, userStatus) {
      state.status = userStatus
      localStorage.setItem('state', JSON.stringify(this.state))
    },
    setClassID (state, clickClassId) {
      state.classId = clickClassId
      localStorage.setItem('state', JSON.stringify(this.state))
    },
    setTestID (state, clickTestId) {
      state.testId = clickTestId
      localStorage.setItem('state', JSON.stringify(this.state))
    },
    setChapterID (state, clickChapterId) {
      state.chapterId = clickChapterId
      localStorage.setItem('state', JSON.stringify(this.state))
    },
    reSetState (state, saveState) {
      state.username = saveState.username
      state.status = saveState.status
      state.classId = saveState.classId
      state.testId = saveState.testId
      state.chapterId = saveState.chapterId
    }
  },
  actions: {}
});
