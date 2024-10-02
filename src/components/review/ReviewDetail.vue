<template>
  <div class="container w-[850px] mx-auto p-8">
    <!-- 이미지 슬라이더 -->
    <div class="my-carousel mb-8">
      <swiper
        v-if="reviewDetail.reviewImageResponses.length > 1"
        :modules="[Navigation, Pagination]"
        :navigation="true"
        :pagination="{ clickable: true }"
        :loop="true"
        class="w-[850px] h-[400px] rounded-lg overflow-hidden custom-swiper"
      >
        <swiper-slide v-for="(image, index) in reviewDetail.reviewImageResponses" :key="index">
          <img
            class="w-[850px] h-[400px] object-cover rounded-lg"
            :src="image.imageUrl || require('@/assets/replaceHouse.png')"
            alt="Review Image"
          />
        </swiper-slide>
      </swiper>
      <img
        v-else
        class="w-[850px] h-[400px] rounded-lg object-cover"
        :src="reviewDetail.reviewImageResponses[0]?.imageUrl || require('@/assets/replaceHouse.png')"
        alt="Review Image"
      />
    </div>

    <!-- 리뷰 제목 -->
    <div class="bg-white p-6 mb-8 border-b-[1px] border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ reviewDetail.title }}</h2>
      <div class="flex justify-between items-center text-gray-600">
        <div>
          <p class="text-md text-gray-600 mb-1 font-semibold">{{ reviewDetail.memberNickName }} 고객님</p>
          <p class="text-sm text-gray-400 font-medium">{{ formattedRegDate }}</p>
        </div>
        <div>
          <div v-if="reviewDetail.updatable" class="flex gap-4">
            <button @click="goToEditPage" class="text-gray-400 hover:text-gray-600 text-sm rounded-lg">수정</button>
            <button @click="confirmDelete" class="text-gray-400 hover:text-gray-600 text-sm rounded-lg">삭제</button>
          </div>
          <div class="flex justify-end items-center text-lg text-midGreen">
            <font-awesome-icon class="text-[16px] pt-[0.5px]" :icon="['fas', 'star']" />
            <span class="font-semibold">{{ reviewDetail.rating }}점</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 리뷰 내용 섹션 -->
    <div class="bg-white p-6 pb-20 rounded-lg border-b-[1px] border-gray-200">
      <div v-html="reviewDetail.content" class="text-gray-700 leading-relaxed"></div>
    </div>

    <!-- 시공 정보 섹션 -->
    <div class="w-[800px] mx-auto bg-white p-6 mt-10 rounded-lg border-[1px] border-gray-200">
      <!-- 시공 업체 정보 -->
      <div
        @click="this.$router.push(`/company/${reviewDetail.companyId}`)"
        class="border-b-[1px] border-gray-200 pb-4 mb-4 flex gap-6 items-center cursor-pointer hover:bg-gray-50 transition duration-200 ease-in-out"
      >
        <img
          class="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
          :src="reviewDetail.companyLogoUrl ?? require('@/assets/logo.png')"
          alt="Company Logo"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ reviewDetail.companyName }}</h3>
          <p class="text-sm text-gray-600 mb-1">{{ reviewDetail.companyAddress }}</p>
        </div>
      </div>

      <!-- 시공 정보 -->
      <h3 class="text-lg font-semibold mb-4 text-gray-800 pl-2">시공 정보</h3>
      <table class="w-full text-left text-gray-700 text-sm pl-4">
        <tbody>
          <tr>
            <th class="px-2 py-1 text-gray-800">시공 기간</th>
            <td class="py-1 font-medium">{{ formattedStartDate }} ~ {{ formattedEndDate }} ({{ schedule }})</td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">건물 종류</th>
            <td class="py-1 font-medium">{{ reviewDetail.buildingTypeName }}</td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">면적</th>
            <td class="py-1 font-medium">{{ reviewDetail.floor }}평</td>
          </tr>
          <tr>
            <th class="px-2 py-1 text-gray-800">총 비용</th>
            <td class="py-1 font-medium">{{ reviewDetail.totalPrice }}만원</td>
          </tr>
          <!-- 시공 서비스 추가 -->
          <tr>
            <th class="px-2 py-1 text-gray-800">시공 서비스</th>
            <td class="py-1">
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(service, index) in reviewDetail.reviewConstructionTypeResponses"
                  :key="index"
                  class="flex items-center bg-[#f1f2f3] rounded-full px-[10px] py-[5px] text-[12px] font-medium leading-[20px] tracking-[-0.3px] px-3 py-1"
                >
                  {{ service.constructionType }}
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import { authInstance } from '@/utils/axiosUtils';

export default {
  data() {
    return {
      reviewDetail: {
        title: '',
        content: '',
        rating: '',
        companyName: '',
        floor: '',
        memberNickName: '',
        workStartDate: '',
        workEndDate: '',
        buildingTypeName: '',
        reviewConstructionTypeResponses: [],
        totalPrice: '',
        regDate: '',
        reviewImageResponses: [],
        projectLocation: '', // 시공 지역 추가
        updatable: false,
        companyLogoUrl: '',
        companyAddress: '',
      },
    };
  },

  components: {
    Swiper,
    SwiperSlide,
  },

  computed: {
    formattedRegDate() {
      if (!this.reviewDetail.regDate) return '';
      const date = new Date(this.reviewDetail.regDate);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedStartDate() {
      if (!this.reviewDetail.workStartDate) return '';
      const date = new Date(this.reviewDetail.workStartDate);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    formattedEndDate() {
      if (!this.reviewDetail.workEndDate) return '';
      const date = new Date(this.reviewDetail.workEndDate);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    schedule() {
      if (!this.reviewDetail.workStartDate || !this.reviewDetail.workEndDate) return '';
      const startDate = new Date(this.reviewDetail.workStartDate);
      const endDate = new Date(this.reviewDetail.workEndDate);
      // 당일 시공 처리
      if (startDate.getTime() === endDate.getTime()) {
        return '당일 시공';
      }
      const timeDiff = Math.abs(endDate - startDate);
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 7 ? `${Math.ceil(dayDiff / 7)}주 소요` : `${dayDiff}일 소요`;
    },
  },

  async mounted() {
    const reviewId = this.$route.params.id;
    const reviewDetailRequest = await authInstance.get(`/api/reviews/${reviewId}`);
    this.reviewDetail = reviewDetailRequest.data;
    console.log(this.reviewDetail);
  },

  methods: {
    goToEditPage() {
      this.$router.push(`/reviews/edit/${this.reviewDetail.id}`);
    },
    confirmDelete() {
      if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
        this.deleteReview();
      }
    },
    async deleteReview() {
      const reviewId = this.$route.params.id;
      try {
        await authInstance.delete(`/api/reviews/${reviewId}`);
        alert('리뷰가 삭제되었습니다.');
        this.$router.push('/reviews');
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    },
  },
  setup() {
    return {
      Navigation,
      Pagination,
    };
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
