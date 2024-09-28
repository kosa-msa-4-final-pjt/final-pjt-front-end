<!-- UserPageCompo.vue -->
<template>
  <div class="container mx-auto p-6">
    <!-- Sidebar + Main Content Layout -->
    <div class="flex max-w-7xl">
      <!-- Sidebar -->
      <div class="basis-1/4 bg-gray-50 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-6">마이페이지</h2>
        <ul class="text-gray-700 space-y-3">
          <!-- 기본정보 -->
          <li>
            <router-link
              to="/mypage/user/info"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              :class="{ 'bg-gray-200 font-bold': isActive('/mypage/user/info') }"
            >
              기본정보
            </router-link>
          </li>

          <!-- 견적내역 -->
          <li>
            <button
              @click="toggleRequestList"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
            >
              견적내역
            </button>
            <!-- 보낸 요청, 진행 중인 시공 옵션 -->
            <div v-if="showRequestOptions" class="ml-4 mt-2 space-y-2">
              <router-link
                to="/mypage/user/usersaverequest"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
                :class="{ 'bg-gray-200 font-bold': isActive('/mypage/user/usersaverequest') }"
              >
                견적 요청 목록
              </router-link>
              <router-link
                to="/mypage/user/userongoingrequest"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
                :class="{ 'bg-gray-200 font-bold': isActive('/mypage/user/userongoingrequest') }"
              >
                진행 중인 시공
              </router-link>
              <router-link
                to="/mypage/user/usercompleterequest"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
                :class="{ 'bg-gray-200 font-bold': isActive('/mypage/user/usercompleterequest') }"
              >
                완료된 시공
              </router-link>
            </div>
          </li>

          <!-- 후기내역 -->
          <li>
            <router-link
              to="/mypage/user/reviewlist"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              :class="{ 'bg-gray-200 font-bold': isActive('/mypage/user/reviewlist') }"
            >
              후기내역
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Main Content Area -->
      <div class="basis-3/4 bg-white border-[1px] border-gray-200 rounded-lg p-8 ml-8">
        <!-- Router View for Child Routes -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const showRequestOptions = ref(false);
    const route = useRoute();

    const toggleRequestList = () => {
      showRequestOptions.value = !showRequestOptions.value;
    };

    const isActive = (path) => {
      return route.path === path;
    };

    return {
      showRequestOptions,
      toggleRequestList,
      isActive,
    };
  },
};
</script>

<style scoped></style>
