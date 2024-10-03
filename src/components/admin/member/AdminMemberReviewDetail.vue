<template>
  <div>
    <!-- 리뷰 이미지 -->
    <!-- 포트폴리오 이미지 -->
    <div class="my-carousel mb-8">
      <swiper
        v-if="review.images && review.images.length > 0"
        :modules="[Navigation, Pagination]"
        :navigation="true"
        :pagination="{ clickable: true }"
        :loop="true"
        class="w-[500px] h-[400px] rounded-lg overflow-hidden custom-swiper"
      >
        <!-- 이미지 슬라이드 -->
        <swiper-slide v-for="(image, index) in review.images" :key="index">
          <img
            class="w-full h-full object-cover rounded-lg bg-white"
            :src="image || require('@/assets/replaceHouse.png')"
            alt="Review Image"
          />
        </swiper-slide>
      </swiper>
    </div>

    <!-- 리뷰 내용 -->
    <div>
      <ul class="p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">제목</label>
          <p class="w-4/5 px-10">{{ review.title }}</p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">내용</label>
          <p class="contentHaveImg w-4/5 px-10" v-html="review.content"></p>
          <!-- Using v-html for sanitized content -->
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">고객명</label>
          <p class="w-4/5 px-10">{{ review.memberNickName }}</p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">업체명</label>
          <p class="w-4/5 px-10">{{ review.companyName }}</p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">주거 형태</label>
          <p class="w-4/5 px-10">{{ review.buildingTypeName }}</p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">평수</label>
          <p class="w-4/5 px-10">{{ review.floor }}평</p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">시공분야</label>
          <p class="w-4/5 px-10">
            <span v-for="(type, index) in review.reviewConstructionTypeResponses" :key="index">
              {{ type.constructionType
              }}<span v-if="index < review.reviewConstructionTypeResponses.length - 1">, </span>
            </span>
          </p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">시공금액</label>
          <p class="w-4/5 px-10">{{ review.totalPrice }}만원</p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">평점</label>
          <p class="w-4/5 px-10">
            <font-awesome-icon class="text-midGreen" :icon="['fas', 'star']" />
            &nbsp; {{ review.rating }}점
          </p>
        </li>
        <li class="littleTitle">
          <label class="w-1/5 border-r-2 border-indigo-500">게시일</label>
          <p class="w-4/5 px-10">{{ formattedRegDate }}</p>
        </li>
      </ul>
    </div>

    <!-- 버튼 공간 -->
    <div class="flex justify-end mt-4 gap-5">
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="deletionReview"
      >
        삭제
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="this.$router.back()"
      >
        되돌아가기
      </button>
    </div>

    <!-- 삭제 모달 -->
    <div v-if="isModalOpen" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <svg
                    class="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{{ modalTitle }}</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ modalMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-4 bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                v-if="isModalOpen"
                @click="deleteReview"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600 sm:mt-0 sm:w-auto"
              >
                삭제
              </button>
              <button
                @click="isModalOpen = false"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import { authInstance } from '@/utils/axiosUtils';

export default {
  name: 'ReviewDetail',
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const review = reactive({
      images: [],
      title: '',
      content: '',
      memberNickName: '',
      companyName: '',
      buildingTypeName: '',
      floor: '',
      reviewConstructionTypeResponses: '',
      totalPrice: '',
      rating: '',
      regDate: '',
    });

    const isModalOpen = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const reviewId = ref(route.params.id);

    const formattedRegDate = computed(() => {
      return review.regDate ? review.regDate.split('T')[0] : '등록일 정보 없음';
    });

    const fetchReview = async () => {
      try {
        const response = await authInstance.get(`/api/admin/reviews/${reviewId.value}`);
        review.images = extractImagesFromContent(response.data.content);
        Object.assign(review, response.data);
        console.log(review);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };

    const extractImagesFromContent = (content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const imgTags = doc.querySelectorAll('img');
      return Array.from(imgTags).map((img) => img.src);
    };

    const deletionReview = () => {
      modalTitle.value = '관리자 권한으로 게시물 삭제';
      modalMessage.value = '해당 게시물을 정말로 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.';
      isModalOpen.value = true;
    };

    const deleteReview = async () => {
      const id = route.params.id;
      try {
        const response = await authInstance.delete(`/api/admin/reviews/${id}`);
        if (response.data) {
          alert('삭제했습니다.');
          router.push('/mypage/admin/adminMemberReviewList');
        } else {
          alert('삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('삭제 중 오류가 발생했습니다.');
      } finally {
        isModalOpen.value = false;
      }
    };

    fetchReview();

    return {
      review,
      isModalOpen,
      modalTitle,
      modalMessage,
      formattedRegDate,
      deletionReview,
      deleteReview,
      Navigation,
      Pagination,
    };
  },
};
</script>

<style>
.littleTitle {
  display: flex;
}
.contentHaveImg img {
  display: none;
}
.custom-swiper {
  --swiper-navigation-color: #eee;
  --swiper-pagination-color: #eee;
}
</style>
