<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <!-- 제목 -->
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">보낸 요청 내역</h3>
    </div>

    <!-- 보낸 요청이 있을 경우 목록을 보여주고, 없을 경우 메시지를 보여줌 -->
    <div v-if="sentRequests.length > 0">
      <ul class="space-y-6">
        <li
          v-for="(request, index) in sentRequests"
          :key="index"
          class="bg-white p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <!-- 상단 정보 섹션 -->
          <div class="grid grid-cols-2 gap-x-6 mb-1">
            <p class="text-base text-gray-700 mb-2"><strong>요청자</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ request.memberResponse.nickName }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>요청 날짜</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ formatDate(request.regDate) }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>건물 유형</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ request.estimateResponse.buildingType }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>평수</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ request.estimateResponse.floor }} 평</p>
          </div>

          <!-- 예산, 일정 정보 섹션 -->
          <div class="grid grid-cols-2 gap-x-6 mb-1">
            <p class="text-base text-gray-700 mb-2"><strong>예산</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ request.estimateResponse.budget }}만원</p>

            <p class="text-base text-gray-700 mb-2"><strong>예상 일정</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ request.estimateResponse.schedule }}</p>

            <p class="text-base text-gray-700 mb-2"><strong>주소</strong></p>
            <p class="text-base text-gray-700 mb-2">{{ request.estimateResponse.fullAddress }}</p>
          </div>

          <!-- 공사 가격 정보 섹션 -->
          <div v-if="request.constructionPrices">
            <p class="font-semibold text-gray-800 mb-2 text-base">공사 가격</p>
            <ul class="flex flex-wrap gap-2">
              <li v-for="(price, type) in request.constructionPrices" :key="type">
                <span class="font-medium bg-gray-100 text-gray-700 rounded-full text-sm px-3 py-1"
                  >{{ type }}: {{ price }}만원</span
                >
              </li>
            </ul>
          </div>

          <!-- 총 가격 정보 -->
          <p class="text-base text-gray-700 mt-4"><strong>총 가격:</strong> {{ request.totalPrice }}만원</p>
        </li>
      </ul>
    </div>

    <!-- 보낸 요청이 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">보낸 견적 요청이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import authInstance from '@/utils/axiosUtils';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const sentRequests = ref([]);

    const fetchRequests = async () => {
      try {
        const response = await authInstance.get('/api/estimaterequests/sent');
        sentRequests.value = response.data;
      } catch (error) {
        console.error('Failed to fetch sent requests', error);
      }
    };

    onMounted(() => {
      fetchRequests();
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일`;
    };

    return {
      sentRequests,
      formatDate,
    };
  },
};
</script>

<style scoped></style>
