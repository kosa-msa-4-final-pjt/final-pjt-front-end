<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">시공후기 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 등록된 시공 후기수</label>
          <p class="text-red">{{ reviews.length }}개</p>
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
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">고객명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">게시일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(review, index) in reviews" :key="review.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ index + 1 }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ review.title }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ review.member.nickName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ review.company.companyName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ formatDate(review.regDate) }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="adminReviewDetail(review.id)"
              >
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div class="mt-5" v-if="totalPage > 1">
      <vue-paginate
        :model-value="pageNumber"
        :page-count="totalPage"
        :page-range="3"
        :margin-pages="2"
        :click-handler="fetchReviewList"
        prev-text="<"
        next-text=">"
        :container-class="'flex justify-center font-sans cursor-pointer'"
        :page-link-class="'m-3 hover:bg-accent '"
        :prev-link-class="'m-3'"
        :next-link-class="'m-3'"
        active-class="bg-accent rounded-md"
        @update:model-value="pageNumber = $event"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { VuePaginate } from '@svifty7/vue-paginate';
import authInstance from '@/utils/axiosUtils';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    VuePaginate,
  },
  setup() {
    const pageNumber = ref(1);
    const pageSize = ref(5);
    const reviews = ref([]);
    const totalPage = ref(1);
    const router = useRouter();

    const adminReviewDetail = (id) => {
      router.push(`/mypage/admin/adminMemberReviewDetail/${id}`);
    };

    const fetchReviewList = async (pageNum = pageNumber.value) => {
      try {
        const response = await authInstance.get(`/api/admin/reviews`, {
          params: {
            pageNumber: pageNum,
            size: pageSize.value,
          },
        });
        console.log(response.data);
        reviews.value = response.data.slice;
        totalPage.value = response.data.totalPages;
        pageNumber.value = response.data.number;
      } catch (error) {
        console.error('Failed to fetch review data', error);
      }
    };

    // 날짜 형식화 함수 (시간 제거)
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0'); // 날짜가 2자리 수가 되도록 0을 앞에 붙임
      return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 리턴
    };

    fetchReviewList();

    return {
      reviews,
      pageNumber,
      pageSize,
      totalPage,
      adminReviewDetail,
      fetchReviewList,
      formatDate,
    };
  },
});
</script>
