<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">업체 가입 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 가입자수</label>
          <p class="text-red">{{ totalCompanies.length }}명</p>
        </li>
        <li>
          <label for="" class="font-medium">신규 가입자수</label>
          <p class="text-red">{{ newCompanies }}명</p>
        </li>
      </ul>
    </div>

    <!-- center -->
    <div class="flex-col">
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">이메일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">대표자명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">전화번호</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십종류</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가입날짜</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">메일인증</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="company in companies" :key="company.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.name }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.email }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.nickName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ formatPhoneNumber(company.phoneNumber) }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.membership ?? '-' }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.createAt }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.verified ? 'O' : 'X' }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="viewCompanyDetail(company)"
              >
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div class="mt-5">
      <vue-paginate
        :model-value="page"
        :page-count="totalPage"
        :page-range="3"
        :margin-pages="2"
        :click-handler="clickCallback"
        prev-text="<"
        next-text=">"
        :container-class="'flex justify-center font-sans cursor-pointer'"
        :page-link-class="'m-3 hover:bg-accent '"
        :prev-link-class="'m-3'"
        :next-link-class="'m-3'"
        active-class="bg-accent rounded-md"
        @update:model-value="page = $event"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { authInstance } from '@/utils/axiosUtils';
import dayjs from 'dayjs';
import router from '@/router';
import { VuePaginate } from '@svifty7/vue-paginate';

export default defineComponent({
  components: {
    VuePaginate,
  },
  setup() {
    const page = ref(1);
    const pageSize = ref(5);
    const totalPage = ref();

    const companies = ref([]);
    const totalCompanies = ref([]);
    const newCompanies = ref(0);

    // 현재 날짜 기준 2주 이내의 가입자를 찾는 함수
    const isNewCompany = (createAt) => {
      const now = dayjs(); // 현재 날짜
      const signup = dayjs(createAt); // 가입 날짜
      return now.diff(signup, 'day') <= 14; // 14일 이내인지 확인
    };

    // API에서 업체 리스트를 가져오는 함수
    const fetchCompanies = async () => {
      try {
        const response = await authInstance.get(`/api/admin/companies?page=${page.value - 1}&size=${pageSize.value}`);
        console.log(response.data);

        companies.value = response.data.slice || [];
        totalCompanies.value = response.data.list || [];

        totalPage.value = response.data.totalPage;

        // 신규 가입자 계산
        newCompanies.value = totalCompanies.value.filter((company) => isNewCompany(company.createAt)).length;
      } catch (error) {
        console.error('Error fetching membership list:', error);
      }
    };

    const clickCallback = (pageNum) => {
      fetchCompanies(pageNum);
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

    const viewCompanyDetail = (company) => {
      router.push({
        path: `/mypage/admin/adminCompanyList/${company.id}`,
      });
    };

    // 컴포넌트가 마운트될 때 데이터 불러오기
    onMounted(() => {
      fetchCompanies();
    });

    return {
      page,
      pageSize,
      totalPage,
      companies,
      totalCompanies,
      newCompanies,
      clickCallback,
      isNewCompany,
      formatPhoneNumber,
      viewCompanyDetail,
    };
  },
});
</script>

<style scoped></style>
