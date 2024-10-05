<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">보낸 요청 내역</h3>
    </div>

    <!-- 보낸 요청이 있을 때 보여줌 -->
    <div v-if="filteredSentRequests.length > 0">
      <ul class="space-y-6">
        <li
          v-for="(request, index) in filteredSentRequests"
          :key="index"
          class="bg-white p-6 border border-gray-200 rounded-lg shadow flex flex-col justify-between"
        >
          <div class="mb-4">
            <span
              v-if="request.estimateStatus === 'SENT'"
              class="font-medium bg-[#f9a825] text-white rounded-full text-sm px-3 py-1"
            >
              보낸 요청
            </span>
            <span
              v-else-if="request.estimateStatus === 'REJECTED'"
              class="font-medium bg-[#d32f2f] text-white rounded-full text-sm px-3 py-1"
            >
              거절된 요청
            </span>
            <span
              v-else-if="request.estimateStatus === 'ACCEPTED'"
              class="font-medium bg-[#4caf50] text-white rounded-full text-sm px-3 py-1"
            >
              진행 중인 시공
            </span>
            <span
              v-else-if="request.estimateStatus === 'COMPLETE'"
              class="font-medium bg-[#0091ea] text-white rounded-full text-sm px-3 py-1"
            >
              완료된 시공
            </span>
          </div>

          <!-- 기본 정보 -->
          <div class="grid grid-cols-2 gap-x-6">
            <p class="text-base text-gray-700 mb-2"><strong>요청자</strong></p>
            <p class="text-base text-gray-800 mb-2">{{ request.memberResponse.nickName }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>건물 유형</strong></p>
            <p class="text-base text-gray-800 mb-2">{{ request.estimateResponse.buildingType }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>평수</strong></p>
            <p class="text-base text-gray-800 mb-2">{{ request.estimateResponse.floor }} 평</p>
          </div>

          <!-- 추가 정보 -->
          <div class="grid grid-cols-2 gap-x-6 mb-1">
            <p class="text-base text-gray-700 mb-2"><strong>예산</strong></p>
            <p class="text-base text-gray-800 mb-2">{{ request.estimateResponse.budget }}만원</p>

            <p class="text-base text-gray-700 mb-2"><strong>예상 일정</strong></p>
            <p class="text-base text-gray-800 mb-2">{{ request.estimateResponse.schedule }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>주소</strong></p>
            <p class="text-base text-gray-800 mb-2">{{ request.estimateResponse.address }}</p>
          </div>

          <!-- 공사 가격 -->
          <div v-if="request.constructionPrices">
            <p class="font-semibold text-gray-800 mb-2 text-base">공사 가격</p>
            <ul class="flex flex-wrap gap-2">
              <li v-for="(price, type) in request.constructionPrices" :key="type">
                <span class="font-medium bg-gray-100 text-gray-700 rounded-full text-sm px-3 py-1">
                  {{ type }}: {{ price }}만원
                </span>
              </li>
            </ul>
          </div>

          <!-- 총 가격 -->
          <p class="font-medium text-gray-700 mt-4 text-right">
            총 가격: <span class="font-semibold">{{ request.totalPrice }}만원 </span>
          </p>

          <!-- 수정 및 취소 버튼 -->
          <div class="mt-4">
            <div v-if="request.estimateStatus === 'SENT'" class="flex w-full">
              <button
                class="w-full mr-4 bg-gray-300 text-gray-800 rounded-lg py-2 px-4 font-medium"
                @click="cancelEstimate(request)"
              >
                취소
              </button>
              <button
                class="w-full bg-midGreen text-white rounded-lg py-2 px-4 font-medium"
                @click="openUpdateModal(request)"
              >
                수정
              </button>
            </div>
            <div v-else-if="request.estimateStatus === 'REJECTED'" class="flex w-full">
              <button
                class="w-full mr-4 bg-gray-300 text-gray-800 rounded-lg py-2 px-4 font-medium"
                @click="cancelEstimate(request)"
              >
                취소
              </button>
              <button
                class="w-full bg-midGreen text-white rounded-lg py-2 px-4 font-medium"
                @click="openUpdateModal(request)"
              >
                견적 다시 보내기
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 보낸 요청이 없을 때 보여줌 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">보낸 견적 요청이 없습니다.</p>
    </div>

    <!-- 수정 모달 -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 class="text-lg font-semibold mb-4">견적 수정하기</h2>
        <div v-for="(constructionType, index) in selectedEstimate.constructionTypes" :key="index" class="mb-4">
          <label :for="'constructionType-' + index" class="block mb-1 font-medium">
            {{ constructionType.typeName }}
          </label>
          <input
            type="text"
            :id="'constructionType-' + index"
            v-model="constructionTypeInputs[index]"
            class="w-full border border-gray-300 p-2 rounded"
            placeholder="해당 시공 타입의 금액을 입력하세요"
          />
        </div>
        <div class="text-right">
          <p class="font-semibold">예상 금액: {{ selectedEstimate.totalPrice }}만원</p>
        </div>

        <div class="mt-4 flex justify-end">
          <button class="bg-gray-300 text-black rounded-lg py-2 px-4 mr-2" @click="closeModal">취소</button>
          <button class="bg-midGreen text-white rounded-lg py-2 px-4" @click="submitUpdateEstimate">수정하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';
import { ref, onMounted, computed } from 'vue';

export default {
  setup() {
    const sentRequests = ref([]);
    const showUpdateModal = ref(false);
    const selectedEstimate = ref({});
    const constructionTypeInputs = ref([]);

    // 보낸 요청 목록 가져오기
    const fetchRequests = async () => {
      try {
        const response = await authInstance.get('/api/estimaterequests/sent');
        sentRequests.value = response.data;
      } catch (error) {
        console.error('보낸 요청 목록을 가져오는데 실패했습니다.', error);
      }
    };

    onMounted(fetchRequests);

    // Computed property to filter out specific requests
    const filteredSentRequests = computed(() => {
      return sentRequests.value.filter((request) => {
        // estimateStatus가 'SENT'이고 estimateRequestStatus가 'WAITING'이 아닌 경우 제외
        if (request.estimateStatus === 'SENT' && request.estimateRequestStatus !== 'WAITING') {
          return false;
        }
        return true;
      });
    });

    // 견적 취소하기
    const cancelEstimate = async (estimate) => {
      if (confirm('정말로 취소하시겠습니까?')) {
        try {
          await authInstance.delete(`/api/estimates/${estimate.estimateId}`);
          await fetchRequests();
        } catch (error) {
          console.error('견적 삭제를 실패했습니다.', error);
        }
      }
    };

    // 수정 모달 열기
    const openUpdateModal = async (request) => {
      try {
        const response = await authInstance.get(`/api/estimates/${request.estimateId}`);
        const constructionPrices = response.data.constructionPrices;

        // 시공 타입별 입력 필드 초기화
        constructionTypeInputs.value = Object.keys(constructionPrices).map(
          (typeId) => constructionPrices[typeId].price || ''
        );

        // 선택된 견적 정보 저장 with typeId
        selectedEstimate.value = {
          ...request,
          totalPrice: response.data.totalPrice,
          constructionTypes: Object.entries(constructionPrices).map(([typeId, details]) => ({
            estimateConstructionTypeId: typeId, // typeId 포함
            typeName: details.typeName, // details에 typeName이 있다고 가정
          })),
        };

        showUpdateModal.value = true;
      } catch (error) {
        console.error('견적 정보를 가져오는데 실패했습니다.', error);
      }
    };

    // 모달 닫기
    const closeModal = () => {
      showUpdateModal.value = false;
    };

    // 견적 금액 수정 후 제출하는 함수
    const submitUpdateEstimate = async () => {
      const isConfirm = confirm('견적을 수정하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        // 시공 타입별 입력된 금액 데이터를 전송할 형식으로 변환
        const constructionPrices = {};
        constructionTypeInputs.value.forEach((price, index) => {
          const typeId = selectedEstimate.value.constructionTypes[index].estimateConstructionTypeId;

          if (!typeId) {
            console.error(`Index ${index}에서 Type ID가 undefined입니다.`);
            return; // typeId가 undefined인 경우 건너뜀
          }

          const parsedPrice = parseFloat(price);
          if (isNaN(parsedPrice)) {
            console.error(`Index ${index}에서 유효하지 않은 가격 입력: ${price}`);
            return; // 유효하지 않은 가격 입력 건너뜀
          }

          constructionPrices[typeId] = parsedPrice; // 금액을 숫자 형식으로 변환
        });

        // 요청 페이로드 준비
        const requestData = {
          constructionPrices: constructionPrices,
        };

        await authInstance.patch(`/api/estimates/${selectedEstimate.value.estimateId}`, requestData);
        closeModal(); // 수정 후 모달 닫기
        window.location.reload();
      } catch (error) {
        console.error('견적 수정을 실패했습니다.', error); // 에러 발생 시 콘솔에 로그 출력
      }
    };

    return {
      filteredSentRequests,
      showUpdateModal,
      selectedEstimate,
      constructionTypeInputs,
      fetchRequests,
      cancelEstimate,
      openUpdateModal,
      closeModal,
      submitUpdateEstimate,
    };
  },
};
</script>

<style scoped></style>
