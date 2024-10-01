<template>
  <header class="flex justify-between items-center fixed w-[1105px] mx-auto top-0 bg-white z-10">
    <div class="flex justify-between items-center">
      <img @click="goToHome" class="w-[90px] cursor-pointer mr-8" src="@/assets/logo.png" alt="로고" />
      <div v-if="role !== 'ADMIN'" class="flex">
        <p
          @click="$router.push('/')"
          class="cursor-pointer mr-7 text-[16px] font-semibold"
          :class="{ 'text-midGreen font-bold': isHomePage, 'hover:text-midGreen': !isHomePage }"
        >
          리모델링파트너
        </p>
        <p
          class="cursor-pointer mr-7 text-[16px] font-semibold hover:text-midGreen"
          :class="{ 'text-midGreen font-bold': isPortfolioPage, 'hover:text-midGreen': !isPortfolioPage }"
          @click="$router.push('/portfolio')"
        >
          시공사례
        </p>
        <p
          @click="$router.push('/reviews')"
          class="cursor-pointer mr-7 text-[16px] font-semibold hover:text-midGreen"
          :class="{ 'text-midGreen font-bold': isReviewPage, 'hover:text-midGreen': !isReviewPage }"
        >
          시공후기
        </p>
        <p
          v-if="role === 'COMPANY'"
          @click="$router.push('/estimate/list')"
          class="cursor-pointer text-[16px] font-semibold mr-8"
          :class="{ 'text-midGreen': isEstimateListPage, 'hover:text-midGreen': !isEstimateListPage }"
        >
          고객시공요청
        </p>
      </div>
    </div>

    <div class="flex">
      <div class="flex justify-between items-center" v-if="isLogin">
        <p
          v-if="role === 'USER'"
          @click="goToEstimateRequest"
          class="cursor-pointer mr-7 text-[16px] font-semibold hover:text-midGreen"
          :class="{ 'text-midGreen font-bold': isRequestEstimatePage, 'hover:text-midGreen': !isRequestEstimatePage }"
        >
          견적요청
        </p>
        <p
          v-if="role === 'COMPANY'"
          @click="$router.push('/portfolio/create')"
          class="cursor-pointer text-[16px] font-semibold mr-8"
          :class="{ 'text-midGreen': isCreatePortfolioPage, 'hover:text-midGreen': !isCreatePortfolioPage }"
        >
          시공사례작성
        </p>

        <p @click="goToMyPage" class="cursor-pointer text-[16px] font-bold mr-8 hover:text-midGreen">
          {{ nickName }} 님
        </p>
        <p @click="handleLogout" class="cursor-pointer text-[16px] font-semibold mr-8 hover:text-midGreen">로그아웃</p>
      </div>

      <div class="flex justify-between items-center" v-else>
        <p
          @click="$router.push('/login')"
          class="cursor-pointer text-[16px] font-semibold mr-8"
          :class="{ 'text-midGreen': isLoginPage, 'hover:text-midGreen': !isLoginPage }"
        >
          로그인
        </p>
        <p
          @click="$router.push('/memberSignup')"
          class="cursor-pointer text-[16px] font-semibold"
          :class="{ 'text-midGreen': isSignupPage, 'hover:text-midGreen': !isSignupPage }"
        >
          회원가입
        </p>
      </div>
    </div>
  </header>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const isLogin = computed(() => userStore.isLogin);
    const role = computed(() => userStore.role);
    const nickName = computed(() => userStore.nickName);

    // New method to navigate based on role
    const goToMyPage = () => {
      if (role.value === 'USER') {
        router.push('/mypage/user');
      } else if (role.value === 'COMPANY') {
        router.push('/mypage/company');
      } else if (role.value === 'ADMIN') {
        router.push('/mypage/admin');
      }
    };

    const goToHome = () => {
      if (role.value === 'ADMIN') {
        router.push('/mypage/admin/adminCompanyList');
      } else {
        router.push('/');
      }
    };

    const goToEstimateRequest = () => {
      window.location.href = '/requestEstimate';
    };

    const handleLogout = () => {
      userStore.logout();
      router.push('/');
    };

    return {
      nickName,
      isLogin,
      role,
      handleLogout,
      goToMyPage,
      goToHome,
      goToEstimateRequest,
    };
  },

  computed: {
    isHomePage() {
      return this.$route.path === '/';
    },
    isLoginPage() {
      return this.$route.path === '/login';
    },
    isSignupPage() {
      return this.$route.path === '/memberSignup' || this.$route.path === '/companySignup';
    },
    isReviewPage() {
      return this.$route.path === '/reviews';
    },
    isPortfolioPage() {
      return this.$route.path === '/portfolio';
    },
    isEstimateListPage() {
      return this.$route.path === '/estimate/list';
    },
    isCreatePortfolioPage() {
      return this.$route.path === '/portfolio/create';
    },
    isRequestEstimatePage() {
      return this.$route.path === '/requestEstimate';
    },
  },
};
</script>

<style></style>
