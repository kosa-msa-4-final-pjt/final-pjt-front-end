<template>
  <div class="py-5">
    <!-- 총 후기 개수 표시 -->
    <p v-if="reviews.length" class="text-lg font-medium mb-6">
      총
      <strong class="text-xl">{{ totalReviews }}개의 시공 후기</strong>
    </p>

    <!-- 후기가 없을 때 -->
    <p v-else class="pt-20 text-center text-gray-600 text-lg font-medium">시공 후기가 없습니다.</p>

    <!-- 후기 리스트 -->
    <div class="flex flex-col space-y-6">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        class="p-6 bg-white rounded-lg"
      ></ReviewCard>

      <!-- 더보기 버튼 -->
      <div v-if="currentPage + 1 < totalPage" class="flex justify-center">
        <button
          @click="loadMore"
          class="py-4 px-20 my-10 font-medium text-midGreen border-[1px] border-midGreen rounded hover:bg-midGreen hover:text-white transition duration-300"
        >
          더보기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewCard from './ReviewCard.vue';
import { instance } from '@/utils/axiosUtils';

export default {
  data() {
    return {
      reviews: [], // 후기 리스트
      currentPage: 0, // 현재 페이지 번호
      pageSize: 6, // 한 페이지에 표시할 후기 수
      totalPage: 1, // 전체 페이지 수
      totalReviews: 0, // 총 후기 수
    };
  },

  async mounted() {
    await this.fetchReviews(); // 초기 후기 데이터 불러오기
  },

  methods: {
    // 후기 데이터를 서버에서 가져오는 메서드
    async fetchReviews() {
      try {
        const response = await instance.get(`/api/reviews/page?page=${this.currentPage}&size=${this.pageSize}`);
        console.log(response.data);
        this.totalPage = response.data.totalPage;
        this.totalReviews = response.data.list.length;
        this.reviews.push(...response.data.slice);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    },

    // 더보기 버튼 클릭 시 호출될 메서드
    async loadMore() {
      if (this.currentPage + 1 < this.totalPage) {
        this.currentPage += 1;
        await this.fetchReviews();
      }
    },
  },

  components: {
    ReviewCard,
  },
};
</script>

<style scoped></style>
