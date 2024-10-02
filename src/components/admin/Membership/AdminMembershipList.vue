<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">멤버십 관리</h2>
      <ul class="flex justify-between">
        <li>
          <div class="flex gap-4">
            <div>
              <label for="" class="font-medium">총 멤버십수</label>
              <p class="text-red">{{ totalMemberships }}개</p>
            </div>
            <div>
              <label for="" class="font-medium">신규 멤버십수</label>
              <p class="text-red">{{ newMemberships }}개</p>
            </div>
            <div>
              <label for="" class="font-medium">총 멤버십 가입자수</label>
              <p class="text-red">{{ totalSubscribers }}명</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">번호</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가격</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가입자수</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(membership, index) in memberships" :key="membership.name">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ index + 1 }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ membership.name }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.price }}원
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.subscriberCount }}명
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div class="mt-5">
      <vue-paginate
        :model-value="page"
        :page-count="totalPages"
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
        @update:model-value="page = $event"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { VuePaginate } from '@svifty7/vue-paginate';
import { authInstance } from '@/utils/axiosUtils';
import dayjs from 'dayjs';

export default defineComponent({
  components: {
    VuePaginate,
  },
  setup() {
    const page = ref(1);
    const totalPages = ref(1);
    const memberships = ref([]);
    const totalMemberships = ref(0);
    const newMemberships = ref(0);
    const totalSubscribers = ref(0);

    // 현재 날짜 기준 2주 이내의 가입자를 찾는 함수
    const isNewCompany = (startDate) => {
      const now = dayjs(); // 현재 날짜
      const signup = dayjs(startDate); // 가입 날짜
      return now.diff(signup, 'day') <= 14; // 14일 이내인지 확인
    };

    const fetchMembershipList = async () => {
      try {
        const response = await authInstance.get(`/api/admin/membership/list`);
        memberships.value = response.data;
        totalMemberships.value = memberships.value.length;
        console.log(response.data);

        newMemberships.value = memberships.value.filter((membership) => isNewCompany(membership.startDate)).length;
      } catch (error) {
        console.error('멤버십 데이터를 가져오는데 실패했습니다.', error);
      }
    };

    const fetchMemberShipCompanies = async () => {
      try {
        const response = await authInstance.get('/api/admin/memberships');
        const membershipCompanies = response.data.list;
        totalSubscribers.value = membershipCompanies.length;

        // 멤버십별 가입자 수 계산
        const membershipMap = {};
        membershipCompanies.forEach((membership) => {
          if (!membershipMap[membership.membershipName]) {
            membershipMap[membership.membershipName] = {
              name: membership.membershipName,
              price: membership.membershipPrice,
              subscriberCount: 1, // 첫 가입자
              startDate: membership.startDate, // 가입일을 유지하여 신규 멤버십 판단
            };
          } else {
            membershipMap[membership.membershipName].subscriberCount += 1; // 가입자 추가
          }
        });

        memberships.value = Object.values(membershipMap); // 배열로 변환
      } catch (error) {
        console.error('멤버십 가입자 데이터를 가져오는데 실패했습니다.', error);
      }
    };

    onMounted(() => {
      fetchMembershipList();
      fetchMemberShipCompanies();
    });

    return {
      page,
      totalPages,
      memberships,
      totalMemberships,
      newMemberships,
      totalSubscribers,
      isNewCompany,
    };
  },
});
</script>
