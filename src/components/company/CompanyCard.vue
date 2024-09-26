<template>
  <div
    @click="goToDetailPage"
    class="w-[353px] h-[354px] border-solid border-[1px] border-[#eee] rounded-[8px] transition-shadow duration-300 ease-in-out cursor-pointer border-box hover:shadow-md relative"
  >
    <!-- 광고 표시 -->
    <div
      v-if="isPremium"
      class="absolute top-0 left-0 bg-[#ffcc00] text-white text-sm font-semibold py-1 px-3 rounded-br-lg"
    >
      <font-awesome-icon :icon="['fas', 'crown']" /> 광고추천
    </div>

    <div class="w-100 h-[198px] border-solid border-b-[1px] border-[#eee]">
      <img
        class="w-full h-full rounded-t-lg object-cover"
        :src="company.companyLogoUrl ? company.companyLogoUrl : require('@/assets/logo.png')"
        alt="Company Logo"
      />
    </div>

    <div class="bg-white h-[154px] px-3 pt-2 pb-4 rounded-b-lg">
      <div class="mb-2 flex justify-between items-center">
        <p class="text-[16px] font-bold text-[#1d1d1d] leading-[24px] tracking-[-0.5px]">{{ company.companyName }}</p>
      </div>
      <div class="mb-3 flex justify-between items-center">
        <span class="text-[13px] font-medium text-[#555] leading-[16px] tracking-[-0.3px]"
          >최근 상담 0건 • 총 공사 3건</span
        >
        <span class="text-[13px] font-normal text-[#555] leading-[16px] tracking-[-0.3px] flex items-center"
          ><font-awesome-icon class="text-midGreen" :icon="['fas', 'star']" />&nbsp;{{ company.rating }}</span
        >
      </div>
      <div class="mb-2 h-[40px]">
        <p class="text-[14px] font-normal text-[#555] leading-[20px] tracking-[-0.5px] truncate">
          {{ company.companyDesc }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-[4px]">
          <div
            v-for="(service, index) in visibleServices"
            :key="index"
            class="bg-[#f1f2f3] whitespace-nowrap rounded-[40px] h-[24px] text-[12px] font-normal leading-[16px] tracking-[-0.3px] px-2 py-1"
          >
            {{ service }}
          </div>
        </div>

        <span v-if="hasMoreServices">...</span>
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
    company: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    isPremium: {
      type: Boolean,
    },
  },
  computed: {
    visibleServices() {
      // 첫 3개의 서비스만 보여주기
      return this.company.services.slice(0, 4);
    },
    hasMoreServices() {
      // 서비스 개수가 3개보다 많으면 '...'을 표시
      return this.company.services.length > 4;
    },
  },
  methods: {
    goToDetailPage() {
      this.$router.push(`/company/${this.company.id}`);
    },
  },
};
</script>
