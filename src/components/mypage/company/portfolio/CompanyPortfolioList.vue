<template>
  <div class="p-4 max-w-screen-lg mx-auto">
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">시공 사례 리스트</h3>
    </div>

    <div v-if="portfolios.length > 0">
      <!-- 포트폴리오 그리드 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
        <PortfolioCompo v-for="portfolio in portfolios" :key="portfolio.id" :portfolio="portfolio"></PortfolioCompo>
      </div>

      <!-- 더보기 버튼 -->
      <div v-if="currentPage + 1 < totalPage" class="flex justify-center pt-4">
        <button @click="loadMore" class="px-6 py-2 bg-midGreen text-white rounded-md shadow-sm transition duration-300">
          더보기
        </button>
      </div>
    </div>

    <!-- 작성한 시공 사례가 없을 경우 보여줄 메시지 -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg font-semibold">작성한 시공 사례가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import PortfolioCompo from './PortfolioCompo.vue';
import { instance } from '@/utils/axiosUtils';

export default {
  components: {
    PortfolioCompo,
  },
  data() {
    return {
      portfolios: [], // 포트폴리오 리스트
      currentPage: 0, // 현재 페이지 번호
      pageSize: 6, // 한 페이지에 표시할 포트폴리오 개수
      totalPage: 1, // 총 페이지 수
    };
  },
  mounted() {
    this.fetchPortfolios(); // 컴포넌트가 마운트되었을 때 초기 포트폴리오 데이터 가져오기
  },
  methods: {
    async fetchPortfolios() {
      try {
        const response = await instance.get(`/api/portfolio/page?size=${this.pageSize}&page=${this.currentPage}`);
        console.log(response.data);
        this.totalPage = response.data.totalPage; // 총 페이지 수 업데이트
        this.portfolios.push(...response.data.slice); // 기존 포트폴리오 목록에 새로운 데이터 추가
      } catch (error) {
        console.error('Error fetching portfolio data: ', error);
      }
    },
    async loadMore() {
      if (this.currentPage + 1 < this.totalPage) {
        this.currentPage += 1; // 페이지 번호 증가
        await this.fetchPortfolios(); // 다음 페이지 데이터 가져오기
      }
    },
  },
};
</script>

<style scoped></style>
