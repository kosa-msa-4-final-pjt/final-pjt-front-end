<template>
  <div class="max-w-lg mx-auto bg-white p-8 rounded-lg">
    <div class="flex flex-col justify-center items-center w-full mb-8">
      <div class="w-32 h-32">
        <img
          :src="info.companyLogoUrl ? info.companyLogoUrl : require('@/assets/logo.png')"
          class="object-cover w-full h-full rounded-full shadow-lg"
          alt="Profile Image"
        />
      </div>
      <h2 class="text-2xl font-semibold mt-4">{{ info.companyName }}</h2>
      <p class="text-sm text-midGreen">
        <font-awesome-icon icon="star" />
        <span class="ml-1">{{ info.rating }}</span>
      </p>
      <p class="text-sm text-gray-500">{{ info.email }}</p>
    </div>

    <form @submit.prevent="updateCompany" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">소개글</label>
        <textarea
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen resize-none"
          placeholder="소개글을 입력해주세요."
          v-model="info.companyDesc"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">사업자 번호</label>
        <input
          type="text"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="사업자 번호 입력"
          :value="info.companyNumber"
          readonly
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">업체명</label>
        <input
          type="text"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="업체 이름 입력"
          readonly
          :value="info.companyName"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">대표 이름</label>
        <input
          type="text"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="대표자명 입력"
          readonly
          :value="info.owner"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">이메일</label>
        <input
          type="email"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="이메일 입력"
          :value="info.email"
          readonly
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">주소</label>
        <input
          type="email"
          class="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-midGreen"
          placeholder="업체 주소 입력"
          :value="info.address"
          readonly
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

      <!-- 시공 종류 선택 -->
      <div>
        <label class="block text-sm font-medium text-gray-700">시공 종류</label>

        <!-- 전체 선택 체크박스 -->
        <div class="mt-2 mb-3 flex items-center">
          <input
            type="checkbox"
            @change="toggleAllConstructionTypes"
            :checked="isAllSelected"
            class="mr-2 accent-midGreen"
          />
          <span>전체 선택</span>
        </div>

        <!-- 시공 종류 체크박스 -->
        <div class="mt-2 flex flex-wrap gap-2">
          <div v-for="type in allServices" :key="type.constructionId" class="flex items-center">
            <input type="checkbox" :value="type.constructionId" v-model="selectedTypes" class="mr-2 accent-midGreen" />
            <span>{{ type.constructionName }}</span>
          </div>
        </div>

        <p v-if="selectedTypes.length === 0" class="text-red text-[12px] mt-2">
          최소 한 개의 시공 종류를 선택해야 합니다.
        </p>
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
import { computed, ref } from 'vue';

export default {
  setup() {
    const info = ref({
      companyLogoUrl: '',
      companyDesc: '',
      companyName: '',
      rating: 0,
      email: '',
      companyNumber: '',
      address: '',
      owner: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    });

    const allServices = ref([]);
    const selectedTypes = ref([]);

    // 전체 선택 여부를 계산
    const isAllSelected = computed(() => {
      return selectedTypes.value.length === allServices.value.length;
    });

    const toggleAllConstructionTypes = () => {
      if (isAllSelected.value) {
        selectedTypes.value = [];
      } else {
        selectedTypes.value = allServices.value.map((service) => service.constructionId);
      }
    };

    const companyInfo = async () => {
      try {
        const response = await authInstance.get('/api/company/mypage');
        info.value = response.data;

        // 시공 종류 데이터도 함께 가져오기
        allServices.value = response.data.allServices;
        selectedTypes.value = response.data.activeServices;
      } catch (error) {
        console.error('업체 정보를 가져오지 못했습니다.', error);
      }
    };

    const updateCompany = async () => {
      // 비밀번호 확인
      if (info.value.password !== info.value.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (selectedTypes.value.length === 0) {
        alert('최소 한 개의 시공 종류를 선택해야 합니다.');
        return;
      }

      const isConfirm = confirm('정말로 수정하시겠습니까?');
      if (!isConfirm) {
        return;
      }

      try {
        // 사용자 정보 업데이트 API 호출
        await authInstance.patch('/api/company/mypage', {
          companyDesc: info.value.companyDesc,
          password: info.value.password,
          phoneNumber: info.value.phoneNumber,
          updateServices: selectedTypes.value, // 선택한 시공 종류 전송
        });
        alert('정보가 성공적으로 수정되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error('정보 수정에 실패했습니다.', error);
      }
    };

    companyInfo();

    return {
      info,
      allServices,
      selectedTypes,
      isAllSelected,
      toggleAllConstructionTypes,
      updateCompany,
    };
  },
};
</script>

<style scoped></style>
