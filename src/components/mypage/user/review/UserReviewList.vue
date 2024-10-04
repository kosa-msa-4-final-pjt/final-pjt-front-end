<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">내 후기 내역</h3>
    </div>

    <div v-if="reviews.length > 0">
      <div class="flex flex-col space-y-4">
        <!-- 후기 목록 -->
        <ReviewCompo v-for="review in reviews" :key="review.id" :review="review" />

        <!-- 더보기 버튼 -->
        <div v-if="currentPage + 1 < totalPage" class="flex justify-center pt-4">
          <button
            @click="loadMore"
            class="px-6 py-2 bg-midGreen text-white rounded-md shadow-sm transition duration-300"
          >
            더보기
          </button>
        </div>
      </div>
    </div>

    <!-- 작성한 후기가 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">작성한 후기가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';
import ReviewCompo from './ReviewCompo.vue';

export default {
  components: {
    ReviewCompo,
  },
  data() {
    return {
      reviews: [], // 후기 목록
      pageSize: 6, // 페이지당 후기 개수
      currentPage: 0, // 현재 페이지 번호
      totalPage: 1, // 전체 페이지 수
    };
  },
  mounted() {
    this.fetchReviews(); // 초기 데이터 불러오기
  },
  methods: {
    // 후기 데이터를 불러오는 메서드
    async fetchReviews() {
      try {
        const response = await authInstance.get(`/api/reviews/mypage?page=${this.currentPage}&size=${this.pageSize}`);
        console.log(response.data.slice);

        // 전체 페이지 수 설정
        this.totalPage = response.data.totalPage;

        // 가져온 데이터를 기존 데이터에 추가
        this.reviews.push(...response.data.slice);
      } catch (error) {
        console.error('유저 정보를 가져오지 못했습니다.', error);
      }
    },

    // 더보기 버튼 클릭 시 호출되는 메서드
    async loadMore() {
      if (this.currentPage + 1 < this.totalPage) {
        this.currentPage += 1; // 페이지 번호 증가
        await this.fetchReviews(); // 다음 페이지 데이터 불러오기
      }
    },
  },
};
</script>

<style scoped></style>
