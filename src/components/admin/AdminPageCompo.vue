<template>
  <div class="container mx-auto p-6">
    <!-- Sidebar -->
    <div class="flex max-w-7xl">
      <div class="basis-1/4 bg-white shadow-md rounded-lg p-4 whitespace-nowrap">
        <h2 class="text-lg font-semibold mb-4">관리자페이지</h2>
        <ul class="text-gray-800">
          <!-- 업체 관리 -->
          <li class="mb-2">
            <button
              @click="toggleMenu('companyManagement')"
              class="block w-full text-left p-2 rounded hover:bg-gray-200"
            >
              업체관리
            </button>
            <!-- 멤버십, 시공사례 관리 토글 버튼 -->
            <div v-if="activeMenu === 'companyManagement'" class="ml-4 mt-2">
              <router-link
                to="/mypage/admin/adminCompanyList"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >업체 가입 관리</router-link
              >
              <router-link
                to="/mypage/admin/adminCompanyPortfolioList"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
              >
                시공 사례 관리
              </router-link>
            </div>
          </li>
          <!-- 고객 관리 -->
          <li class="mb-2">
            <button
              @click="toggleMenu('customerManagement')"
              class="block w-full text-left p-2 rounded hover:bg-gray-200"
            >
              고객관리
            </button>
            <!-- 고객 관리, 시공후기 관리 토글 버튼 -->
            <div v-if="activeMenu === 'customerManagement'" class="ml-4 mt-2">
              <router-link
                to="/mypage/admin/adminMemberList"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >고객 가입 관리</router-link
              >
              <router-link
                to="/mypage/admin/adminMemberReviewList"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >시공 후기 관리</router-link
              >
            </div>
          </li>
          <!-- 멤버십 관리(상품) -->
          <li class="mb-2">
            <button
              @click="toggleMenu('membershipManagement')"
              class="block w-full text-left p-2 rounded hover:bg-gray-200"
            >
              멤버십 관리
            </button>
            <!-- 멤버십 관리 토글 버튼 -->
            <div v-if="activeMenu === 'membershipManagement'" class="ml-4 mt-2">
              <router-link
                to="/mypage/admin/adminCompanyMembershipList"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >멤버십 가입자 관리</router-link
              >
              <router-link
                to="/mypage/admin/adminMembershipList"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >멤버십 관리</router-link
              >
            </div>
          </li>
          <!-- 플랫폼 관리 -->
          <li class="mb-2">
            <button
              @click="toggleMenu('platformManagement')"
              class="block w-full text-left p-2 rounded hover:bg-gray-200"
            >
              플랫폼관리
            </button>
            <!-- 공지사항, FAQ, 1:1 문의 관리 토글 버튼 -->
            <div v-if="activeMenu === 'platformManagement'" class="ml-4 mt-2">
              <router-link
                to="/mypage/admin/adminnoticelist"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >공지사항 관리</router-link
              >
              <router-link
                to="/mypage/admin/adminfaqlist"
                activeClass="bg-gray-200"
                class="block w-full text-left p-2 rounded hover:bg-gray-100 whitespace-nowrap"
                >FAQ 관리</router-link
              >
            </div>
          </li>
        </ul>
      </div>
      <!-- 메뉴에 따른 내용 -->
      <div class="basis-3/4 bg-gray-100 shadow-md rounded-lg p-6 ml-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: '',
    };
  },
  methods: {
    toggleMenu(menuName) {
      this.activeMenu = this.activeMenu === menuName ? '' : menuName;
    },
  },
};
</script>

<style></style>
