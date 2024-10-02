<template>
  <div>
    <!-- 검색 카테고리 -->
    <div class="w-[1100px] w-max-[1100px] py-2 flex items-center justify-between bg-white fixed top-[80px] z-50">
      <div class="flex items-center justify-start">
        <!-- 지역 선택 -->
        <region-category-compo @region-selected="onRegionSelected" ref="regionCategory" class="mr-3" />
        <!-- 시공 서비스 선택 (select box 형태) -->
        <construction-category-compo
          @services-selected="onServicesSelected"
          :selectedServicesProp="selectedServices"
          ref="constructionCategory"
        />
      </div>

      <!-- 카테고리 초기화 버튼 -->
      <button @click="resetAllSelections" class="bg-gray-400 text-white text-[12px] font-medium px-3 py-2 rounded">
        <font-awesome-icon :icon="['fas', 'arrow-rotate-left']" />&nbsp;선택초기화
      </button>
    </div>

    <!-- 배너 및 타이틀 -->
    <banner-compo></banner-compo>

    <div class="py-8">
      <p class="text-[22px] font-bold text-[#1d1d1d] leading-[22px] tracking-[-0.3px] mb-2 flex items-center">
        리모델링 파트너
      </p>
      <div class="flex items-center">
        <font-awesome-icon class="w-4 h-4 mt-[2px] mr-[4px] text-[#555]" :icon="['fas', 'circle-info']" />
        <span class="text-[14px] font-normal text-[#555] leading-[20px] tracking-[-0.3px]">
          선택한 지역 및 서비스에 맞는 리모델링 파트너를 보여드립니다.
        </span>
      </div>
    </div>

    <!-- 업체 리스트 -->
    <div class="w-full flex flex-col gap-[40px] pb-[40px]">
      <!-- Premium 업체 -->
      <div v-if="sortedCompanies.PREMIUM.length > 0" class="pb-[40px] border-b-[1px] border-gray-200">
        <div class="text-[16px] font-bold text-gray-700 mb-4">프리미엄 파트너</div>
        <div class="flex flex-wrap gap-[20px]">
          <company-card
            v-for="company in sortedCompanies.PREMIUM"
            :key="company.id"
            :company="company"
            :isPremium="true"
          ></company-card>
        </div>
        <!-- "더보기" 버튼 -->
        <div v-if="premiumPage < totalPremiumPages - 1" class="text-center mt-4">
          <button @click="loadMorePremium" class="bg-midGreen text-white px-6 py-2 rounded-md">더보기</button>
        </div>
      </div>

      <!-- Basic 업체 -->
      <div v-if="sortedCompanies.BASIC.length > 0" class="pb-[40px] border-b-[1px] border-gray-200">
        <div class="text-[16px] font-bold text-gray-700 mb-4">베이직 파트너</div>
        <div class="flex flex-wrap gap-[20px]">
          <company-card
            v-for="company in sortedCompanies.BASIC"
            :key="company.id"
            :company="company"
            :isPremium="false"
          ></company-card>
        </div>
        <!-- "더보기" 버튼 -->
        <div v-if="basicPage < totalBasicPages - 1" class="text-center mt-4">
          <button @click="loadMoreBasic" class="bg-midGreen text-white px-6 py-2 rounded-md">더보기</button>
        </div>
      </div>

      <!-- No 업체 -->
      <div v-if="sortedCompanies.NO.length > 0" class="pb-[40px] border-b-[1px] border-gray-200">
        <div class="text-[16px] font-bold text-gray-700 mb-4">일반 파트너</div>
        <div class="flex flex-wrap gap-[20px]">
          <company-card
            v-for="company in sortedCompanies.NO"
            :key="company.id"
            :company="company"
            :isPremium="false"
          ></company-card>
        </div>
        <!-- "더보기" 버튼 -->
        <div v-if="noPage < totalNoPages - 1" class="text-center mt-4">
          <button @click="loadMoreNo" class="bg-midGreen text-white px-6 py-2 rounded-md">더보기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegionCategoryCompo from './common/RegionCategoryCompo.vue';
import ConstructionCategoryCompo from './common/ConstructionCategoryCompo.vue';
import BannerCompo from './company/BannerCompo.vue';
import CompanyCard from './company/CompanyCard.vue';
import { instance } from '@/utils/axiosUtils';

export default {
  components: { RegionCategoryCompo, ConstructionCategoryCompo, BannerCompo, CompanyCard },
  data() {
    return {
      companies: [], // 전체 업체 데이터를 저장할 변수
      sortedCompanies: {
        PREMIUM: [],
        BASIC: [],
        NO: [],
      }, // 정렬된 업체 데이터를 저장할 변수
      selectedRegion: null, // 선택된 지역 저장
      selectedServices: [], // 선택된 시공 서비스 저장

      // Pagination Data
      premiumPage: 0,
      basicPage: 0,
      noPage: 0,
      totalPremiumPages: 1,
      totalBasicPages: 1,
      totalNoPages: 1,
      pageSize: 3,

      // Initial Load 상태를 저장하는 변수
      initialLoaded: false,
    };
  },
  methods: {
    async fetchInitialCompanies() {
      try {
        let url = `/api/company/list?page=0&size=${this.pageSize}`;

        const params = [];

        if (this.selectedRegion) {
          const { city, district } = this.selectedRegion;
          if (district) {
            params.push(`city=${city}&district=${district}`);
          } else {
            params.push(`city=${city}`);
          }
        }

        if (this.selectedServices.length > 0) {
          params.push(`services=${this.selectedServices.join(',')}`);
        }

        if (params.length > 0) {
          url += `&${params.join('&')}`;
        }

        const response = await instance.get(url);
        this.companies = response.data;
        console.log('fetchCompanies', this.companies);

        // Fetch total pages from the response
        this.totalPremiumPages = response.data.PREMIUM.totalPage;
        this.totalBasicPages = response.data.BASIC.totalPage;
        this.totalNoPages = response.data.NO.totalPage;

        this.sortCompanies(); // Call to sort companies into categories
        this.initialLoaded = true; // 처음 데이터를 불러온 상태를 true로 변경
      } catch (error) {
        console.error('Error fetching company data: ', error);
      }
    },

    async fetchMoreCompanies(page, pageSize, name) {
      try {
        let url = `/api/company/categorylist?page=${page}&size=${pageSize}&name=${name}`;
        const params = [];

        if (this.selectedRegion) {
          const { city, district } = this.selectedRegion;
          if (district) {
            params.push(`city=${city}&district=${district}`);
          } else {
            params.push(`city=${city}`);
          }
        }

        if (this.selectedServices.length > 0) {
          params.push(`services=${this.selectedServices.join(',')}`);
        }

        if (params.length > 0) {
          url += `&${params.join('&')}`;
        }

        const response = await instance.get(url);

        console.log(response.data);
        // Fetch total pages from the response or calculate them
        if (name === 'PREMIUM') {
          this.totalPremiumPages = response.data.totalPage;
          this.sortedCompanies.PREMIUM.push(...response.data.slice);
        } else if (name === 'BASIC') {
          this.totalBasicPages = response.data.totalPage;
          this.sortedCompanies.BASIC.push(...response.data.slice);
        } else if (name === 'NO') {
          this.totalNoPages = response.data.totalPage;
          this.sortedCompanies.NO.push(...response.data.slice);
        }
      } catch (error) {
        console.error('Error fetching more companies: ', error);
      }
    },

    sortCompanies() {
      this.sortedCompanies.PREMIUM = this.companies.PREMIUM.slice || [];
      this.sortedCompanies.BASIC = this.companies.BASIC.slice || [];
      this.sortedCompanies.NO = this.companies.NO.slice || [];
    },

    // Load more Premium companies
    async loadMorePremium() {
      this.premiumPage += 1;
      await this.fetchMoreCompanies(this.premiumPage, this.pageSize, 'PREMIUM');
    },

    // Load more Basic companies
    async loadMoreBasic() {
      this.basicPage += 1;
      await this.fetchMoreCompanies(this.basicPage, this.pageSize, 'BASIC');
    },

    // Load more No companies
    async loadMoreNo() {
      this.noPage += 1;
      await this.fetchMoreCompanies(this.noPage, this.pageSize, 'NO');
    },

    onRegionSelected(region) {
      this.selectedRegion = region;
      this.resetPagination();
      this.fetchInitialCompanies();
    },

    onServicesSelected({ services }) {
      this.selectedServices = services;
      this.resetPagination();
      this.fetchInitialCompanies(); // 서비스 선택하면 페이지 초기화하고 list2 데이터 조회
    },

    resetPagination() {
      this.premiumPage = 0;
      this.basicPage = 0;
      this.noPage = 0;
      this.sortedCompanies.PREMIUM = [];
      this.sortedCompanies.BASIC = [];
      this.sortedCompanies.NO = [];
    },

    resetAllSelections() {
      this.selectedRegion = null;
      this.selectedServices = [];
      if (this.$refs.regionCategory) {
        this.$refs.regionCategory.resetSelection();
      }
      if (this.$refs.constructionCategory) {
        this.$refs.constructionCategory.resetSelection();
      }
      this.resetPagination();
      this.fetchInitialCompanies(); // 초기화 후 다시 list 데이터 조회
    },
  },
  mounted() {
    // 컴포넌트가 마운트되면 초기 데이터 호출
    this.fetchInitialCompanies();
  },
};
</script>
