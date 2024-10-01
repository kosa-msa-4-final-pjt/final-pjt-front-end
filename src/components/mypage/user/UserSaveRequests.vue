<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">견적 요청 목록</h3>
    </div>

    <div v-if="estimateRequests.length > 0">
      <!-- 토글 리스트 -->
      <ul class="list-none p-0">
        <li
          v-for="(estimateRequest, index) in estimateRequests"
          :key="index"
          class="border border-gray-300 p-4 mb-2 rounded-lg"
        >
          <div class="flex justify-between items-center">
            <div>
              <span>{{ estimateRequest.address }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-500">{{
                '등록 날짜: ' + new Date(estimateRequest.regDate).toISOString().split('T')[0]
              }}</span>
              <button @click="toggle(estimateRequest, index)">
                <span v-if="isOpen[index]" class="text-xs p-1">▲</span>
                <span v-else class="text-xs p-1">▼</span>
              </button>
            </div>
          </div>

          <!-- 카드 형식으로 보여주는 부분 -->
          <div v-if="isOpen[index]" class="bg-gray-100 mt-2 p-4 shadow rounded">
            <!-- 조건: estimates 배열이 있는지 확인하고 비어있는 경우 메시지 표시 -->
            <div v-if="!estimateRequest.estimates || estimateRequest.estimates.length === 0">
              해당 요청은 견적이 없습니다.
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(estimate, estimateIndex) in estimateRequest.estimates"
                :key="estimateIndex"
                class="border border-gray-300 rounded-lg pb-4 px-4 bg-white transition-shadow duration-300 ease-in-out cursor-pointer border-box hover:shadow-md"
                @click="estimateDetail(estimateRequest, estimate)"
              >
                <div class="w-full h-[125px] flex justify-center items-center border-b">
                  <img
                    :src="estimate.companyLogoUrl ? estimate.companyLogoUrl : require('@/assets/logo.png')"
                    alt="로고"
                    class="w-[100%] h-[100px] object-cover rounded-lg"
                  />
                </div>
                <div class="">
                  <p class="my-2 font-semibold">{{ estimate.companyName }}</p>
                  <div class="flex justify-between">
                    <p class="text-xs text-gray-500">{{ estimate.completeEstimateCount }}건의 공사</p>
                    <p class="text-xs text-midGreen">
                      <font-awesome-icon icon="star" />
                      <span class="ml-1">{{ estimate.rating }}</span>
                    </p>
                  </div>
                </div>
                <div class="text-right mt-4">
                  <p class="font-semibold">예상 금액: {{ estimate.totalPrice }}만원</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 작성한 견적 요청이 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">작성한 견적 요청이 없습니다.</p>
    </div>
  </div>

  <!-- 모달 -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-[400px] shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">상세 견적</h2>
        <button class="font-bold text-black p-2 mr-2" @click="closeModal">x</button>
        <!-- 아이콘으로 변경? -->
      </div>

      <!-- 모달 내용 -->
      <div v-if="selectedEstimate">
        <div class="flex items-center mb-4">
          <img
            :src="selectedEstimate.companyLogoUrl ? selectedEstimate.companyLogoUrl : require('@/assets/logo.png')"
            alt="Company Logo"
            class="w-[100px] h-[100px] object-contain mr-4 rounded-lg"
          />
          <div>
            <p class="font-semibold">{{ selectedEstimate.companyName }}</p>
            <p class="text-sm text-midGreen flex items-center">
              <font-awesome-icon icon="star" />
              <span class="ml-1">{{ selectedEstimate.rating }}</span>
            </p>
          </div>
        </div>

        <!-- Construction prices -->
        <div class="mb-4">
          <h3 class="font-semibold">공사 항목별 가격</h3>
          <ul>
            <li v-for="(price, constructionType) in selectedEstimate.constructionPrices" :key="constructionType">
              {{ constructionType }}: {{ price }} 만원
            </li>
          </ul>
        </div>

        <div class="font-semibold text-right">총 가격: {{ selectedEstimate.totalPrice }} 만원</div>
      </div>

      <!-- 모달 액션 -->
      <div class="mt-4 flex justify-end">
        <button
          class="bg-gray-300 rounded-lg py-2 px-4 mr-2"
          @click="reject(selectedEstimate, selectedEstimate.requestId)"
        >
          거절
        </button>
        <button
          class="bg-midGreen text-white rounded-lg py-2 px-4"
          @click="accept(selectedEstimate, selectedEstimate.requestId)"
        >
          승인
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import authInstance from '@/utils/axiosUtils';

export default {
  setup() {
    const estimateRequests = ref([]); // 견적 요청 목록
    const showModal = ref(false); // 모달 상태
    const selectedEstimate = ref({}); // 선택된 견적 정보
    const isOpen = ref([]); // 각 항목의 토글 상태를 저장

    // 견적 요청 목록 가져오기
    const fetchEstimateRequests = async () => {
      try {
        const response = await authInstance.get('/api/estimaterequests/users', {
          params: {
            status: 'WAITING',
          },
        });
        console.log(response.data);
        estimateRequests.value = response.data; // 응답 데이터를 estimateRequests에 저장
      } catch (error) {
        console.error('견적 요청 리스트를 가져오는데 실패했습니다.', error);
      }
    };

    // 토글 기능
    const toggle = async (estimateRequest, index) => {
      try {
        if (!estimateRequest.estimates) {
          const response = await authInstance.get(`/api/estimaterequests/${estimateRequest.requestId}/estimates/sent`);
          estimateRequest.estimates = response.data; // 각 요청별로 견적 목록 저장
        }
        console.log(estimateRequest.estimates);
        isOpen.value[index] = !isOpen.value[index]; // 토글 상태 변경
      } catch (error) {
        console.error('견적 리스트를 가져오는데 실패했습니다.', error);
      }
    };

    const estimateDetail = async (estimateRequest, estimate) => {
      try {
        if (estimate && estimate.estimateId) {
          const response = await authInstance.get(
            `/api/estimaterequests/${estimateRequest.requestId}/estimates/${estimate.estimateId}`
          );
          console.log(response);
          console.log(response.data);
          // 모달을 열고 해당 견적 상세 정보를 표시
          openModal(response.data, estimateRequest.requestId);
        } else {
          console.error('유효한 estimateId를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('상세 견적을 가져오는데 실패했습니다.', error);
      }
    };

    const accept = async (estimate, requestId) => {
      const isConfirm = confirm('승인하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        await authInstance.post(`/api/estimaterequests/${requestId}/estimates/${estimate.estimateId}/accept`);
        alert('승인이 완료되었습니다.');
        closeModal;
        window.location.reload();
      } catch (error) {
        console.log('승인 실패했습니다.', error);
      }
    };

    const reject = async (estimate, requestId) => {
      try {
        const isConfirm = confirm('정말로 거절하시겠습니까?');
        if (!isConfirm) {
          return;
        }
        await authInstance.post(`/api/estimaterequests/${requestId}/estimates/${estimate.estimateId}/reject`);
        closeModal;
        window.location.reload();
      } catch (error) {
        console.log('거절 실패했습니다.', error);
      }
    };

    // 모달 열기
    const openModal = (estimateData, requestId) => {
      selectedEstimate.value = { ...estimateData, requestId }; // requestId를 선택된 견적 데이터에 추가
      showModal.value = true;
    };

    // 모달 닫기
    const closeModal = () => {
      showModal.value = false;
    };

    // 컴포넌트가 생성될 때 견적 요청 목록을 가져옴
    fetchEstimateRequests();

    return {
      estimateRequests,
      showModal,
      selectedEstimate,
      isOpen,
      toggle,
      openModal,
      closeModal,
      estimateDetail,
      accept,
      reject,
    };
  },
};
</script>

<style scoped></style>
