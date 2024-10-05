import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      nickName: '',
      isLogin: false,
      isAdmin: false,
      role: '',
      accessToken: '',
    };
  },

  actions: {
    login(nickName, accessToken, role) {
      this.nickName = nickName;
      this.isLogin = true;
      this.accessToken = accessToken;
      this.role = role;

    },

    logout() {
      this.$reset();
      localStorage.removeItem('user');
    },
  },
  persist: {
    enabled: true,
    strategies: [{ key: 'user', storage: localStorage }],
  },
});
