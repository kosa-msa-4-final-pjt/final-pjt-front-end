<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-lg">
    <div class="flex flex-col justify-center items-center w-full mb-8">
      <h2 class="text-2xl font-semibold mt-4">{{ info.nickName }}</h2>
      <p class="text-sm text-gray-500">{{ info.email }}</p>
    </div>

    <form @submit.prevent="updateUser" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">이름</label>
        <input
          type="text"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="이름 입력"
          readonly
          :value="info.name"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">닉네임</label>
        <input
          type="text"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="닉네임 입력"
          readonly
          :value="info.nickName"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">이메일</label>
        <input
          type="email"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="이메일 입력"
          readonly
          :value="info.email"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="비밀번호 입력"
          v-model="info.password"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">비밀번호 확인</label>
        <input
          type="password"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="비밀번호 확인"
          v-model="info.confirmPassword"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">휴대전화</label>
        <input
          type="text"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="휴대전화 입력"
          v-model="info.phoneNumber"
        />
      </div>

      <div class="flex justify-center">
        <button type="submit" class="px-6 py-3 bg-midGreen text-white font-medium rounded-md transition duration-300">
          수정
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';
import Swal from 'sweetalert2';
import { ref } from 'vue';

export default {
  setup() {
    const info = ref([
      {
        password: '',
        confirmPassword: '',
        phoneNumber: '',
      },
    ]);

    const userInfo = async () => {
      try {
        const response = await authInstance.get('/api/member/mypage');
        info.value = response.data;
      } catch (error) {
        console.error('유저 정보를 가져오지 못했습니다.', error);
      }
    };

    const updateUser = async () => {
      // 비밀번호 확인
      if (info.value.password !== info.value.confirmPassword) {
        Swal.fire({
          text: '비밀번호가 일치하지 않습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#f39c12',
        });

        return;
      }

      try {
        // 사용자 정보 업데이트 API 호출
        await authInstance.patch('/api/member/mypage', {
          password: info.value.password,
          phoneNumber: info.value.phoneNumber,
        });
        Swal.fire({
          text: '정보가 성공적으로 수정되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#429f50',
        });
        window.location.reload();
      } catch (error) {
        console.error('정보 수정에 실패했습니다.', error);
      }
    };

    userInfo();

    return {
      info,
      updateUser,
    };
  },
};
</script>

<style scoped></style>
