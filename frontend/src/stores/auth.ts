import { defineStore } from 'pinia';
import { localStorageKey } from '../constants';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem(localStorageKey) ? true : false,
  }),
  actions: {
    login(token: string) {
      localStorage.setItem(localStorageKey, token);
      this.isAuthenticated = true;
    },
    logout() {
      localStorage.removeItem(localStorageKey);
      this.isAuthenticated = false;
    },
  },
});