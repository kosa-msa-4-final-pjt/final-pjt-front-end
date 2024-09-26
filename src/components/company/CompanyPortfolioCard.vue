<template>
  <div
    @click="goToPortfolioDetail"
    class="w-[240px] pb-3 border border-gray-200 rounded-lg transition-shadow duration-300 ease-in-out cursor-pointer hover:shadow-md"
  >
    <!-- 이미지 영역 -->
    <div class="w-full h-[120px] border-b border-gray-200">
      <img
        class="w-full h-full object-cover rounded-t-lg"
        :src="portfolio.imageUrl ? portfolio.imageUrl : require('@/assets/replaceHouse.png')"
        alt="시공대표이미지"
      />
    </div>

    <!-- 내용 영역 -->
    <div class="bg-white px-2 pt-2 pb-3 rounded-b-lg">
      <div class="mb-1">
        <p class="text-md font-bold text-gray-900 leading-5 tracking-tight truncate">
          {{ portfolio.title }}
        </p>
      </div>
      <div class="my-2 flex justify-start items-center">
        <span class="text-sm font-medium text-gray-600 tracking-tight">{{ portfolio.buildingTypeName }}</span>
        <span class="ml-1 text-sm font-medium text-gray-600">{{ portfolio.floor }}평</span>
      </div>
      <div class="h-10">
        <p class="text-sm font-normal text-gray-600 truncate">{{ shortenedLocation }}</p>
        <p class="mt-2 text-sm font-normal text-gray-600">{{ schedule }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    portfolio: {
      type: Object,
      required: true,
    },
  },
  computed: {
    shortenedLocation() {
      return this.portfolio.location.length > 30
        ? this.portfolio.location.substring(0, 30) + '...'
        : this.portfolio.location;
    },
    schedule() {
      if (!this.portfolio.startDate || !this.portfolio.endDate) return '';
      const startDate = new Date(this.portfolio.startDate);
      const endDate = new Date(this.portfolio.endDate);
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
    goToPortfolioDetail() {
      this.$router.push(`/portfolio/${this.portfolio.portfolioId}`);
    },
  },
};
</script>
