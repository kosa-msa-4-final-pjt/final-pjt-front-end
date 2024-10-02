<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <!-- 제목 -->
    <div class="mb-6">
      <h3 class="font-bold text-xl text-gray-800">고객들의 시공 요청</h3>
    </div>

    <!-- 견적 요청이 있을 경우 목록을 보여주고, 없을 경우 메시지를 보여줌 -->
    <div v-if="estimates.length > 0">
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <li
          v-for="(estimate, index) in estimates"
          :key="index"
          class="bg-white p-6 border border-gray-200 rounded-lg shadow"
        >
          <!-- 상단 정보 섹션 -->
          <div class="grid grid-cols-2 gap-x-6 mb-2">
            <p class="text-base text-gray-700 mb-1"><strong>요청자</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ estimate.nickName }}</p>

            <p class="text-base text-gray-700 mb-1"><strong>요청 날짜</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ formatDate(estimate.regDate) }}</p>

            <p class="text-base text-gray-700 mb-1"><strong>건물 유형</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ estimate.buildingTypeName }}</p>

            <p class="text-base text-gray-700 mb-1"><strong>평수</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ estimate.floor }} 평</p>
          </div>

          <!-- 예산, 일정 정보 섹션 -->
          <div class="grid grid-cols-2 gap-x-6 mb-2">
            <p class="text-base text-gray-700 mb-1"><strong>예산</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ estimate.budget }}</p>

            <p class="text-base text-gray-700 mb-1"><strong>예상 일정</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ estimate.schedule }}</p>

            <p class="text-base text-gray-700 mb-1"><strong>주소</strong></p>
            <p class="text-base text-gray-800 mb-1 font-normal">{{ estimate.address }}</p>
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
          <div class="w-full mt-4">
            <button
              v-if="estimate.send === false || estimate.status === 'REJECTED'"
              class="w-full bg-midGreen text-white rounded-xl py-2 px-4 font-medium"
              @click="openSendModal(estimate)"
            >
              견적 보내기
            </button>
            <div class="flex" v-else-if="estimate.send === true && estimate.status === 'SENT'">
              <button
                class="w-full mr-4 bg-gray-300 text-gray-800 rounded-lg py-2 px-4 font-medium"
                @click="deleteEstimate(estimate)"
              >
                취소
              </button>
              <button class="w-full bg-midGreen text-white rounded-lg py-2 px-4" @click="openUpdateModal(estimate)">
                수정
              </button>
            </div>
            <div v-else-if="estimate.send === true && estimate.status === 'RECEIVED'">
              <button
                class="w-full mr-4 bg-gray-300 text-gray-800 rounded-lg py-2 px-4 font-medium"
                @click="deleteEstimate(estimate)"
              >
                거절
              </button>
              <button class="w-full bg-midGreen text-white rounded-lg py-2 px-4" @click="openSendModal(estimate)">
                견적 보내기
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 견적 요청이 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">견적 요청이 없습니다.</p>
    </div>

    <!-- 전송 모달 -->
    <div v-if="showSendModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 class="text-lg font-semibold mb-4">견적 보내기</h2>

        <!-- 각 시공 타입별 입력 필드 -->
        <div v-for="(constructionType, index) in selectedEstimate.constructionTypes" :key="index" class="mb-4">
          <label :for="'constructionType-' + index" class="block mb-1 font-medium">{{ constructionType }}</label>
          <input
            type="number"
            :id="'constructionType-' + index"
            v-model="constructionTypeInputs[index]"
            class="w-full border border-gray-300 p-2 rounded"
            placeholder="금액을 입력하세요(단위: 만원)"
            :min="1"
            @input="validateInput(index)"
          />
        </div>

        <!-- 모달 액션 -->
        <div class="mt-4 flex justify-end">
          <button class="bg-gray-300 text-black rounded-lg py-2 px-4 mr-2" @click="closeModal">취소</button>
          <button class="bg-midGreen text-white rounded-lg py-2 px-4" @click="submitEstimate">보내기</button>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 class="text-lg font-semibold mb-4">견적 수정하기</h2>

        <!-- 각 시공 타입별 입력 필드 -->
        <div v-for="(constructionType, index) in selectedEstimate.constructionTypes" :key="index" class="mb-4">
          <label :for="'constructionType-' + index" class="block mb-1 font-medium">{{ constructionType }}</label>
          <input
            type="number"
            :id="'constructionType-' + index"
            v-model="constructionTypeInputs[index]"
            class="w-full border border-gray-300 p-2 rounded"
            placeholder="금액을 입력하세요(단위: 만원)"
            :min="1"
            @input="validateInput(index)"
          />
        </div>
        <div class="text-right">
          <p class="font-semibold">예상 금액: {{ selectedEstimate.totalPrice }}만원</p>
        </div>

        <!-- 모달 액션 -->
        <div class="mt-4 flex justify-end">
          <button class="bg-gray-300 text-black rounded-lg py-2 px-4 mr-2" @click="closeModal">취소</button>
          <button class="bg-midGreen text-white rounded-lg py-2 px-4" @click="submitUpdateEstimate()">수정하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';

export default {
  data() {
    return {
      estimates: [], // 견적 요청 목록을 저장하는 배열
      showSendModal: false, // 모달 표시 여부를 제어하는 변수
      showUpdateModal: false, // 모달 표시 여부를 제어하는 변수
      selectedEstimate: {}, // 선택된 견적 정보를 저장하는 객체
      constructionTypeInputs: [], // 각 시공 타입별 입력 필드 값을 저장하는 배열
      estimateDetails: [], // 견적 상세 정보를 저장하는 배열
    };
  },

  created() {
    this.fetchEstimates(); // 컴포넌트가 생성될 때 견적 요청 목록을 가져옴
  },

  methods: {
    // 견적 요청 목록을 API로부터 가져오는 함수
    async fetchEstimates() {
      try {
        const response = await authInstance.get('/api/estimaterequests', {
          params: { status: 'WAITING' },
        });
        this.estimates = response.data; // 가져온 데이터를 estimates 배열에 저장
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

    // "견적 보내기" 버튼 클릭 시 모달을 열고 견적 정보를 보여주는 함수
    async openSendModal(estimate) {
      this.selectedEstimate = estimate; // 선택된 견적 정보를 저장
      this.constructionTypeInputs = estimate.constructionTypes.map(() => ''); // 각 시공 타입에 대한 입력 필드 초기화

      try {
        // 선택된 견적의 상세 정보를 API로부터 가져옴
        const response = await authInstance.get(`/api/estimaterequests/${estimate.requestId}/write`);
        this.estimateDetails = response.data;

        // 가져온 데이터를 입력 필드에 설정
        this.estimateDetails.forEach((detail, index) => {
          this.constructionTypeInputs[index] = detail.estimatedPrice || ''; // 가격이 있으면 설정, 없으면 빈 문자열
        });

        console.log(this.estimateDetails);
        this.showSendModal = true; // 데이터를 다 가져온 후 모달을 표시
      } catch (error) {
        console.error('견적 상세 정보를 가져오는데 실패했습니다.', error); // 에러 발생 시 콘솔에 로그 출력
      }
    },

    // "수정" 버튼 클릭 시 모달을 열고 견적 정보를 보여주는 함수
    async openUpdateModal(estimate) {
      try {
        // 선택된 견적의 상세 정보를 API로부터 가져옴
        const response = await authInstance.get(`/api/estimates/${estimate.estimateId}`);

        // 예시: response.data.constructionPrices가 객체로 { typeId: { price: number, ... } } 형태라고 가정
        const constructionPrices = response.data.constructionPrices;

        // constructionPrices 객체를 배열으로 변환하여 estimateDetails에 저장
        this.estimateDetails = Object.keys(constructionPrices).map((typeId) => ({
          estimateConstructionTypeId: typeId,
          price: constructionPrices[typeId].price,
        }));

        // constructionTypeInputs를 설정
        this.constructionTypeInputs = this.estimateDetails.map((detail) => detail.price);

        // totalPrice를 selectedEstimate에 추가
        this.selectedEstimate = {
          ...estimate,
          totalPrice: response.data.totalPrice, // 받아온 totalPrice 값 추가
        };
        this.showUpdateModal = true; // 데이터를 다 가져온 후 모달을 표시
      } catch (error) {
        console.error('견적 상세 정보를 가져오는데 실패했습니다.', error); // 에러 발생 시 콘솔에 로그 출력
      }
    },

    // 모달을 닫는 함수
    closeModal() {
      this.showSendModal = false; // 모달을 숨김
      this.showUpdateModal = false; // 모달을 숨김
    },

    // 견적 금액을 제출하는 함수
    async submitEstimate() {
      const isConfirm = confirm('견적을 보내시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        // 시공 타입별 입력 금액 데이터를 서버로 전송할 형식으로 변환
        const constructionPrices = {};
        this.constructionTypeInputs.forEach((price, index) => {
          constructionPrices[`${this.estimateDetails[index].estimateConstructionTypeId}`] = price; // 시공 타입
        });

        // 서버로 POST 요청 전송
        await authInstance.post(`/api/estimaterequests/${this.selectedEstimate.requestId}/write`, {
          constructionPrices, // 전송할 데이터
        });

        this.closeModal(); // 전송 후 모달 닫기
        window.location.reload();
      } catch (error) {
        console.error('견적 금액을 제출하는 데 실패했습니다.', error); // 에러 발생 시 콘솔에 로그 출력
      }
    },

    // 견적 금액 수정 후 제출하는 함수
    async submitUpdateEstimate() {
      const isConfirm = confirm('견적을 수정하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        // 시공 타입별 입력된 금액 데이터를 전송할 형식으로 변환
        const constructionPrices = {};
        this.constructionTypeInputs.forEach((price, index) => {
          const typeId = this.estimateDetails[index].estimateConstructionTypeId;
          constructionPrices[typeId] = parseFloat(price); // 금액을 숫자 형식으로 변환
        });

        // 요청 페이로드 준비
        const requestData = {
          constructionPrices: constructionPrices,
        };

        await authInstance.patch(`/api/estimates/${this.selectedEstimate.estimateId}`, requestData);
        this.closeModal(); // 수정 후 모달 닫기
        window.location.reload();
      } catch (error) {
        console.error('견적 수정을 실패했습니다.', error); // 에러 발생 시 콘솔에 로그 출력
      }
    },

    // 요청이 온 견적을 삭제(거절) 하기
    async deleteEstimate(estimate) {
      const isConfirm = confirm('정말로 삭제하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        await authInstance.delete(`/api/estimates/${estimate.estimateId}`);
        window.location.reload();
      } catch (error) {
        console.log('견적 삭제를 실패했습니다.', error);
      }
    },

    validateInput(index) {
      if (this.constructionTypeInputs[index] < 1) {
        this.constructionTypeInputs[index] = 1;
      }
    },
  },
};
</script>

<style scoped></style>
