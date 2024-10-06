<template>
  <div class="container w-[850px] mx-auto p-8">
    <!-- 포트폴리오 제목 -->
    <div class="bg-white p-6 mb-8 border-b-[1px] border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ portfolio.title }}</h2>
      <div class="flex justify-between items-center text-gray-600">
        <div>
          <p class="text-md text-gray-600 mb-1 font-semibold">{{ portfolio.companyName }} 업체</p>
          <p class="text-sm text-gray-400 font-medium">{{ formattedCreatedAt }}</p>
        </div>
        <div>
          <div v-if="portfolio.canUpdate" class="flex gap-4">
            <button @click="confirmDelete" class="text-gray-400 hover:text-gray-600 text-sm rounded-lg">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 포트폴리오 내용 섹션 -->
    <div class="bg-white p-6 pb-20 rounded-lg border-b-[1px] border-gray-200">
      <div v-html="portfolio.content" class="text-gray-700 leading-relaxed"></div>
    </div>

    <!-- 시공 정보 섹션 -->
    <div class="w-[800px] mx-auto bg-white p-6 mt-10 rounded-lg border-[1px] border-gray-200">
      <!-- 시공 업체 정보 -->
      <div
        @click="this.$router.push(`/company/${portfolio.companyId}`)"
        class="border-b-[1px] border-gray-200 pb-4 mb-4 flex gap-6 items-center cursor-pointer hover:bg-gray-50 transition duration-200 ease-in-out"
      >
        <img
          class="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
          :src="portfolio.companyLogo ?? require('@/assets/logo.png')"
          alt="Company Logo"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ portfolio.companyName }}</h3>
          <p class="text-sm text-gray-600 mb-1">{{ portfolio.companyAddress }}</p>
        </div>
      </div>

      <!-- 시공 정보 -->
      <h3 class="text-lg font-semibold mb-4 text-gray-800 pl-2">시공 정보</h3>
      <table class="w-full text-left text-gray-700 text-sm pl-4">
        <tbody>
          <tr>
            <th class="px-2 py-1 text-gray-800">시공 기간</th>
            <td class="py-1 font-medium">
              {{ formattedStartDate }} ~ {{ formattedEndDate }} ({{ formattedSchedule }})
            </td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">건물 종류</th>
            <td class="py-1 font-medium">{{ portfolio.buildingType }}</td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">면적</th>
            <td class="py-1 font-medium">{{ portfolio.floor }}평</td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">총 비용</th>
            <td class="py-1 font-medium">{{ portfolio.projectBudget }}만원</td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">시공 지역</th>
            <td class="py-1 font-medium">{{ portfolio.projectLocation }}</td>
          </tr>
          <!-- 시공 서비스 추가 -->
          <tr>
            <th class="px-2 py-1 text-gray-800">시공 서비스</th>
            <td class="py-1">
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(service, index) in portfolio.services"
                  :key="index"
                  class="flex items-center bg-[#f1f2f3] rounded-full px-[10px] py-[5px] text-[12px] font-medium leading-[20px] tracking-[-0.3px]"
                >
                  {{ service }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      portfolio: {
        title: '',
        content: '',
        companyName: '',
        buildingType: '',
        floor: '',
        projectBudget: '',
        projectLocation: '',
        startDate: '',
        endDate: '',
        services: [],
        companyAddress: '',
        companyLogo: '',
      },
    };
  },

  mounted() {
    this.fetchPortfolio();
  },
  computed: {
    formattedCreatedAt() {
      if (!this.portfolio.createdAt) return '';
      const date = new Date(this.portfolio.createdAt);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedStartDate() {
      if (!this.portfolio.startDate) return '';
      const date = new Date(this.portfolio.startDate);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedEndDate() {
      if (!this.portfolio.endDate) return '';
      const date = new Date(this.portfolio.endDate);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedSchedule() {
      if (!this.portfolio.startDate || !this.portfolio.endDate) return '';
      const startDate = new Date(this.portfolio.startDate);
      const endDate = new Date(this.portfolio.endDate);
      const timeDiff = Math.abs(endDate - startDate);
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 7 ? `${Math.ceil(dayDiff / 7)}주 소요` : `${dayDiff}일 소요`;
    },
  },
  methods: {
    async fetchPortfolio() {
      const id = this.$route.params.id;

      try {
        const response = await authInstance.get(`/api/portfolio/${id}`);
        this.portfolio = response.data;
        console.log(this.portfolio);
      } catch (error) {
        console.error('Error fetching portfolio data: ', error);
      }
    },

    confirmDelete() {
      Swal.fire({
        text: '시공시례를 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePortfolio();
        }
      });
    },
    async deletePortfolio() {
      const id = this.$route.params.id;

      try {
        await authInstance.delete(`/api/portfolio/${id}`);
        Swal.fire({
          text: '포트폴리오가 삭제되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#429f50',
        });
        this.$router.push('/portfolio');
      } catch (error) {
        Swal.fire({
          text: '포트폴리오 삭제에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#f39c12',
        });
        console.error('Error deleting portfolio: ', error);
      }
    },
  },
};
</script>

<style scoped>
.custom-swiper {
  --swiper-navigation-color: #eee;
  --swiper-pagination-color: #eee;
}

.container {
  max-width: 850px;
  margin: 0 auto;
}
</style>
