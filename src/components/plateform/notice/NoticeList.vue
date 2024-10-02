<template>
  <div class="w-full" v-if="noticeList.length">
    <div class="mx-auto w-full rounded-2xl bg-white p-4">
      <strong class="text-xl">총 {{ noticeList.length }}개의 공지사항</strong>
    </div>

    <div v-for="(notice, index) in noticeList" :key="index" class="flex flex-col space-y-6">
      <!-- 전체 공지사항 공간 -->
      <div class="flex border-b cursor-pointer px-4 py-6 transition duration-300" @click="noticeDetail(notice.id)">
        <div class="flex-1 flex flex-col pr-6">
          <!-- 제목 -->
          <h2 class="text-xl font-bold text-gray-900 mb-4">{{ notice.title }}</h2>

          <!-- 내용 미리보기 -->
          <div class="text-gray-700">
            <p>{{ truncateContent(notice.content) }}</p>
          </div>

          <!-- 별점 및 작성자 정보 -->
          <div class="flex items-center mt-3 text-sm text-gray-600 font-medium">
            <span class="mr-4">{{ notice.authorName }}</span>
            <span class="font-normal text-gray-500">{{ notice.updateDate }}</span>
          </div>
        </div>

        <!-- 썸네일 이미지 -->
        <div class="w-32 h-32 flex-shrink-0">
          <img src="@/assets/logo.png" alt="공지사항 이미지" class="w-full h-full object-cover rounded-lg shadow-sm" />
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        class="py-4 px-20 my-10 font-medium text-midGreen border-[1px] border-midGreen rounded hover:bg-midGreen hover:text-white transition duration-300"
      >
        더보기
      </button>
    </div>
  </div>
  <div v-else class="mx-auto w-full rounded-2xl bg-white p-4">
    <div class="pb-10">
      <strong class="text-xl">총 {{ noticeList.length }}개의 공지사항</strong>
    </div>
    <p class="text-center text-gray-500">현재 등록되어 있는 공지사항이 없습니다.</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { authInstance } from '@/utils/axiosUtils';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const noticeList = ref([]);
    const router = useRouter(); // 라우터 객체

    const getNotices = async () => {
      try {
        const response = await authInstance.get('/api/notice/list');
        noticeList.value = response.data;
      } catch (error) {
        console.log('공지사항을 가져오지 못했습니다.', error);
      }
    };

    const truncateContent = (content) => {
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    // 공지사항 상세 페이지로 이동하는 함수
    const noticeDetail = (id) => {
      router.push(`/notice/list/${id}`);
    };

    getNotices();

    return {
      noticeList,
      getNotices,
      truncateContent,
      noticeDetail,
    };
  },
};
</script>

<style scoped></style>
