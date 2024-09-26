<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <!-- 제목 -->
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">견적 요청 목록</h3>
    </div>

    <!-- 견적 요청이 있을 경우 목록을 보여주고, 없을 경우 메시지를 보여줌 -->
    <div v-if="estimates.length > 0">
      <ul class="space-y-6">
        <li
          v-for="(estimate, index) in estimates"
          :key="index"
          class="bg-white p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <!-- 상단 정보 섹션 -->
          <div class="grid grid-cols-2 gap-x-6 mb-1">
            <p class="text-base text-gray-700 mb-2"><strong>요청자</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ estimate.nickName }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>요청 날짜</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ formatDate(estimate.regDate) }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>건물 유형</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ estimate.buildingTypeName }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>평수</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ estimate.floor }} 평</p>
          </div>

          <!-- 예산, 일정 정보 섹션 -->
          <div class="grid grid-cols-2 gap-x-6 mb-1">
            <p class="text-base text-gray-700 mb-2"><strong>예산</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ estimate.budget }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>예상 일정</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ estimate.schedule }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>주소</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ estimate.fullAddress }}</p>
          </div>

          <!-- 시공 서비스 섹션 -->
          <div>
            <p class="font-semibold text-gray-800 mb-2 text-base">시공 서비스</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(service, index) in estimate.constructionTypes"
                :key="index"
                class="font-medium bg-gray-100 text-gray-700 rounded-full text-sm px-3 py-1"
              >
                {{ service }}
              </span>
            </div>
          </div>

          <!-- 버튼 섹션 -->
          <div class="mt-6 text-right">
            <button
              v-if="!estimate.send"
              class="w-full bg-midGreen text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
              @click="openModal(estimate)"
            >
              견적 보내기
            </button>
            <div v-else-if="estimate.send && estimate.status !== null" class="flex gap-2 justify-end">
              <button
                class="w-full bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
              <button
                class="w-full bg-midGreen text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                수정
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 견적 요청이 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">받은 견적 요청이 없습니다.</p>
    </div>

    <!-- 견적 보내기 모달 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 class="text-lg font-semibold mb-4">견적 보내기</h2>

        <!-- 시공 타입별 입력 필드 -->
        <div v-for="(constructionType, index) in selectedEstimate.constructionTypes" :key="index" class="mb-4">
          <label :for="'constructionType-' + index" class="block mb-1 font-medium text-base">{{
            constructionType
          }}</label>
          <input
            type="text"
            :id="'constructionType-' + index"
            v-model="constructionTypeInputs[index]"
            class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-midGreen focus:outline-none text-base"
            placeholder="해당 시공 타입의 금액을 입력하세요"
          />
        </div>

        <!-- 모달 액션 -->
        <div class="mt-4 flex justify-end">
          <button
            class="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg mr-2 hover:bg-gray-400 transition"
            @click="closeModal"
          >
            취소
          </button>
          <button
            class="bg-midGreen text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
            @click="submitEstimate"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authInstance from '@/utils/axiosUtils';

export default {
  data() {
    return {
      estimates: [],
      showModal: false,
      selectedEstimate: {},
      constructionTypeInputs: [],
      estimateDetails: [],
    };
  },
  created() {
    this.fetchEstimates();
  },
  methods: {
    async fetchEstimates() {
      try {
        const response = await authInstance.get('/api/estimaterequests', {
          params: { status: 'WAITING' },
        });
        this.estimates = response.data;
      } catch (error) {
        console.error('견적 리스트를 가져오는데 실패했습니다.', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일`;
    },
    async openModal(estimate) {
      this.selectedEstimate = estimate;
      this.constructionTypeInputs = estimate.constructionTypes.map(() => '');
      try {
        const response = await authInstance.get(`/api/estimaterequests/${estimate.requestId}/write`);
        this.estimateDetails = response.data;
        this.estimateDetails.forEach((detail, index) => {
          this.constructionTypeInputs[index] = detail.estimatedPrice || '';
        });
        this.showModal = true;
      } catch (error) {
        console.error('견적 상세 정보를 가져오는데 실패했습니다.', error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    async submitEstimate() {
      const isConfirm = confirm('견적을 보내시겠습니까?');
      if (!isConfirm) return;

      try {
        const constructionPrices = {};
        this.constructionTypeInputs.forEach((price, index) => {
          constructionPrices[`${this.estimateDetails[index].estimateConstructionTypeId}`] = price;
        });
        await authInstance.post(`/api/estimaterequests/${this.selectedEstimate.requestId}/write`, {
          constructionPrices,
        });
        this.closeModal();
        window.location.reload();
      } catch (error) {
        console.error('견적 금액을 제출하는 데 실패했습니다.', error);
      }
    },
  },
};
</script>
