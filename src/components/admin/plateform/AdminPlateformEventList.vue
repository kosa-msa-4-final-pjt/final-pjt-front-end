<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">공지사항 관리</h2>
      <ul class="flex justify-between">
        <li>
          <label for="" class="font-medium">현재 등록된 공지사항수</label>
          <p class="text-red">1개</p>
        </li>
        <li>
          <button
            class="px-2 py-1 bg-midGreen hover:bg-[#2a692d] text-white rounded-lg text-[16px] font-medium mt-6"
            @click="$router.push('/mypage/admin/createAdminPlateformEvent')"
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
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">1</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              체인집업 플랫폼 새로운 정책으로 여러분을 맞이합니다!
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">체인집업</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.10.07</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminplateformEventDetail')"
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
