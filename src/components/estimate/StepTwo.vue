<template>
  <h2 class="text-lg font-semibold my-10">시공 분야를 선택해주세요.</h2>

  <!-- 전체 선택 체크박스 -->
  <label class="items-center">
    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="mr-2" />
    <span>전체 선택</span>
  </label>

  <!-- 개별 시공 종류 체크박스 -->
  <div class="mt-5 mb-10">
    <div v-for="type in constructionTypes" :key="type.id" class="flex items-center">
      <input type="checkbox" :value="type.id" v-model="constructionType" class="mr-2 my-3" />
      <span>{{ type.name }}</span>
    </div>
    <!-- 시공 종류를 선택하지 않았을 때 경고 메시지 -->
    <p v-if="!isValidSelection" class="text-red mt-2">최소 한 개의 시공 종류를 선택해야 합니다.</p>
  </div>

  <!-- 이전/다음 버튼 -->
  <div class="mt-6 flex justify-between">
    <button @click="prevStep" class="w-24 py-2 bg-primary rounded-lg text-white">이전</button>

    <button
      @click="nextStep"
      :disabled="!isValidSelection"
      class="w-24 py-2 rounded-lg text-white"
      :class="{
        'bg-gray-400 cursor-not-allowed': !isValidSelection,
        'bg-primary hover:bg-primary-dark cursor-pointer': isValidSelection,
      }"
    >
      다음
    </button>
  </div>
</template>

<script>
import { instance } from '@/utils/axiosUtils';

export default {
  props: ['step', 'formData'],

  data() {
    return {
      constructionType: this.formData.constructionTypeIds || [], // 부모 컴포넌트에서 전달된 데이터로 초기화
      constructionTypes: [], // 서버에서 가져온 시공 종류를 저장할 배열
      selectAll: this.formData.selectAll || false, // 전체 선택 상태 초기화
    };
  },

  computed: {
    // 최소 한 개의 시공 종류가 선택되었는지 확인
    isValidSelection() {
      return this.constructionType.length > 0;
    },
  },

  watch: {
    constructionType: {
      handler(newVal) {
        // 모든 시공 종류가 선택되었을 때 '전체 선택'을 true로 설정
        this.selectAll = newVal.length === this.constructionTypes.length;
      },
      deep: true,
    },
  },

  methods: {
    async getConstructionTypes() {
      try {
        const response = await instance.get('/api/constructionType');
        this.constructionTypes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    toggleSelectAll() {
      if (this.selectAll) {
        this.constructionType = this.constructionTypes.map((type) => type.id); // 전체 선택 시 모든 시공 종류 선택
      } else {
        this.constructionType = []; // 전체 선택 해제 시 모든 선택 제거
      }
    },

    nextStep() {
      if (this.isValidSelection) {
        // 선택된 시공 종류 데이터를 부모 컴포넌트로 전달
        this.$emit('updateFormData', {
          constructionTypeIds: this.constructionType,
          selectAll: this.selectAll,
        });
        this.$emit('nextStep');
        this.$router.push('/requestEstimate/stepThree');
      }
    },

    prevStep() {
      this.$emit('prevStep');
      this.$router.push('/requestEstimate/stepOne');
    },
  },

  mounted() {
    this.getConstructionTypes(); // 컴포넌트가 마운트될 때 시공 종류 데이터 가져오기
  },
};
</script>

<style scoped>
.bg-primary {
  background-color: #0a3a5e; /* 활성화된 버튼 색상 */
}
.bg-primary-dark {
  background-color: #06263f; /* 활성화된 버튼 hover 색상 */
}
</style>
