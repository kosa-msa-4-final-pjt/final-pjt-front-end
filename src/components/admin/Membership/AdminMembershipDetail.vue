<template>
  <div class="w-full">
    <!-- 멤버십 정보 -->
    <div class="w-full">
      <ul class="w-full p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">멤버십명</label>
          <div>
            <input
              type="text"
              v-model="membership.name"
              class="w-full mt-2 mx-10 pl-2 border-2 border-indigo-500 rounded-md resize-none focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
              disabled
            />
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">가격</label>
          <div>
            <input
              type="number"
              v-model="membership.price"
              placeholder="변경할 멤버십 가격"
              class="w-full mt-2 mx-10 pl-2 border-2 border-indigo-500 rounded-md resize-none focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
            />
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">서비스 내용</label>
          <div>
            <textarea
              v-model="membership.description"
              placeholder="변경할 멤버십 서비스 내용"
              class="w-full mt-2 mx-10 pl-2 border-2 border-indigo-500 rounded-md resize-none focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
              rows="5"
            ></textarea>
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">가입자수</label>
          <p class="w-4/5 px-10">{{ membership.subscribers }}명</p>
        </li>
      </ul>
    </div>
    <!-- 버튼 공간 -->
    <div class="flex justify-end mt-4 gap-5">
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="confirmEdit"
      >
        수정
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="confirmDeletion"
      >
        삭제
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="goBack"
      >
        되돌아가기
      </button>
    </div>

    <!-- 버튼에 따른 Modal -->
    <div
      v-if="isEditModalOpen || isDeleteModalOpen"
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
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
                    <p class="text-sm text-gray-500">{{ modalMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-4 bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                v-if="isEditModalOpen"
                @click="confirmEdit"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                수정
              </button>
              <button
                v-if="isDeleteModalOpen"
                @click="confirmDelete"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600 sm:mt-0 sm:w-auto"
              >
                삭제
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
import authInstance from '@/utils/axiosUtils';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const membership = ref({});
    const isEditModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const route = useRoute();
    const router = useRouter();
    const membershipId = route.params.id;

    // 멤버십 상세 정보 가져오기
    const fetchMembershipDetail = async () => {
      try {
        const response = await authInstance.get(`/api/admin/membership/${membershipId}`);
        membership.value = response.data;
      } catch (error) {
        console.error('멤버십 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    // 수정된 정보를 서버로 보내기
    const confirmEdit = async () => {
      try {
        await authInstance.patch(`/api/admin/membership/${membershipId}`, {
          price: membership.value.price,
          // description: membership.value.description,
        });
        alert('멤버십이 수정되었습니다.');
        isEditModalOpen.value = false;
        fetchMembershipDetail(); // 갱신된 정보 다시 가져오기
      } catch (error) {
        console.error('멤버십 수정에 실패했습니다.', error);
      }
    };

    // 삭제 버튼 클릭
    const confirmDeletion = () => {
      modalTitle.value = '멤버십 삭제';
      modalMessage.value = '정말로 멤버십을 삭제하시겠습니까?';
      isDeleteModalOpen.value = true;
    };

    const confirmDelete = async () => {
      try {
        await authInstance.delete(`/api/admin/membership/${membershipId}`);
        alert('멤버십이 삭제되었습니다.');
        router.back();
      } catch (error) {
        console.error('멤버십 삭제에 실패했습니다.', error);
      }
    };

    const goBack = () => {
      router.back();
    };

    const closeModal = () => {
      isEditModalOpen.value = false;
      isDeleteModalOpen.value = false;
    };

    onMounted(() => {
      fetchMembershipDetail();
    });

    return {
      membership,
      isEditModalOpen,
      isDeleteModalOpen,
      modalTitle,
      modalMessage,
      goBack,
      confirmEdit,
      confirmDeletion,
      confirmDelete,
      closeModal,
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
