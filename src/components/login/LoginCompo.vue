<template>
  <div class="mt-5 text-center text-sans">
    <div class="relative my-100 max-w-auto m-0 p-0 min-h-[220px]">
      <div class="flex flex-col items-center">
        <h1 class="font-bold text-3xl py-8 self-center">로그인</h1>
        <!-- 로그인 폼 -->
        <form
          @submit.prevent="loginAccount"
          class="text-xl bg-[#F9FAFB] p-10 rounded-md border-solid border-2 border-indigo-600 mb-7"
        >
          <div class="inputAccount flex flex-col w-80 gap-5">
            <!-- 아이디 -->
            <div class="inputEmail m-0 p-0 align-baseline">
              <label for="email" class="block text-left text-sm font-medium mb-2">이메일</label>
              <div class="relative flex">
                <input
                  type="text"
                  v-model="email"
                  autofocus
                  placeholder="example@gmail.com"
                  class="p-3 rounded border-[1px] border-solid border-gray-200 text-base w-full h-12 resize-none focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
                />
              </div>
            </div>
            <!-- 비밀번호 -->
            <div>
              <label for="password" class="block text-left text-sm font-medium mb-2">비밀번호</label>
              <div class="relative flex">
                <input
                  type="password"
                  v-model="password"
                  autofocus
                  placeholder="비밀번호를 입력해주세요."
                  class="p-3 rounded border-[1px] border-solid border-gray-200 text-base w-full h-12 resize-none focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
                />
              </div>
            </div>
            <!-- 버튼 -->
            <button
              class="emailLoginBtn hover:bg-[#2C7130] inline-block font-medium text-center border-1 border-solid cursor-pointer select-none duration-0 ease-in-out text-neutral bg-midGreen px-3 py-3 text-base rounded"
              type="submit"
            >
              이메일 로그인
            </button>
          </div>
          <p v-if="errorMessage" class="text-red text-[12px] mt-2">{{ errorMessage }}</p>

          <!-- 위 버튼과 다른 기능을 하다보니 div를 나눔 -->
          <div class="findOrsignup flex gap-5 justify-center items-center mt-6 mb-10">
            <a href="" class="findEmailBtn hover:text-midGreen text-[#737373] text-sm py-1 cursor-pointer"
              >이메일 찾기</a
            >
            <div class="w-px min-h-3 bg-[#E1E1E1]"></div>
            <a href="" class="findPasswordBtn hover:text-midGreen text-[#737373] text-sm py-1 cursor-pointer"
              >비밀번호 찾기</a
            >
          </div>

          <!-- 소셜로그인 -->
          <div class="flex flex-col gap-3 mt-4 mb-3">
            <button
              type="button"
              class="font-medium text-center border border-solid cursor-pointer select-none ease-in-out px-3 text-base rounded-md w-full bg-[#03c75a] border-[#03c75a] text-white flex items-center justify-center"
            >
              <a href="http://localhost:8080/oauth2/authorization/naver" class="inline-flex"
                ><img
                  alt="네이버 로고"
                  class="w-[160px] border-box"
                  loading="lazy"
                  decoding="async"
                  data-nimg="1"
                  :src="require('/public/imgs/naver_login.png')"
              /></a>
            </button>
            <button
              type="button"
              class="font-medium text-center border border-solid cursor-pointer select-none ease-in-out px-3 text-base rounded-md w-full bg-[#fee500] border-[#fee500] text-black flex items-center justify-center"
            >
              <a href="http://localhost:8080/oauth2/authorization/kakao" class="inline-flex">
                <img
                  alt="카카오 로고"
                  loading="lazy"
                  decoding="async"
                  data-nimg="1"
                  :src="require('/public/imgs/kakao_login.png')"
                />
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    checkEmail() {
      // 이메일 형식 검증
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      console.log('이메일: ' + this.email);
      if (this.email.length != 0 && emailPattern.test(this.email)) {
        return true;
      }
      return false;
    },

    checkPassword() {
      // 비밀번호 검증
      if (!this.password || this.password.length < 10) {
        return false;
      }
      return true;
    },

    vallidateForm() {
      // 이메일과 비밀번호 검증
      console.log('이메일 검증 결과 ' + this.checkEmail());
      console.log('패스워드 검증 결과 ' + this.checkPassword());

      if (this.checkEmail() && this.checkPassword()) {
        return true;
      }
      return false;
    },

    async loginAccount() {
      // 에러가 없을 경우 로그인 시도

      if (!this.vallidateForm()) {
        this.errorMessage = '아이디 또는 패스워드를 확인해 주세요.';
        return;
      }

      const userStore = useUserStore();
      const loginData = {
        email: this.email,
        password: this.password,
      };

      // 서버 요청
      try {
        const response = await axios.post(`http://localhost:8080/form/login`, loginData, {
          withCredentials: true,
        });

        console.log(response.headers.get('Authorization'));

        userStore.login(response.data.nickName, response.headers.get('Authorization'), response.data.role);
        this.$router.push('/');
      } catch (error) {
        console.log(error);
        console.error('로그인 오류:', error);
        if (error.status == 401 || error.status == 500) {
          this.errorMessage = '아이디 또는 패스워드를 확인해 주세요.';
        }
      }
    },
  },
};
</script>

<style scoped>
.emailLoginBtn {
  transition-property: color, border-color, background-color;
  transition-duration: 0.15s;
}
</style>
