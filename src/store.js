import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    saveToken(_, token) {
      localStorage.setItem('token', token);
    },
    loadToken() {
      return localStorage.getItem('token');
    },
    clearToken() {
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    },
    getToken: () => {
      return localStorage.getItem('token');
    },
  },
});

export default store;
