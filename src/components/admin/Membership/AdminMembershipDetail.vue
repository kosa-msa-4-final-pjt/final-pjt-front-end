<template>
  <div>
    <!-- 멤버십 정보 -->
    <div>
      <ul class="p-10 rounded-lg bg-white">
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">멤버십명</label>
          <div>
            <p class="w-4/5 px-10">{{ type }}</p>
            <input
              type="text"
              v-model="newType"
              placeholder="변경할 멤버십명"
              class="mt-2 mx-10 pl-2 border-2 border-indigo-500 rounded-md resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            />
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">가격</label>
          <div>
            <p class="w-4/5 px-10">{{ price }}원</p>
            <input
              type="number"
              v-model="newPrice"
              placeholder="변경할 멤버십 가격"
              class="mt-2 mx-10 pl-2 border-2 border-indigo-500 rounded-md resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            />
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">서비스 내용</label>
          <div>
            <p class="w-4/5 px-10">{{ desc }}</p>
            <input
              type="text"
              v-model="newDesc"
              placeholder="변경할 멤버십 서비스 내용"
              class="mt-2 mx-10 pl-2 border-2 border-indigo-500 rounded-md resize-none focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            />
          </div>
        </li>
        <li class="littleTitle">
          <label for="" class="w-1/5 border-r-2 border-indigo-500 font-medium">가입자수</label>
          <p class="w-4/5 px-10">{{ membershipCount }}명</p>
        </li>
      </ul>
    </div>
    <!-- 버튼 공간 -->
    <div class="flex justify-end mt-4 gap-5">
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="confirmEdition"
      >
        수정
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="confirmDeletion"
      >
        삭제
      </button>
      <button
        class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
        @click="this.$router.back()"
      >
        되돌아가기
      </button>
    </div>
    <!-- 버튼에 따른 Modal -->
    <div
      v-if="isEditModalOpen || isDeleteModalOpen"
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
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
                  <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{{ modalTitle }}</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ modalMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-4 bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                v-if="isEditModalOpen"
                @click="confirmEdit"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                수정
              </button>
              <button
                v-if="isDeleteModalOpen"
                @click="confirmDelete"
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600 sm:mt-0 sm:w-auto"
              >
                삭제
              </button>
              <button
                @click="
                  isEditModalOpen = false;
                  isDeleteModalOpen = false;
                "
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 임의로 넣어둔 값들
      type: 'Basic',
      price: '100',
      desc: '가장 기본적인 멤버십',
      membershipCount: '2',
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      modalTitle: '',
      modalMessage: '',
    };
  },
  methods: {
    // 멤버십 종류 변경값 반환
    changeType() {
      return this.newType ? this.newType : null;
    },
    // 멤버십 가격 변경값 반환
    changePrice() {
      return this.newPrice ? this.newPrice : null;
    },
    // 멤버십 소개 변경값 반환
    changeDesc() {
      return this.newDesc ? this.newDesc : null;
    },
    // 변경사항 여부를 확인하고 모달을 띄움
    confirmEdition() {
      let typeChange = this.changeType();
      let priceChange = this.changePrice();
      let descChange = this.changeDesc();

      // 멤버십명, 가격, 소개 변경 여부에 따른 모달 메시지 구성
      if (typeChange || priceChange || descChange) {
        this.modalTitle = '관리자 권한으로 멤버십 정책 변경';

        // 변경된 항목들에 대해 메시지 작성
        let changes = [];
        if (typeChange) {
          changes.push('멤버십명');
        }
        if (priceChange) {
          changes.push('가격');
        }
        if (descChange) {
          changes.push('소개');
        }

        // 변경된 내용이 여러 개일 경우 메시지 구성
        this.modalMessage = `${changes.join(
          ', '
        )}를 변경하시겠습니까? 변경한 멤버십 작업은 그대로 서버에 저장됩니다. 이 작업은 취소할 수 없습니다.`;
        this.isEditModalOpen = true;
      } else {
        alert('변경 사항이 없습니다.');
      }
    },
    // 모달 수정 버튼 클릭 시 정보 수정
    confirmEdit() {
      // 서버로 데이터를 보내는 로직을 여기에 작성
      if (this.newType) {
        this.type = this.newType;
      }
      if (this.newPrice) {
        this.price = this.newPrice;
      }
      if (this.newDesc) {
        this.desc = this.newDesc;
      }

      alert('데이터가 변경되었습니다.');
      this.newType = null;
      this.newPrice = null;
      this.newDesc = null;
      this.isEditModalOpen = false;
    },
    // 삭제 버튼 클릭시
    confirmDeletion() {
      this.modalTitle = '관리자 권한으로 삭제';
      this.modalMessage =
        '해당 멤버십을 정말로 삭제하시겠습니까? 해당 멤버십의 작업은 그대로 서버에 저장됩니다. 이 작업은 취소할 수 없습니다.';
      this.isDeleteModalOpen = true;
    },

    confirmDelete() {
      // 서버로 데이터를 보내는 로직을 여기에 작성
      alert('삭제했습니다.');
      this.isDeleteModalOpen = false;
    },
  },
};
</script>

<style>
.littleTitle {
  display: flex;
}
</style>
