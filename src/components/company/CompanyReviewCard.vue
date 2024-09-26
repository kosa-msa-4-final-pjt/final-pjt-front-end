<template>
  <div
    @click="goToReviewDetail"
    class="w-[240px] pb-3 border border-gray-200 rounded-lg transition-shadow duration-300 ease-in-out cursor-pointer hover:shadow-md"
  >
    <!-- 이미지 영역 -->
    <div class="w-full h-[120px] border-b border-gray-200">
      <img
        class="w-full h-full object-cover rounded-t-lg"
        :src="review.reviewImageUrl ? review.reviewImageUrl : require('@/assets/replaceHouse.png')"
        alt="리뷰대표이미지"
      />
    </div>

    <!-- 내용 영역 -->
    <div class="bg-white px-2 pt-2 pb-3 rounded-b-lg">
      <div class="mb-1">
        <p class="text-md font-bold text-gray-900 leading-5 tracking-tight truncate">{{ review.title }}</p>
      </div>
      <div class="my-2 flex justify-start items-center">
        <span class="text-sm font-medium text-gray-600 tracking-tight">{{ review.buildingTypeName }}</span>
        <span class="ml-1 text-sm font-medium text-gray-600">{{ review.floor }}평</span>
      </div>
      <div class="h-10">
        <p class="text-sm font-normal text-gray-600">{{ schedule }}</p>
        <p class="mt-2 text-[13px] font-normal text-gray-600">{{ formattedDate }}</p>
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
    formattedDate() {
      const date = new Date(this.review.regDate);
      return date.toLocaleDateString('ko-KR');
    },
    schedule() {
      if (!this.review.startDate || !this.review.endDate) return '';
      const startDate = new Date(this.review.startDate);
      const endDate = new Date(this.review.endDate);
      // 당일 시공 처리
      if (startDate.getTime() === endDate.getTime()) {
        return '당일 시공';
      }
      const timeDiff = Math.abs(endDate - startDate);
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 7 ? `${Math.ceil(dayDiff / 7)}주 소요` : `${dayDiff}일 소요`;
    },
  },
  methods: {
    goToReviewDetail() {
      this.$router.push(`/reviews/${this.review.reviewId}`);
    },
  },
};
</script>
