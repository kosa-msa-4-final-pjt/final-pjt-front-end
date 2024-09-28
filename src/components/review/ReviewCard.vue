<template>
  <!-- 전체 리뷰 공간 -->
  <div class="flex border-b cursor-pointer px-3 py-6 transition duration-300" @click="goToDetailPage">
    <div class="flex-1 flex flex-col pr-6">
      <!-- 제목 -->
      <h2 class="text-xl font-bold text-gray-900 mb-4">{{ review.title }}</h2>

      <!-- 내용 미리보기 -->
      <div class="text-gray-700">
        <p v-html="truncatedContent"></p>
      </div>

      <!-- 시공 정보 -->
      <div class="mt-1 mb-2">
        <ul class="flex flex-wrap text-sm text-gray-700">
          <li class="px-3 py-1 text-[13px] bg-gray-100 rounded-full mr-2 font-medium">{{ review.buildingType }}</li>
          <li class="px-3 py-1 text-[13px] bg-gray-100 rounded-full mr-2 font-medium">{{ review.floor }}평</li>
          <li class="px-3 py-1 text-[13px] bg-gray-100 rounded-full mr-2 font-medium">
            <span v-for="(constructionType, index) in review.constructionTypes" :key="index">
              {{ constructionType }}<span v-if="index !== review.constructionTypes.length - 1">, </span>
            </span>
          </li>
          <li class="px-3 py-1 text-[13px] bg-[#f1f2f3] rounded-full font-medium">{{ schedule }}</li>
        </ul>
      </div>

      <!-- 별점 및 작성자 정보 -->
      <div class="flex items-center mt-3 text-sm text-gray-600 font-medium">
        <font-awesome-icon class="text-midGreen mr-1" :icon="['fas', 'star']" />
        <span class="mr-4">{{ review.rating }}</span>
        <span class="mr-4">{{ review.memberNickName }} 고객님</span>
        <span class="font-normal text-gray-500">{{ formattedRegDate }}</span>
      </div>
    </div>

    <!-- 썸네일 이미지 -->
    <div class="w-32 h-32 flex-shrink-0">
      <img
        :src="
          review.reviewImageResponses[0]
            ? review.reviewImageResponses[0].imageUrl
            : require('@/assets/replaceHouse.png')
        "
        alt="후기 이미지"
        class="w-full h-full object-cover rounded-lg shadow-sm"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    review: {
      type: Object,
      required: true,
    },
  },

  computed: {
    // review content 글자수 정하기 및 img태그 숨김
    truncatedContent() {
      if (!this.review || !this.review.content) {
        return '';
      }
      const cleanedContent = this.review.content.replace(/<img[^>]*>/g, ''); // content에 img태그 지우기
      return cleanedContent.length > 100 ? cleanedContent.substring(0, 100) + '...' : cleanedContent;
    },

    // 게시일에 불필요한 시간 자르기
    formattedRegDate() {
      if (!this.review || !this.review.regDate) return '';

      const date = new Date(this.review.regDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}.${month}.${day}`;
    },

    // 시공 기간 계산하기
    schedule() {
      if (!this.review.workStartDate || !this.review.workEndDate) return '';

      const startDate = new Date(this.review.workStartDate);
      const endDate = new Date(this.review.workEndDate);

      if (
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()
      ) {
        return '1 일';
      }

      // 당일 시공 처리
      if (startDate.getTime() === endDate.getTime()) {
        return '당일 시공';
      }

      const timeDiff = Math.abs(endDate - startDate);
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (dayDiff >= 7) {
        const weekDiff = Math.ceil(dayDiff / 7);
        return `${weekDiff}주 소요`;
      } else {
        return `${dayDiff}일 소요`;
      }
    },
  },

  methods: {
    goToDetailPage() {
      this.$router.push(`/reviews/${this.review.id}`);
    },
  },
};
</script>

<style scoped>
/* 기본적으로 Tailwind CSS를 활용한 스타일이 적용됨 */
</style>
