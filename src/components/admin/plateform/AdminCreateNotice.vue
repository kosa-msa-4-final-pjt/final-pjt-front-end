<template>
  <div class="w-full mx-auto px-6 py-8">
    <p class="text-2xl font-semibold text-center pb-6">공지사항 등록</p>

    <form
      @submit.prevent="createNotice"
      class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg"
    >
      <div class="mb-6">
        <label for="title" class="block text-sm font-medium mb-2">제목</label>
        <input
          v-model="title"
          class="w-full h-[44px] p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
      </div>

      <div class="mb-6">
        <label for="content" class="block text-sm font-medium mb-2">내용</label>
        <textarea
          v-model="content"
          class="mt-2 block w-full h-[500px] px-3 py-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-midGreen resize-none"
          placeholder="내용을 입력해주세요."
        ></textarea>
      </div>

      <!-- 버튼 공간 -->
      <div class="flex gap-12">
        <button
          class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          type="button"
          @click="this.$router.go(-1)"
        >
          되돌아가기
        </button>
        <button
          class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          type="submit"
        >
          등록하기
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import authInstance from '@/utils/axiosUtils';
import { ref } from 'vue';

export default {
  setup() {
    const title = ref('');
    const content = ref('');

    const createNotice = async () => {
      const isConfirm = confirm('공지사항을 등록하시겠습니까?');
      if (!isConfirm) {
        return;
      }
      try {
        const noticeData = {
          title: title.value,
          content: content.value,
        };
        await authInstance.post('/api/admin/notice/create', noticeData);
        router.back();
      } catch (error) {
        console.log('공지사항 등록을 실패했습니다.', error);
      }
    };

    return {
      title,
      content,
      createNotice,
    };
  },
};
</script>

<style scoped></style>
