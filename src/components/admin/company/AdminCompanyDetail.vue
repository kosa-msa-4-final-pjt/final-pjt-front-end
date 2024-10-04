<template>
  <div>
    <div>
      <button class="hover:text-midGreen text-gray-600 text-[30px] font-bold" @click="goBack">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
    </div>
    <!-- 기업 로고 -->
    <div class="flex items-center justify-center h-full mb-10">
      <img
        class="object-cover w-72 h-auto rounded-lg bg-inherit"
        :src="company.companyLogoUrl || require('@/assets/logo.png')"
        alt="업체로고"
      />
    </div>
    <!-- 기업 정보 -->
    <div>
      <ul class="p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">업체명</label>
          <p class="w-4/5 px-10">{{ company.companyName }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">대표자명</label>
          <p class="w-4/5 px-10">{{ company.owner }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">멤버십 종류</label>
          <p class="w-1/5 px-10">{{ company.membership ?? '-' }}</p>
          <!-- <p class="border-2 border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap">
            {{ membershipState }}
          </p> -->
        </li>
        <!-- <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">멤버십 시작일</label>
          <div>
            <p class="w-4/5 px-10">{{ membershipStartDate }}</p>
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">멤버십 만료일</label>
          <div>
            <p class="w-4/5 px-10">{{ membershipEndDate }}</p>
          </div>
        </li> -->
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">이메일</label>
          <p class="w-4/5 px-10">{{ company.email }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">전화번호</label>
          <p class="w-4/5 px-10">{{ formatPhoneNumber(company.phoneNumber) }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">사업자번호</label>
          <p class="w-4/5 px-10">{{ company.companyNumber }}</p>
        </li>

        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">개업일</label>
          <p class="w-4/5 px-10">{{ company.publishedDate }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">주소</label>
          <p class="w-4/5 px-10">{{ company.address }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">시공 분야</label>
          <div class="w-4/5 px-10 py-2 flex flex-wrap gap-2">
            <span
              v-for="(service, index) in company.services"
              :key="index"
              class="py-1 px-3 bg-gray-200 text-sm rounded-full"
            >
              {{ service }}
            </span>
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">상담 수</label>
          <p class="w-4/5 px-10">8건</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">시공 수</label>
          <p class="w-4/5 px-10">2건</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">평점</label>
          <p class="w-4/5 px-10">
            <font-awesome-icon class="text-midGreen" :icon="['fas', 'star']" />&nbsp; {{ company.rating }}점
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const company = ref({});
    const isModalOpen = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const route = useRoute();
    const router = useRouter();
    const companyId = route.params.id;
    console.log(companyId);

    const fetchCompanyDetail = async () => {
      try {
        const response = await authInstance.get(`/api/admin/company/${companyId}`);
        console.log(response.data);
        company.value = response.data;
      } catch (error) {
        console.error('업체 정보를 불러오는데 실패했습니다. ', error);
      }
    };

    onMounted(() => {
      fetchCompanyDetail();
    });

    const goBack = () => {
      router.back();
    };

    const formatPhoneNumber = (phoneNumber) => {
      if (!phoneNumber) return '';

      const cleaned = ('' + phoneNumber).replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }

      return phoneNumber;
    };

    return {
      company,
      isModalOpen,
      modalTitle,
      modalMessage,
      goBack,
      formatPhoneNumber,
    };
  },
};
</script>

<style scoped>
.littleTitle {
  display: flex;
  line-height: 2rem;
}
</style>
