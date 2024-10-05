<template>
  <div>
    <!-- 공지사항 이미지 -->
    <div class="mb-8 flex justify-center">
      <img
        class="w-[650px] h-[300px] rounded-lg object-cover"
        :src="require('@/assets/logo.png')"
        alt="공지사항 이미지"
      />
    </div>

    <!-- 공지사항 내용 -->
    <div class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg">
      <!-- 제목 입력 -->
      <div class="mb-6">
        <label for="title" class="block text-sm font-medium mb-2">제목</label>
        <input
          class="w-full h-[44px] p-3 rounded border focus:outline-none focus:ring-1 focus:ring-midGreen"
          type="text"
          id="title"
          :readonly="!isEditMode"
          v-model="notice.title"
          :class="{ 'bg-gray-100': !isEditMode }"
        />
      </div>

      <!-- 내용 입력 -->
      <div class="mb-6">
        <label for="content" class="block text-sm font-medium mb-2">내용</label>
        <textarea
          class="mt-2 block w-full h-[500px] px-3 py-2 rounded border shadow-sm focus:outline-none focus:ring-1 focus:ring-midGreen resize-none"
          id="content"
          :readonly="!isEditMode"
          v-model="notice.content"
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
        @click="removeNotice"
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authInstance } from '@/utils/axiosUtils';
import router from '@/router';

export default {
  setup() {
    const route = useRoute();
    const routerInstance = useRouter();

    // 공지사항 데이터 (객체로 초기화)
    const notice = ref({
      title: '',
      content: '',
    });

    // 수정 모드 여부
    const isEditMode = ref(false);

    // 공지사항 ID
    const noticeId = ref(route.params.id);

    // 공지사항 상세 정보 가져오기
    const getNoticeDetail = async () => {
      try {
        const response = await authInstance.get(`/api/admin/notice/${noticeId.value}`);
        notice.value = response.data;
      } catch (error) {
        console.error('공지사항을 가져오지 못했습니다.', error);
      }
    };

    // 공지사항 수정 기능
    const updateNotice = async () => {
      const isConfirm = confirm('수정하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        await authInstance.patch(`/api/admin/notice/${noticeId.value}`, {
          title: notice.value.title,
          content: notice.value.content,
        });
        router.back();
      } catch (error) {
        console.error('공지사항 저장을 실패했습니다.', error);
      }
    };

    // 공지사항 삭제 기능
    const removeNotice = async () => {
      const isConfirm = confirm('정말로 삭제하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        await authInstance.delete(`/api/admin/notice/${noticeId.value}`);
        routerInstance.back();
      } catch (error) {
        console.error('공지사항 삭제를 실패했습니다.', error);
      }
    };

    // 수정 모드 토글 및 저장 로직
    const toggleEditMode = () => {
      if (isEditMode.value) {
        // 현재 수정 모드일 때 저장을 수행
        updateNotice();
      } else {
        // 수정 모드로 전환
        isEditMode.value = true;
      }
    };

    // 되돌아가기 기능
    const goBack = () => {
      routerInstance.back();
    };

    // 컴포넌트 마운트 시 공지사항 상세 정보 가져오기
    onMounted(() => {
      getNoticeDetail();
    });

    return {
      notice,
      isEditMode,
      noticeId,
      updateNotice,
      removeNotice,
      toggleEditMode,
      goBack,
    };
  },
};
</script>

<style scoped></style>
