<template>
  <div class="pb-[40px]">
    <!-- 총 시공 사례 개수 표시 -->
    <p v-if="totalPortfolios" class="text-lg font-medium py-4 mb-6">
      총
      <strong class="text-xl">{{ totalPortfolios }}개의 시공 사례</strong>
    </p>

    <!-- 포트폴리오가 있을 때 -->
    <div v-if="portfolios.length > 0" class="flex items-center flex-wrap gap-[20px]">
      <portfolio-card v-for="portfolio in portfolios" :key="portfolio.id" :portfolio="portfolio"></portfolio-card>
    </div>

    <!-- 포트폴리오가 없을 때 -->
    <div v-else class="pt-20 text-center text-gray-600 text-lg font-medium">시공 사례가 없습니다.</div>

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
</template>

<script>
import axios from 'axios';
import PortfolioCard from './PortfolioCard.vue';

export default {
  components: { PortfolioCard },
  data() {
    return {
      portfolios: [], // 포트폴리오 리스트
      currentPage: 0, // 현재 페이지 번호
      pageSize: 1, // 페이지당 항목 수
      totalPage: 1, // 더 불러올 포트폴리오가 있는지 여부
      totalPortfolios: 0,
    };
  },
  mounted() {
    this.fetchPortfolios(); // 초기 포트폴리오 데이터 불러오기
  },
  methods: {
    async fetchPortfolios() {
      try {
        const response = await axios.get(`/api/portfolio/page?size=${this.pageSize}&page=${this.currentPage}`);
        console.log(response.data);
        this.totalPage = response.data.totalPage;
        this.totalPortfolios = response.data.list.length;
        this.portfolios.push(...response.data.slice);
      } catch (error) {
        console.error('Error fetching portfolio data: ', error);
      }
    },
    // 더보기 버튼 클릭 시 호출될 메서드
    async loadMore() {
      if (this.currentPage + 1 < this.totalPage) {
        this.currentPage += 1;
        await this.fetchPortfolios();
      }
    },
  },
};
</script>

<style scoped></style>
