<template>
  <div>
    <!-- 1:1 문의 이미지 -->
    <div class="flex items-center justify-center h-full mb-10">
      <img class="object-fill w-72 h-auto rounded-full rounded-lg bg-white" src="@/assets/replaceHouse.png" alt="" />
    </div>
    <!-- 1:1 문의 내용 -->
    <div>
      <ul class="p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">카테고리</label>
          <p class="w-1/5 px-10">계정</p>
          <p class="px-2 border-2 border-solid border-secondary rounded-lg whitespace-nowrap text-secondary">유지</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">제목</label>
          <p class="w-4/5 px-10">기업 계정으로 잘못 가입했어요</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">내용</label>
          <p class="w-4/5 px-10">실수함</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">고객명</label>
          <p class="w-4/5 px-10">이호찬</p>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500">게시일</label>
          <p class="w-4/5 px-10">24.10.07</p>
        </li>
      </ul>
    </div>
    <!-- 문의 답변 공간 -->
    <div class="py-5">
      <form>
        <label class="block">
          <span class="block text-sm font-medium text-slate-700 font-sans">문의에 대한 답변을 작성해주세요.</span>
          <input
            v-model="answer"
            type="text"
            class="w-full h-full mt-2 p-2 font-sans rounded border-1 border-solid text-base w-full h-12 resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
          />
        </label>
        <!-- 답변 버튼 공간 -->
        <div class="flex justify-end mt-5 gap-5">
          <button
            type="button"
            @click="showModal = true"
            class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          >
            등록하기
          </button>
          <button
            type="button"
            class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          >
            수정하기
          </button>
          <button
            type="button"
            @click="goBack"
            class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          >
            되돌아가기
          </button>
        </div>
        <!-- 버튼에 따른 Modal -->
        <div v-if="showModal" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <!-- Background backdrop -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <!-- Modal 내용 -->
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div
                      class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                    >
                      <svg
                        class="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">문의 답변 등록</h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          문의에 대한 답변을 완료하겠습니까? 해당 게시물의 작업은 그대로 고객님께 전달됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Modal 버튼 -->
                <div class="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-4">
                  <button
                    @click="registerPost"
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                  >
                    등록
                  </button>
                  <button
                    @click="showModal = false"
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      answer: '',
    };
  },
  methods: {
    registerPost() {
      console.log('Answer Registered:', this.answer);
      this.showModal = false;
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style>
.littleTitle {
  display: flex;
}
</style>
