<template>
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold mb-4">정말 환불하시겠습니까?</h2>

      <div class="flex justify-end space-x-4">
        <button @click="confirmRefund" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">예</button>
        <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">아니요</button>
      </div>
    </div>
  </div>

  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">멤버십 가입자 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 가입자수</label>
          <p class="text-red">3명</p>
        </li>
        <li>
          <label for="" class="font-medium">신규 가입자수</label>
          <p class="text-red">3명</p>
        </li>
        <li>
          <label for="" class="font-medium">총 가입비</label>
          <p class="text-red">350원</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리수</label>
          <p class="text-red">1개</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리금액</label>
          <p class="text-red">150원</p>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div class="flex-col">
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 종류</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 금액</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 가입일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 만료일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">환불 상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">환불</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="company in membershipCompany" :key="company.companyId">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.companyName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.membershipName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.membershipPrice }}원
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ company.startDate }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ company.endDate }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p
                class="border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap"
                :class="{ 'border-2': company.validMembership, 'border-red': !company.validMembership }"
              >
                {{ company.validMembership ? '진행' : '정지' }}
              </p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">X</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="openModal"
              >
                환불처리
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div class="mt-5">
      <vue-paginate
        :model-value="pageNumber"
        :page-count="totalPage"
        :page-range="3"
        :margin-pages="2"
        :click-handler="fetchMembershipList"
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
import { authInstance } from '@/utils/axiosUtils';

export default defineComponent({
  components: {
    VuePaginate,
  },

  async mounted() {
    const memberships = await authInstance.get('/api/admin/memberships');
    console.log(memberships.data);

    this.membershipCompany = memberships.data.slice;
    this.pageNumber = memberships.data.pageNumber;
  },

  setup() {
    const pageNumber = ref(1);
    const pageSize = ref(10);
    const membershipCompany = ref([]);
    const totalPage = ref(1);
    const isModalOpen = ref(false);

    const openModal = () => {
      console.log(isModalOpen.value);
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const fetchMembershipList = async (pageNum) => {
      console.log(pageNum);
      const memberships = await authInstance.get('/api/admin/memberships');
      this.membershipCompany = memberships.data.slice;
      this.pageNumber = memberships.data.pageNumber;
    };

    return {
      membershipCompany,
      pageNumber,
      pageSize,
      totalPage,
      fetchMembershipList,
      isModalOpen,
      openModal,
      closeModal,
    };
  },
});
</script>

<style scoped></style>
