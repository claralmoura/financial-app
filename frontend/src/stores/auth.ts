// src/stores/auth.ts
import { defineStore } from 'pinia';
import { localStorageKey } from '../constants';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // O estado inicial é definido pela existência do token no localStorage
    isAuthenticated: localStorage.getItem(localStorageKey) ? true : false,
  }),
  actions: {
    // Ação para quando o usuário faz login com sucesso
    login(token: string) {
      localStorage.setItem(localStorageKey, token);
      this.isAuthenticated = true;
    },
    // Ação para quando o usuário faz logout
    logout() {
      localStorage.removeItem(localStorageKey);
      this.isAuthenticated = false;
    },
  },
});