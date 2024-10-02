<template>
  <h2 class="text-lg font-semibold my-10">인테리어할 건물을 선택해주세요.</h2>

  <!-- 개별 시공 종류 -->
  <div class="my-10">
    <div v-for="type in buildingTypes" :key="type.id" class="flex items-center my-5">
      <input type="radio" :value="type.id" v-model="buildingType" class="mr-2" />
      <p>{{ type.name }}</p>
    </div>
  </div>

  <!-- 평수 입력 필드 -->
  <div class="mt-2 my-5">
    <label for="floor" class="block my-2">평수를 입력해주세요</label>
    <input
      id="floor"
      type="number"
      v-model="floor"
      class="w-full p-2 border rounded mb-2"
      placeholder="숫자만 입력하세요."
      required
    />
    <p v-if="!isFloorValid && floor !== ''" class="text-red text-sm">평수는 1 이상이어야 합니다.</p>
  </div>

  <div class="mt-6">
    <button
      @click="nextStep"
      :disabled="!buildingType || !isFloorValid"
      class="w-full py-2 rounded-lg text-white"
      :class="{
        'bg-gray-400 cursor-not-allowed': !buildingType || !isFloorValid,
        'bg-primary hover:bg-primary-dark cursor-pointer': buildingType && isFloorValid,
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
      buildingType: this.formData.buildingTypeId || '', // 부모에서 받은 데이터로 초기화
      buildingTypes: [], // 서버에서 가져온 건물 유형을 저장할 배열
      floor: this.formData.floor || '', // 부모에서 받은 데이터로 초기화
    };
  },
  computed: {
    isFloorValid() {
      return this.floor && this.floor > 0; // 평수는 1 이상이어야 함
    },
  },
  methods: {
    async getBuildingTypes() {
      try {
        const response = await instance.get('/api/buildingType');
        this.buildingTypes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    nextStep() {
      if (this.buildingType && this.isFloorValid) {
        this.$emit('updateFormData', {
          buildingTypeId: this.buildingType,
          floor: this.floor,
        });
        this.$emit('nextStep');
        this.$router.push('/requestEstimate/stepTwo'); // 다음 스텝으로 이동
      }
    },
  },
  mounted() {
    this.getBuildingTypes(); // 컴포넌트가 마운트될 때 건물 유형 데이터 가져오기
  },
};
</script>

<style scoped>
.bg-primary {
  background-color: #0a3a5e;
}
.bg-primary-dark {
  background-color: #06263f;
}
div > div {
  transition: width 1s ease;
}
</style>
