<template>
  <div>
    <!-- 고객 이미지 -->
    <div class="flex items-center justify-center h-full mb-10">
      <img class="object-fill w-72 h-auto bg-inherit" src="@/assets/logo.png" alt="" />
    </div>
    <!-- 고객 정보 -->
    <div>
      <ul class="p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">고객명</label>
          <p class="w-1/5 px-10 whitespace-nowrap">{{ member.name }}</p>
          <!-- <p class="px-2 border-2 border-solid rounded-lg whitespace-nowrap text-center">
            {{ member.memberState }}
          </p> -->
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">닉네임</label>
          <p class="w-4/5 px-10">{{ member.nickName }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">이메일</label>
          <p class="w-4/5 px-10">{{ member.email }}</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">전화번호</label>
          <p class="w-4/5 px-10">{{ formatPhoneNumber(member.phoneNumber) }}</p>
        </li>
        <!-- <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">상담 수</label>
          <p class="w-4/5 px-10">8건</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">시공 수</label>
          <p class="w-4/5 px-10">2건</p>
        </li> -->
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">가입일</label>
          <p class="w-4/5 px-10">{{ member.createAt }}</p>
        </li>
      </ul>
    </div>
    <!-- 버튼 공간 -->
    <div class="flex justify-end mt-4 gap-5">
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="deletionMember"
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
                @click="deleteMember"
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import authInstance from '@/utils/axiosUtils';

export default {
  setup() {
    const member = ref({});
    const isModalOpen = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const route = useRoute();
    const router = useRouter();
    const memberId = route.params.id;

    const fetchMemberDetail = async () => {
      try {
        const response = await authInstance.get(`/api/admin/member/${memberId}`);
        member.value = response.data;
      } catch (error) {
        console.error('멤버 정보를 불러오는데 실패했습니다.', error);
      }
    };

    onMounted(() => {
      fetchMemberDetail();
    });

    const deletionMember = () => {
      modalTitle.value = '관리자 권한으로 강제 탈퇴';
      modalMessage.value = '해당 계정을 정말로 강제 탈퇴하시겠습니까? 이 작업은 취소할 수 없습니다.';
      isModalOpen.value = true;
    };

    const deleteMember = () => {
      alert('탈퇴했습니다.');
      isModalOpen.value = false;
    };

    const goBack = () => {
      router.back();
    };

    const closeModal = () => {
      isModalOpen.value = false;
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
      member,
      isModalOpen,
      modalTitle,
      modalMessage,
      deletionMember,
      deleteMember,
      goBack,
      closeModal,
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
