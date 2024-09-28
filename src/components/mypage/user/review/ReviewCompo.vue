<template>
  <div
    class="flex bg-white rounded-lg p-4 space-x-4 border-[1px] border-gray-200 transition-shadow duration-300 ease-in-out cursor-pointer border-box hover:shadow-md"
    @click="this.$router.push(`/reviews/${review.id}`)"
  >
    <!-- 이미지 영역 -->
    <div class="basis-1/3 flex justify-center items-center">
      <div class="w-40 h-40 rounded-lg bg-gray-100 overflow-hidden">
        <img
          :src="
            review.reviewImageResponses.length > 0
              ? review.reviewImageResponses[0].imageUrl
              : require('@/assets/replaceHouse.png')
          "
          alt="대표사진"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- 텍스트 영역 -->
    <div class="basis-2/3 flex flex-col justify-between">
      <!-- 제목 -->
      <div class="text-lg font-semibold text-gray-800 mb-2">{{ review.title }}</div>

      <!-- 회사 이름 -->
      <div class="text-[14px] text-gray-600 mb-2 font-medium">{{ review.companyName }}</div>

      <!-- 리뷰 작성일 -->
      <div class="text-[12px] text-gray-500 mb-2">{{ formattedRegDate }}</div>

      <!-- 시공 정보 -->
      <div class="mt-1">
        <ul class="flex flex-wrap text-sm text-gray-700">
          <li class="px-3 py-1 text-[13px] bg-gray-100 rounded-full mr-2">{{ review.buildingType }}</li>
          <li class="px-3 py-1 text-[13px] bg-gray-100 rounded-full mr-2">{{ review.floor }}평</li>
          <li class="px-3 py-1 text-[13px] bg-gray-100 rounded-full mr-2">
            <span v-for="(constructionType, index) in review.constructionTypes" :key="index">
              {{ constructionType }}<span v-if="index !== review.constructionTypes.length - 1">, </span>
            </span>
          </li>
          <li class="px-3 py-1 text-[13px] bg-[#f1f2f3] rounded-full">{{ schedule }}</li>
        </ul>
      </div>
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
    // 시공 기간 계산하기
    schedule() {
      if (!this.review.workStartDate || !this.review.workEndDate) return '';

      const startDate = new Date(this.review.workStartDate);
      const endDate = new Date(this.review.workEndDate);

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

    // 등록일 형식 변환 (yyyy년 m월 d일)
    formattedRegDate() {
      if (!this.review || !this.review.regDate) {
        return '';
      }
      const date = new Date(this.review.regDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일`;
    },
  },
};
</script>

<style scoped></style>
