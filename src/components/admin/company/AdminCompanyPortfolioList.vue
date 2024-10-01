<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">시공사례 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 시공 사례수</label>
          <p class="text-red">{{ portfolioCompany.length }}명</p>
        </li>
        <li>
          <label for="" class="font-medium">현재 등록된 시공 사례수</label>
          <p class="text-red">{{ portfolioCompany.length }}개</p>
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
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">게시일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(portfolio, index) in portfolioCompany" :key="index">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ index + 1 }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ portfolio.title }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ portfolio.companyName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ portfolio.createdAt }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push({ name: 'adminCompanyPortfolioDetail', params: { id: portfolio.id } })"
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
        :click-handler="fetchPortfolioList"
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

export default defineComponent({
  components: {
    VuePaginate,
  },

  setup() {
    const pageNumber = ref(1);
    const pageSize = ref(5);
    const portfolioCompany = ref([]);
    const totalPage = ref(1);

    const fetchPortfolioList = async (pageNum = pageNumber.value) => {
      try {
        const response = await authInstance.get(`/api/admin/portfolios`, {
          params: {
            pageNumber: pageNum,
            size: pageSize.value,
          },
        });
        portfolioCompany.value = response.data.slice;
        totalPage.value = response.data.totalPages;
        pageNumber.value = response.data.number;
      } catch (error) {
        console.error('Failed to fetch portfolio data', error);
      }
    };

    fetchPortfolioList();

    return {
      portfolioCompany,
      pageNumber,
      pageSize,
      totalPage,
      fetchPortfolioList,
    };
  },
});
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
