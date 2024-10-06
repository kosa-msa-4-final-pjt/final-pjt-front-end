<template>
  <div>
    <div class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg">
      <div class="mb-6">
        <label for="title" class="block text-sm font-medium mb-2">제목</label>
        <input
          class="w-full h-[44px] p-3 rounded border focus:outline-none focus:ring-1 focus:ring-midGreen"
          type="text"
          id="title"
          :readonly="!isEditMode"
          v-model="FAQ.title"
          :class="{ 'bg-gray-100': !isEditMode }"
        />
      </div>

      <div class="mb-6">
        <label for="content" class="block text-sm font-medium mb-2">내용</label>
        <textarea
          class="mt-2 block w-full h-[500px] px-3 py-2 rounded border shadow-sm focus:outline-none focus:ring-1 focus:ring-midGreen resize-none"
          id="content"
          :readonly="!isEditMode"
          v-model="FAQ.content"
          :class="{ 'bg-gray-100': !isEditMode }"
        ></textarea>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="flex justify-end mt-4 gap-5">
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="toggleEditMode"
      >
        {{ isEditMode ? '저장' : '수정' }}
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="removeFAQ"
      >
        삭제
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        type="button"
        @click="goBack"
      >
        되돌아가기
      </button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authInstance } from '@/utils/axiosUtils';

export default {
  setup() {
    const route = useRoute();
    const routerInstance = useRouter();

    // FAQ 데이터 (객체로 초기화)
    const FAQ = ref({
      title: '',
      content: '',
    });

    // 수정 모드 여부
    const isEditMode = ref(false);

    // FAQ ID
    const FAQId = ref(route.params.id);

    // FAQ 상세 정보 가져오기
    const getFAQDetail = async () => {
      try {
        const response = await authInstance.get(`/api/admin/faq/${FAQId.value}`);
        FAQ.value = response.data;
      } catch (error) {
        console.error('FAQ를 가져오지 못했습니다.', error);
      }
    };

    // FAQ 수정 기능
    const updateFAQ = async () => {
      const result = await Swal.fire({
        text: '수정하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '수정',
        cancelButtonText: '취소',
        confirmButtonColor: '#429f50',
        cancelButtonColor: '#d33',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await authInstance.patch(`/api/admin/faq/${FAQId.value}`, {
          title: FAQ.value.title,
          content: FAQ.value.content,
        });
        Swal.fire({
          text: 'FAQ가 성공적으로 수정되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#429f50',
        }).then(() => {
          routerInstance.back();
        });
      } catch (error) {
        Swal.fire({
          text: 'FAQ 저장에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#f39c12',
        });
        console.error('FAQ 저장을 실패했습니다.', error);
      }
    };

    // FAQ 삭제 기능
    const removeFAQ = async () => {
      const result = await Swal.fire({
        text: '정말로 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await authInstance.delete(`/api/admin/faq/${FAQId.value}`);
        Swal.fire({
          text: 'FAQ가 성공적으로 삭제되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#429f50',
        }).then(() => {
          routerInstance.back();
        });
      } catch (error) {
        Swal.fire({
          text: 'FAQ 삭제에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          confirmButtonColor: '#f39c12',
        });
        console.error('FAQ 삭제를 실패했습니다.', error);
      }
    };

    // 수정 모드 토글 및 저장 로직
    const toggleEditMode = () => {
      if (isEditMode.value) {
        // 현재 수정 모드일 때 저장을 수행
        updateFAQ();
      } else {
        // 수정 모드로 전환
        isEditMode.value = true;
      }
    };

    // 되돌아가기 기능
    const goBack = () => {
      routerInstance.back();
    };

    // 컴포넌트 마운트 시 FAQ 상세 정보 가져오기
    onMounted(() => {
      getFAQDetail();
    });

    return {
      FAQ,
      isEditMode,
      FAQId,
      updateFAQ,
      removeFAQ,
      toggleEditMode,
      goBack,
    };
  },
};
</script>

<style scoped></style>
