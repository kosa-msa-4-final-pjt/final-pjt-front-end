<template>
  <div>
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
          <p class="w-4/5 px-10">{{ company.services }}</p>
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
    <!-- 버튼 공간 -->
    <div class="flex justify-end mt-4 gap-5">
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="deletionCompany"
      >
        탈퇴
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="goBack"
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
                @click="deleteCompany"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600 sm:mt-0 sm:w-auto"
              >
                탈퇴
              </button>
              <button
                @click="closeModal"
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
import authInstance from '@/utils/axiosUtils';
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

    const deletionCompany = () => {
      modalTitle.value = '관리자 권한으로 강제 탈퇴';
      modalMessage.value =
        '해당 업체를 정말로 강제 탈퇴하시겠습니까? 해당 업체의 작업은 그대로 서버에 저장됩니다. 이 작업은 취소할 수 없습니다.';
      isModalOpen.value = true;
    };

    const deleteCompany = () => {
      alert('탈퇴했습니다.');
      isModalOpen.value = false;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

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
      deletionCompany,
      deleteCompany,
      closeModal,
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
