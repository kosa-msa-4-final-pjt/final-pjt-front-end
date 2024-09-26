<template>
  <div>
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">완료된 시공 목록</h3>
    </div>

    <!-- 토글 리스트 -->
    <ul class="list-none p-0">
      <li
        v-for="(estimateRequest, index) in estimateRequests"
        :key="index"
        class="border border-gray-300 p-4 mb-2 rounded-lg"
      >
        <div class="flex justify-between items-center">
          <div>
            <span>{{ '견적 ' + (index + 1) }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-500">{{
              '등록 날짜: ' + new Date(estimateRequest.regDate).toISOString().split('T')[0]
            }}</span>
            <button @click="toggle(estimateRequest, index)">
              <span v-if="isOpen[index]">▲</span>
              <span v-else>▼</span>
            </button>
          </div>
        </div>

        <!-- 카드 형식으로 보여주는 부분 -->
        <div v-if="isOpen[index]" class="bg-gray-100 mt-2 p-4 shadow rounded">
          <!-- 조건: estimates 배열이 있는지 확인하고 비어있는 경우 메시지 표시 -->
          <div v-if="!selectedEstimateRequestsMap[index]">해당 요청은 견적이 없습니다.</div>
          <div v-else class="border border-gray-300 rounded-lg pb-4 px-4 bg-white">
            <div class="flex justify-between items-center border-b">
              <div class="w-full h-[125px] flex justify-start items-center">
                <img
                  :src="
                    selectedEstimateRequestsMap[index].companyLogoUrl
                      ? selectedEstimateRequestsMap[index].companyLogoUrl
                      : require('@/assets/logo.png')
                  "
                  alt="로고"
                  class="w-[100px] h-[100px] object-contain"
                />
                <div class="">
                  <p class="text-lg my-2 font-semibold">{{ selectedEstimateRequestsMap[index].companyName }}</p>

                  <p class="text-sm text-gray-500">
                    {{ selectedEstimateRequestsMap[index].countOfCompleteEstimate }}건의 공사
                  </p>
                  <p class="text-sm text-midGreen">
                    <font-awesome-icon icon="star" />
                    <span class="ml-1">{{ selectedEstimateRequestsMap[index].rating }}</span>
                  </p>
                </div>
              </div>
              <div class="w-[500px] text-right mr-3">
                <p>이메일 {{ selectedEstimateRequestsMap[index].companyEmail }}</p>
                <p>주소 {{ selectedEstimateRequestsMap[index].companyAddress }}</p>
                <p>전화번호 {{ selectedEstimateRequestsMap[index].phoneNumber }}</p>
              </div>
            </div>

            <div class="text-right mt-4">
              <ul>
                <li
                  v-for="(price, constructionType) in selectedEstimateRequestsMap[index].constructionPrices"
                  :key="constructionType"
                >
                  {{ constructionType }}: {{ price }} 만원
                </li>
              </ul>
              <p class="font-semibold">예상 금액: {{ selectedEstimateRequestsMap[index].totalPrice }}만원</p>
            </div>
            <div class="mt-4 flex justify-end">
              <button class="bg-gray-300 rounded-lg py-2 px-4 mr-2" @click="cancel(estimateRequest)">취소</button>
              <button class="bg-midGreen text-white rounded-lg py-2 px-4" @click="complete(estimateRequest)">
                완료
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';
import authInstance from '@/utils/axiosUtils';

export default {
  setup() {
    const estimateRequests = ref([]); // 견적 요청 목록
    const isOpen = ref([]); // 각 항목의 토글 상태를 저장
    const selectedEstimateRequestsMap = ref({}); // 각 견적별로 저장된 데이터

    // 승인 견적 목록 가져오기
    const fetchEstimateRequests = async () => {
      try {
        const response = await authInstance.get('/api/estimaterequests/users', {
          params: {
            status: 'ONGOING',
          },
        });
        estimateRequests.value = response.data; // 응답 데이터를 estimateRequests에 저장
        console.log('여기: ' + estimateRequests.value);
      } catch (error) {
        console.error('견적 요청 리스트를 가져오는데 실패했습니다.', error);
      }
    };

    // 토글 기능
    const toggle = async (estimateRequest, index) => {
      try {
        if (!selectedEstimateRequestsMap.value[index]) {
          const response = await authInstance.get(
            `/api/estimaterequests/${estimateRequest.requestId}/estimates/accept`
          );
          selectedEstimateRequestsMap.value[index] = response.data; // 해당 인덱스의 견적 정보를 저장
        }
        console.log('여기2: ' + selectedEstimateRequestsMap.value[index]);
        isOpen.value[index] = !isOpen.value[index]; // 토글 상태 변경
      } catch (error) {
        console.error('견적 리스트를 가져오는데 실패했습니다.', error);
      }
    };

    // 시공 취소
    const cancel = async (estimateRequest) => {
      const isConfirm = confirm('정말로 취소하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        authInstance.post(`/api/estimaterequests/${estimateRequest.requestId}/cancel`);
        window.location.reload();
      } catch (error) {
        console.log('취소를 실패했습니다.', error);
      }
    };

    // 시공 완료
    const complete = async (estimateRequest) => {
      const isConfirm = confirm('시공을 완료하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        authInstance.post(`/api/estimaterequests/${estimateRequest.requestId}/complete`);
        window.location.reload();
      } catch (error) {
        console.log('시공 완료를 실패했습니다.', error);
      }
    };

    // 컴포넌트가 생성될 때 견적 요청 목록을 가져옴
    fetchEstimateRequests();

    return {
      estimateRequests,
      isOpen,
      selectedEstimateRequestsMap,
      toggle,
      cancel,
      complete,
    };
  },
};
</script>

<style scoped></style>
