<template>
  <div>
    <div>
      <button class="hover:text-midGreen text-gray-600 text-[30px] font-bold" @click="goBack">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
    </div>
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

        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">가입일</label>
          <p class="w-4/5 px-10">{{ member.createAt }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authInstance } from '@/utils/axiosUtils';

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
      member,
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
