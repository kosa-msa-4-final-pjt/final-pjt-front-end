<template>
  <div v-if="company" class="max-w-4xl mx-auto p-6">
    <!-- 업체 정보 -->
    <div class="flex items-center mb-8">
      <!-- 업체 로고 -->
      <div class="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden mr-6">
        <img
          v-if="company.companyLogoUrl"
          :src="company.companyLogoUrl"
          alt="Company Logo"
          class="object-cover w-full h-full"
        />
        <img v-else src="@/assets/logo.png" alt="Default Company Logo" class="object-cover w-full h-full" />
      </div>
      <!-- 업체 기본 정보 -->
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ company.companyName }}</h2>
        <p class="text-gray-700 mb-1"><strong>대표자:</strong> {{ company.owner }}</p>
        <p class="text-gray-700 mb-1"><strong>사업자번호:</strong> {{ company.companyNumber }}</p>
        <p class="text-gray-700"><strong>개업일:</strong> {{ formatDate(company.publishDate) }}</p>
      </div>
    </div>

    <!-- 업체 설명 -->
    <div class="bg-gray-50 p-6 rounded-lg mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">업체 소개</h3>
      <p class="text-gray-700 leading-relaxed">{{ company.companyDesc }}</p>
    </div>

    <!-- 업체 서비스 -->
    <div class="bg-white p-6 rounded-lg mb-20">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">시공 서비스</h3>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="(service, index) in company.services"
          :key="index"
          class="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full"
        >
          {{ service }}
        </li>
      </ul>
    </div>

    <!-- 업체 시공 사례 -->
    <div v-if="portfolios.length > 0" class="p-6 mb-20">
      <h3 class="text-xl font-semibold text-gray-900 mb-6">업체 시공 사례</h3>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <CompanyPortfolioCard v-for="portfolio in portfolios" :key="portfolio.id" :portfolio="portfolio" />
      </div>
      <!-- <div v-if="currentPortfolioPage < totalPortfolioPages" class="flex justify-center mt-6">
        <button @click="loadMorePortfolios" class="py-2 px-6 bg-midGreen text-white rounded hover:bg-green-600">
          더보기
        </button>
      </div> -->
    </div>

    <!-- 업체 시공 후기 -->
    <div v-if="reviews.length > 0" class="p-6 pb-20 mb-12 border-b-[1px] border-gray-200">
      <h3 class="text-xl font-semibold text-gray-900 mb-6">업체 시공 후기</h3>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <CompanyReviewCard v-for="review in reviews" :key="review.id" :review="review" />
      </div>
      <!-- <div v-if="currentReviewPage < totalReviewPages" class="flex justify-center mt-6">
        <button @click="loadMoreReviews" class="py-2 px-6 bg-midGreen text-white rounded hover:bg-green-600">
          더보기
        </button>
      </div> -->
    </div>

    <!-- 업체 추가 정보 -->
    <div class="bg-gray-50 p-6 rounded-lg mb-12">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">기본 정보</h3>
      <p class="text-gray-700 mb-2"><strong>주소:</strong> {{ company.address }}</p>
      <p class="text-gray-700 mb-2"><strong>연락처:</strong> {{ formatPhoneNumber(company.phoneNumber) }}</p>
      <p class="text-gray-700"><strong>평점:</strong> {{ company.rating }} / 5.0</p>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-gray-700">Loading...</p>
  </div>
</template>

<script>
import CompanyPortfolioCard from './CompanyPortfolioCard.vue';
import CompanyReviewCard from './CompanyReviewCard.vue';
import { instance } from '@/utils/axiosUtils';

export default {
  components: { CompanyPortfolioCard, CompanyReviewCard },

  data() {
    return {
      company: null,
      portfolios: [],
      reviews: [],
      // currentPortfolioPage: 1,
      // currentReviewPage: 1,
      // pageSize: 1,
      // totalPortfolioPages: 1,
      // totalReviewPages: 1,
    };
  },
  mounted() {
    this.fetchCompany();
  },
  methods: {
    async fetchCompany() {
      const companyId = this.$route.params.id;
      try {
        const response = await instance.get(`/api/company/${companyId}`);
        this.company = response.data;
        this.portfolios = this.company.responses.list.slice(0, 3);
        this.reviews = this.company.reviews.list.slice(0, 3);
        // this.totalPortfolioPages = this.company.responses.totalPage;
        // this.totalReviewPages = this.company.reviews.totalPage;
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    },

    // async loadMorePortfolios() {
    //   if (this.currentPortfolioPage < this.totalPortfolioPages) {
    //     this.currentPortfolioPage += 1;
    //     const companyId = this.$route.params.id;
    //     try {
    //       const response = await axios.get(
    //         `/api/company/${companyId}?page=${this.currentPortfolioPage + 1}&size${this.pageSize}`
    //       );
    //       this.portfolios.push(...response.data.responses.slice);
    //       console.log(response.data);
    //     } catch (error) {
    //       console.error('Error loading more portfolios:', error);
    //     }
    //   }
    // },

    // async loadMoreReviews() {
    //   if (this.currentReviewPage < this.totalReviewPages) {
    //     this.currentReviewPage += 1;
    //     const companyId = this.$route.params.id;
    //     try {
    //       const response = await axios.get(
    //         `/api/company/${companyId}?page=${this.currentReviewPage}&size=${this.pageSize}`
    //       );
    //       this.reviews.push(...response.data.reviews.slice);
    //     } catch (error) {
    //       console.error('Error loading more reviews:', error);
    //     }
    //   }
    // },

    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('ko-KR', options);
    },

    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    },
  },
};
</script>

<style scoped></style>
