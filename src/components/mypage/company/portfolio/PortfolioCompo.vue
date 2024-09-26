<template>
  <div
    @click="goToDetailPage"
    class="w-full border border-[#eee] rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out bg-white overflow-hidden mb-4"
  >
    <!-- 이미지 섹션 -->
    <div class="relative w-full h-[200px] bg-gray-100">
      <img
        class="w-full h-full object-cover"
        :src="portfolio.imageUrls.length > 0 ? portfolio.imageUrls[0] : require('@/assets/logo.png')"
        alt="대표이미지"
      />
    </div>

    <!-- 정보 섹션 -->
    <div class="p-4 pb-5">
      <!-- 제목 -->
      <h2 class="text-lg font-semibold text-gray-800 mb-2 truncate">{{ portfolio.title }}</h2>
      <!-- 프로젝트 면적 및 위치 -->
      <p class="text-sm text-gray-600 mb-1">
        <span class="text-sm text-gray-700 font-medium">{{ portfolio.buildingType }}</span>
        <span class="font-semibold">&nbsp;{{ portfolio.floor }}</span
        >평
      </p>
      <p class="text-sm text-gray-600 mb-3 truncate">{{ portfolio.projectLocation }}</p>

      <!-- 시공 서비스 섹션 -->
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center gap-[4px]">
          <div
            v-for="(service, index) in visibleServices"
            :key="index"
            class="bg-[#f1f2f3] whitespace-nowrap rounded-[40px] h-[24px] text-[12px] font-normal leading-[16px] tracking-[-0.3px] px-2 py-1"
          >
            {{ service }}
          </div>
        </div>
        <span v-if="hasMoreServices" class="text-gray-600">...</span>
        <div
          v-if="hasMoreServices"
          class="bg-[#f8f8f8] mr-2 whitespace-nowrap rounded-[40px] h-[24px] text-[12px] font-normal leading-[16px] tracking-[-0.3px] px-2 py-1"
        >
          더보기
        </div>
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
      default: () => ({}),
    },
  },
  computed: {
    visibleServices() {
      // 첫 4개의 서비스만 보여주기
      return this.portfolio.constructionTypes.slice(0, 4);
    },
    hasMoreServices() {
      // 서비스 개수가 4개보다 많으면 '...'을 표시
      return this.portfolio.constructionTypes.length > 4;
    },
  },
  methods: {
    goToDetailPage() {
      this.$router.push(`/portfolio/${this.portfolio.id}`);
    },
  },
};
</script>

<style scoped>
/* 반응형 그리드 레이아웃 */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* 작은 화면에서는 2개의 열 */
  }
}
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* 중간 화면에서는 3개의 열 */
  }
}
</style>
