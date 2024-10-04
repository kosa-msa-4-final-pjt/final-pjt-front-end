<template>
  <div class="container mx-auto p-6">
    <!-- Sidebar + Main Content Layout -->
    <div class="flex max-w-7xl">
      <!-- Sidebar -->
      <div class="basis-1/3 bg-gray-50 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-6">마이페이지</h2>
        <ul class="text-gray-700 space-y-3">
          <!-- 기본정보 -->
          <li>
            <button
              @click="activeTab = 'info'"
              :class="{ 'bg-gray-200 font-bold': activeTab === 'info' }"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
            >
              기본정보
            </button>
          </li>

          <!-- 견적내역 -->
          <li>
            <button
              @click="toggleRequestList"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
            >
              견적내역
            </button>
            <!-- 보낸 요청, 받은 요청 토글 버튼 -->
            <div v-if="showRequestOptions" class="ml-4 mt-2 space-y-2">
              <button
                type="button"
                @click="activeTab = 'received'"
                :class="{ 'bg-gray-200 font-bold': activeTab === 'received' }"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              >
                받은 요청
              </button>
              <button
                type="button"
                @click="activeTab = 'sent'"
                :class="{ 'bg-gray-200 font-bold': activeTab === 'sent' }"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              >
                보낸 요청
              </button>
            </div>
          </li>

          <!-- 시공사례내역 -->
          <li>
            <button
              @click="activeTab = 'portfolio'"
              :class="{ 'bg-gray-200 font-bold': activeTab === 'portfolio' }"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
            >
              시공사례내역
            </button>
          </li>

          <li>
            <button
              @click="activeTab = 'membership'"
              :class="{ 'bg-gray-200 font-bold': activeTab === 'membership' }"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
            >
              멤버십 관리
            </button>
          </li>
        </ul>
      </div>

      <!-- Main Content Area -->
      <div class="basis-4/5 bg-white border-[1px] border-gray-200 rounded-lg p-8 ml-8">
        <!-- 동적 컴포넌트 렌더링 -->
        <component :is="activeComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyBaseInfo from './CompanyBaseInfo.vue';
import ReceivedRequests from './CompanyReceivedRequests.vue';
import CompanyPortfolioList from './portfolio/CompanyPortfolioList.vue';
import SentRequests from './CompanySentRequests.vue';
import CompanyMembership from './CompanyMembership.vue';

export default {
  data() {
    return {
      showRequestOptions: false, // 견적내역 클릭 시 보낸/받은 요청 버튼을 보여줄지 여부
      activeTab: 'info', // 기본값은 info 컴포넌트
    };
  },

  computed: {
    activeComponent() {
      switch (this.activeTab) {
        case 'info':
          return CompanyBaseInfo;
        case 'sent':
          return SentRequests;
        case 'received':
          return ReceivedRequests;
        case 'portfolio':
          return CompanyPortfolioList;
        case 'membership':
          return CompanyMembership;
        default:
          return CompanyBaseInfo;
      }
    },
  },
  methods: {
    toggleRequestList() {
      this.showRequestOptions = !this.showRequestOptions;
    },

    openModal(companyId) {
      this.isModalOpen.value = true;
      this.refundCompanyId.value = companyId;
    },

    closeModal() {
      this.isModalOpen.value = false;
    },

     closeRefundCompleteModal (){
      this.isRefundComplete.value = false;
    },
  },
};
</script>

<style scoped></style>
