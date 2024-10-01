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
        <li>
          <button
            class="px-2 py-1 bg-midGreen hover:bg-[#2a692d] text-white rounded-lg text-[16px] font-medium mt-6"
            @click="$router.push('/mypage/admin/createAdminMembership')"
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
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가격</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">서비스 내용</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가입자수</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(membership, index) in memberships" :key="membership.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ index + 1 }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ membership.name }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.price }}원
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.description || '서비스 내용 없음' }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.subscribers }}명
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push(`/mypage/admin/adminMembershipList/${membership.id}`)"
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
import authInstance from '@/utils/axiosUtils';

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

    const fetchMembershipList = async () => {
      try {
        const response = await authInstance.get(`/api/admin/membership/list`);
        console.log(response.data);

        memberships.value = response.data;
        totalMemberships.value = memberships.value.length;
      } catch (error) {
        console.error('멤버십 데이터를 가져오는데 실패했습니다.', error);
      }
    };

    onMounted(() => {
      fetchMembershipList(page.value);
    });

    return {
      page,
      totalPages,
      memberships,
      totalMemberships,
      newMemberships,
      totalSubscribers,
      fetchMembershipList,
    };
  },
});
</script>
