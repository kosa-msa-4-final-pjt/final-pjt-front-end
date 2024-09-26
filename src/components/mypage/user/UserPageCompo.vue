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
            <!-- 보낸 요청, 진행 중인 시공 옵션 -->
            <div v-if="showRequestOptions" class="ml-4 mt-2 space-y-2">
              <button
                type="button"
                @click="activeTab = 'save'"
                :class="{ 'bg-gray-200 font-bold': activeTab === 'save' }"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              >
                견적 요청 목록(이름 변경 필요)
              </button>
              <button
                type="button"
                @click="activeTab = 'ongoing'"
                :class="{ 'bg-gray-200 font-bold': activeTab === 'ongoing' }"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              >
                진행 중인 시공(이름 변경 필요)
              </button>
              <button
                type="button"
                @click="activeTab = 'complete'"
                :class="{ 'bg-gray-200 font-bold': activeTab === 'complete' }"
                class="block w-full p-2 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
              >
                완료된 시공(이름 변경 필요)
              </button>
            </div>
          </li>

          <!-- 후기내역 -->
          <li>
            <button
              @click="activeTab = 'reviewlist'"
              :class="{ 'bg-gray-200 font-bold': activeTab === 'reviewlist' }"
              class="block w-full p-3 rounded-lg hover:bg-gray-100 transition duration-300 text-left"
            >
              후기내역
            </button>
          </li>
        </ul>
      </div>

      <!-- Main Content Area -->
      <div class="basis-3/4 bg-white border-[1px] border-gray-200 rounded-lg p-8 ml-8">
        <!-- 동적 컴포넌트 렌더링 -->
        <component :is="activeComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import UserSaveRequests from './UserSaveRequests.vue';
import UserReviewList from './review/UserReviewList.vue';
import UserBaseInfo from './UserBaseInfo.vue';
import UserOnGoingRequests from './UserOnGoingRequests.vue';
import UserCompleteRequests from './UserCompleteRequests.vue';

export default {
  data() {
    return {
      showRequestOptions: false, // 견적내역 클릭 시 보낸/진행 중인 요청 옵션을 보여줄지 여부
      activeTab: 'info', // 기본값은 기본정보
    };
  },
  computed: {
    activeComponent() {
      switch (this.activeTab) {
        case 'info':
          return UserBaseInfo;
        case 'save':
          return UserSaveRequests;
        case 'ongoing':
          return UserOnGoingRequests;
        case 'complete':
          return UserCompleteRequests;
        case 'reviewlist':
          return UserReviewList;
        default:
          return UserBaseInfo;
      }
    },
  },
  methods: {
    toggleRequestList() {
      this.showRequestOptions = !this.showRequestOptions;
    },
  },
};
</script>

<style scoped></style>
