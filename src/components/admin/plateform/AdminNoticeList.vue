<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">공지사항 관리</h2>
      <ul class="flex justify-between">
        <li>
          <label for="" class="font-medium">현재 등록된 공지사항수</label>
          <p class="text-red">{{ noticeList.length }}개</p>
        </li>
        <li>
          <button
            class="px-2 py-1 bg-midGreen hover:bg-[#2a692d] text-white rounded-lg text-[16px] font-medium mt-6"
            @click="$router.push('/mypage/admin/admincreatenotice')"
          >
            등록하기
          </button>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">번호</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">제목</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">관리자명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">게시일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in noticeList" :key="notice.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ index + 1 }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ notice.title }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ notice.authorName }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ notice.updateDate }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="adminNoticeDetail(notice.id)"
              >
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import authInstance from '@/utils/axiosUtils';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const noticeList = ref([]);
    const router = useRouter(); // 라우터 객체

    const getNotices = async () => {
      try {
        const response = await authInstance.get('/api/admin/notice/list');
        noticeList.value = response.data;
      } catch (error) {
        console.log('공지사항을 가져오지 못했습니다.', error);
      }
    };

    const truncateContent = (content) => {
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    // 공지사항 상세 페이지로 이동하는 함수
    const adminNoticeDetail = (id) => {
      router.push(`/mypage/admin/adminNoticeDetail/${id}`);
    };

    getNotices();

    return {
      noticeList,
      getNotices,
      truncateContent,
      adminNoticeDetail,
    };
  },
};
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
