<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">완료된 시공 목록</h3>
    </div>

    <div v-if="estimateRequests.length > 0">
      <!-- 토글 리스트 -->
      <ul class="list-none p-0">
        <li
          v-for="(estimateRequest, index) in estimateRequests"
          :key="index"
          class="border border-gray-300 p-4 mb-4 rounded-lg shadow-md transition-all"
        >
          <!-- 상단 정보 -->
          <div class="flex-column justify-between items-center">
            <div class="flex justify-between">
              <div class="text-lg font-semibold text-gray-700">
                {{ estimateRequest.address }}
              </div>
              <div class="flex items-center space-x-4">
                <button @click="toggle(estimateRequest, index)" class="text-midGreen font-semibold">
                  <span v-if="isOpen[index]" class="text-sm">▲</span>
                  <span v-else class="text-sm">▼</span>
                </button>
              </div>
            </div>
            <span class="text-gray-500 text-sm">{{
              '등록 날짜: ' + new Date(estimateRequest.regDate).toISOString().split('T')[0]
            }}</span>
          </div>

          <!-- 카드 내용 (펼쳤을 때 표시) -->
          <div v-if="isOpen[index]" class="bg-gray-50 mt-4 p-6 rounded-lg transition-all duration-300">
            <!-- 견적이 없을 때 -->
            <div v-if="!selectedEstimateRequestsMap[index]" class="text-gray-600">해당 요청은 견적이 없습니다.</div>

            <!-- 견적 내용 -->
            <div v-else class="border border-gray-200 rounded-lg p-4 bg-white">
              <div class="flex items-start space-x-6 border-b pb-4 mb-4">
                <!-- 회사 로고 -->
                <img
                  :src="
                    selectedEstimateRequestsMap[index].companyLogoUrl
                      ? selectedEstimateRequestsMap[index].companyLogoUrl
                      : require('@/assets/logo.png')
                  "
                  alt="로고"
                  class="w-[100px] h-[100px] object-contain rounded-lg"
                />
                <!-- 회사 정보 -->
                <div class="flex-1">
                  <p class="text-lg font-bold text-gray-800 mb-2">
                    {{ selectedEstimateRequestsMap[index].companyName }}
                  </p>
                  <p class="text-sm text-gray-500 mb-1">
                    시공 완료 {{ selectedEstimateRequestsMap[index].countOfCompleteEstimate }}건
                  </p>
                  <p class="flex items-center text-sm text-midGreen">
                    <font-awesome-icon icon="star" class="mr-1" />{{ selectedEstimateRequestsMap[index].rating }}
                  </p>
                </div>
                <!-- 회사 연락처 -->
                <div class="text-right">
                  <table class="w-full table-auto text-left">
                    <tbody>
                      <tr>
                        <td class="text-sm font-medium text-gray-600 py-1 pr-4">이메일</td>
                        <td class="text-sm text-gray-800 py-1">
                          {{ selectedEstimateRequestsMap[index].companyEmail }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-sm font-medium text-gray-600 py-1 pr-4">전화번호</td>
                        <td class="text-sm text-gray-800 py-1">{{ selectedEstimateRequestsMap[index].phoneNumber }}</td>
                      </tr>
                      <tr>
                        <td class="text-sm font-medium text-gray-600 py-1 pr-4">주소</td>
                        <td class="text-sm text-gray-800 py-1">
                          {{ selectedEstimateRequestsMap[index].companyAddress }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 시공 견적 정보 -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <ul class="space-y-2 text-sm text-gray-600">
                  <li
                    v-for="(price, constructionType) in selectedEstimateRequestsMap[index].constructionPrices"
                    :key="constructionType"
                  >
                    {{ constructionType }}: <span class="font-semibold text-gray-800">{{ price }} 만원</span>
                  </li>
                </ul>
                <p class="font-semibold text-right mt-4 text-lg">
                  총 금액: {{ selectedEstimateRequestsMap[index].totalPrice }}만원
                </p>
              </div>

              <!-- 후기 작성 버튼 -->
              <div class="mt-6 flex justify-end">
                <button
                  class="bg-midGreen font-medium text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-600 transition"
                  @click="goToCreateReview(estimateRequest.requestId)"
                >
                  후기 작성
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 완료된 시공이 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">완료된 시공이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import authInstance from '@/utils/axiosUtils';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const estimateRequests = ref([]);
    const isOpen = ref([]);
    const selectedEstimateRequestsMap = ref({});

    const fetchEstimateRequests = async () => {
      try {
        const response = await authInstance.get('/api/estimaterequests/users', { params: { status: 'COMPLETE' } });
        estimateRequests.value = response.data;
      } catch (error) {
        console.error('완료 견적 리스트를 가져오는데 실패했습니다.', error);
      }
    };

    const toggle = async (estimateRequest, index) => {
      try {
        if (!selectedEstimateRequestsMap.value[index]) {
          const response = await authInstance.get(`/api/estimaterequests/users/complete/${estimateRequest.requestId}`);
          selectedEstimateRequestsMap.value[index] = response.data;
        }
        isOpen.value[index] = !isOpen.value[index];
      } catch (error) {
        console.error('견적 리스트를 가져오는데 실패했습니다.', error);
      }
    };

    const goToCreateReview = (requestId) => {
      router.push({ path: '/reviews/create', query: { requestId } });
    };

    fetchEstimateRequests();

    return {
      estimateRequests,
      isOpen,
      selectedEstimateRequestsMap,
      toggle,
      goToCreateReview,
    };
  },
};
</script>

<style scoped>
/* 스타일을 추가하여 전반적인 색상 및 레이아웃을 개선했습니다 */
ul {
  padding-left: 0;
}

li {
  list-style: none;
}

button {
  outline: none;
  transition: all 0.3s ease-in-out;
}
</style>
