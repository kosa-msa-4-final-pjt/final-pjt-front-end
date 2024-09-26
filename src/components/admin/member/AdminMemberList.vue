<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">고객 가입 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 고객 가입자수</label>
          <p class="text-red">3명</p>
        </li>
        <li>
          <label for="" class="font-medium">신규 고객 가입자수</label>
          <p class="text-red">3명</p>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">번호</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">고객명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">닉네임</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">아이디</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">전화번호</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">가입일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">1</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">김선우</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">김선우</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">kimSunWo@gmail.com</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">010-1111-2222</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.09.11</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid rounded-lg px-2 whitespace-nowrap">비활동</p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminMemberDetail')"
              >
                상세보기
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">2</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">이지연</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">몰랑이</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">qwer@gamail.com</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">010-1111-3333</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.07.10</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid rounded-lg px-2 whitespace-nowrap">비활동</p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminMemberDetail')"
              >
                상세보기
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">3</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">이보소</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">랜덤가챠</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">Notsleep@gmail.com</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">010-1111-4444</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.08.28</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap">
                활동중
              </p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminMemberDetail')"
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
        :page-count="20"
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
import { defineComponent, ref } from 'vue';
import { VuePaginate } from '@svifty7/vue-paginate';

export default defineComponent({
  components: {
    VuePaginate,
  },
  setup() {
    const page = ref(10);

    const clickCallback = (pageNum) => {
      console.log(pageNum);
    };

    return {
      page,
      clickCallback,
    };
  },
});
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
