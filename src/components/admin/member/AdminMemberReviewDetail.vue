<template>
  <div>
    <!-- 리뷰 이미지 -->
    <!-- 이미지 슬라이더 -->
    <div class="my-carousel mb-8">
      <swiper
        :modules="[Navigation, Pagination]"
        :navigation="true"
        :pagination="{ clickable: true }"
        :loop="true"
        class="w-[500px] h-[400px] rounded-lg overflow-hidden custom-swiper"
      >
        <swiper-slide>
          <img
            class="w-full h-full object-cover rounded-lg bg-white"
            :src="require('@/assets/replaceHouse.png')"
            alt="Review Image"
          />
        </swiper-slide>
      </swiper>
    </div>
    <!-- 리뷰 내용 -->
    <div>
      <ul class="p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">제목</label>
          <p class="w-4/5 px-10">{{ title }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">내용</label>
          <p class="w-4/5 px-10">
            {{ content }}
          </p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">고객명</label>
          <p class="w-4/5 px-10">{{ name }}김선우</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">업체명</label>
          <p class="w-4/5 px-10">{{ companyName }}부자업체</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">주거 형태</label>
          <p class="w-4/5 px-10">{{ buildingType }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">평수</label>
          <p class="w-4/5 px-10">{{ projectArea }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">시공분야</label>
          <p class="w-4/5 px-10">{{ constructionTypeService }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">시공금액</label>
          <p class="w-4/5 px-10">{{ totalPrice }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">평점</label>
          <p class="w-4/5 px-10">
            <font-awesome-icon class="text-midGreen" :icon="['fas', 'star']" />&nbsp; {{ rating }}점
          </p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">게시일</label>
          <p class="w-4/5 px-10">{{ regDate }}</p>
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
    <!-- 버튼에 따른 Modal -->
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';

export default {
  data() {
    return {
      // 임의로 넣어둔 값들
      title: '지금까지 만나본 업체 중 최고였습니다',
      content:
        '이번에 집 리모델링을 맡겼는데, 진짜 대만족이에요! 화이트랑 블랙 조합으로 깔끔하면서도 세련된 느낌을 원했는데, 완전 기대 이상으로 나왔습니다. 거실은 처음 딱 들어가자마자 넓은 흰 벽 덕에 진짜 탁 트인 느낌이에요. 큰 창문으로 들어오는 자연광 덕에 낮에도 조명 필요 없고요. 블랙 소파랑 TV 선반이 심플하게 딱 잡아주니까 너무 차분하고 시크해 보여요. 바닥은 원목이라서 따뜻한 느낌까지 나서, 거실에 있으면 기분도 좋아지더라고요. 주방에는 흰색 상판이랑 블랙 캐비닛 조합을 추천하셔서 그대로 진행했는데 확실히 미니멀하면서도 고급스러운 느낌이 나요. 특히 후드가 블랙 스틸이라 포인트 제대로 살고, 흰 타일이랑 매치가 딱 맞아서 깔끔하면서도 세련된 느낌이 강해요. 주방에서 요리할 맛 나네요. 침실은 진짜 힐링 그 자체. 흰색 침구가 너무 부드럽고, 블랙 스탠드 조명이 분위기를 확 살려줘요. 큰 거울 덕에 공간도 더 넓어 보이고, 가구도 최소한으로 딱 필요한 것만 넣어서 정리가 잘 된 느낌? 잠이 잘 와요 진짜. 화장실은 완전 모던 그 자체. 화이트 타일이랑 블랙 악세서리로 대조를 딱 주니까 고급스러워 보이고, 벽에 간접 조명도 설치해서 분위기 대박이에요. 깔끔하면서도 뭔가 따뜻한 느낌까지 줘서 들어갈 때마다 기분 좋더라고요. 전체적으로 시공 퀄리티도 좋고, 제가 원하던 깔끔하면서도 시크한 느낌 그대로 나왔어요. 취향 제대로 저격한 인테리어입니다!',
      name: '김선우',
      companyName: '부자업체',
      buildingType: '아파트',
      projectArea: '32평',
      constructionTypeService: '전체 시공',
      totalPrice: '5000만원',
      rating: '5',
      regDate: '24.10.01',
      isModalOpen: false,
      modalTitle: '',
      modalMessage: '',
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      Navigation,
      Pagination,
    };
  },
  methods: {
    // 탈퇴 버튼 클릭시
    deletionReview() {
      this.modalTitle = '관리자 권한으로 게시물 삭제';
      this.modalMessage =
        '해당 게시물을 정말로 삭제하시겠습니까? 해당 게시물의 작업은 그대로 서버에 저장됩니다. 이 작업은 취소할 수 없습니다.';
      this.isModalOpen = true;
      console.log('게시판 삭제완료:', this.isModalOpen);
    },

    deleteReview() {
      // 서버로 데이터를 보내는 로직을 여기에 작성
      alert('삭제했습니다.');
      this.isModalOpen = false;
    },
  },
};
</script>

<style>
.littleTitle {
  display: flex;
}
.custom-swiper {
  --swiper-navigation-color: #eee;
  --swiper-pagination-color: #eee;
}
</style>
