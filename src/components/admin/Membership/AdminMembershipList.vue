<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 class="text-xl font-semibold mb-4">가격 수정</h2>
      <input
        type="number"
        v-model="price"
        class="w-full p-2 border border-gray-300 rounded-lg mb-4"
        placeholder="가격을 입력하세요"
      />
      <div class="flex justify-end space-x-2">
        <button class="bg-gray-400 text-white px-4 py-2 rounded-lg" @click="closeMembershipEditModal">취소</button>
        <button class="bg-midGreen text-white px-4 py-2 rounded-lg" @click="updatePrice">저장</button>
      </div>
    </div>
  </div>

  <!-- header -->
  <div class="flex-col">
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
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가격</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가입자수</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가격 수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="membership in memberships" :key="membership.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.name }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.price }}원
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.subscriberCount }}명
            </td>
            <td
              @click="openMembershipEditModal(membership.id)"
              class="text-center p-2 border-t border-gray-300 whitespace-nowrap cursor-pointer"
            >
              <button class="bg-black">수정</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { authInstance } from '@/utils/axiosUtils';
import dayjs from 'dayjs';

export default defineComponent({
  setup() {
    const memberships = ref([]);
    const totalMemberships = ref(0);
    const totalSubscribers = ref(0);
    const showModal = ref(false);
    const price = ref(0);
    const selectedMembershipId = ref(0);

    // 현재 날짜 기준 2주 이내의 가입자를 찾는 함수
    const isNewCompany = (startDate) => {
      const now = dayjs(); // 현재 날짜
      const signup = dayjs(startDate); // 가입 날짜
      return now.diff(signup, 'day') <= 14; // 14일 이내인지 확인
    };

    const updatePrice = async () => {
      console.log(selectedMembershipId.value);
      const updateRequest = await authInstance.patch(`/api/admin/membership/${selectedMembershipId.value}/price`, {
        price: price.value,
      });
      console.log(updateRequest);
      alert('가격 수정이 완료되었습니다.');
      window.location.reload();
    };

    const fetchMembershipList = async () => {
      try {
        const response = await authInstance.get(`/api/admin/membership/list`);
        memberships.value = response.data;
        memberships.value.sort((a, b) => b.price - a.price);

        totalMemberships.value = memberships.value.length;
        console.log(memberships.value);
      } catch (error) {
        console.error('멤버십 데이터를 가져오는데 실패했습니다.', error);
      }
    };

    // 가입자 수를 가져오는 함수
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
              subscriberCount: 1, // 첫 가입자
            };
          } else {
            membershipMap[membership.membershipName].subscriberCount += 1; // 가입자 추가
          }
        });

        // 멤버십 리스트와 가입자 수를 매핑
        memberships.value.forEach((membership) => {
          if (membershipMap[membership.name]) {
            membership.subscriberCount = membershipMap[membership.name].subscriberCount;
          } else {
            membership.subscriberCount = 0; // 가입자가 없는 경우 0으로 설정
          }
        });
      } catch (error) {
        console.error('멤버십 가입자 데이터를 가져오는데 실패했습니다.', error);
      }
    };

    const openMembershipEditModal = (membershipId) => {
      console.log(membershipId);
      showModal.value = true;
      selectedMembershipId.value = membershipId;
    };

    const closeMembershipEditModal = () => {
      showModal.value = false;
    };

    onMounted(() => {
      fetchMembershipList();
      fetchMemberShipCompanies();
    });

    return {
      memberships,
      totalMemberships,
      totalSubscribers,
      isNewCompany,
      showModal,
      openMembershipEditModal,
      closeMembershipEditModal,
      updatePrice,
      selectedMembershipId,
      price,
    };
  },
});
</script>
