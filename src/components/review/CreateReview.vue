<template>
  <div class="w-full mx-auto">
    <p class="text-2xl font-semibold text-center pb-6">시공 후기 작성</p>

    <form
      @submit.prevent="insertReview"
      class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg"
    >
      <!-- 기본 리뷰 입력 -->
      <div class="mb-[12px]">
        <label for="title" class="block text-sm font-medium mb-2">제목</label>
        <input
          v-model="title"
          class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
      </div>

      <!-- 업체 정보 -->
      <div class="mb-[12px] flex items-center justify-between">
        <div class="w-[50%] pr-2">
          <label for="companyName" class="block text-sm font-medium mb-2">업체명</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="companyName"
              class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
              type="text"
              placeholder="업체명을 입력해주세요."
              readonly
            />
          </div>
        </div>

        <div class="w-[50%] pl-2">
          <label for="rating" class="block text-sm font-medium mb-2">별점</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model.number="rating"
              class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
              type="number"
              placeholder="별점을 입력해주세요."
              required
              min="1"
              max="5"
            />
          </div>
        </div>
      </div>

      <!-- 시공 기간 입력 -->
      <div class="flex justify-between items-center mb-[12px]">
        <div class="w-[50%] pr-2">
          <label for="startDate" class="block text-sm font-medium mb-2">시작날짜</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="startDate"
              @input="validateDates"
              class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
              type="date"
              required
            />
          </div>
        </div>

        <div class="w-[50%] pl-2">
          <label for="endDate" class="block text-sm font-medium mb-2">종료날짜</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="endDate"
              @input="validateDates"
              class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
              type="date"
              required
            />
          </div>
        </div>
      </div>

      <!-- 면적 및 시공 금액 입력 -->
      <div class="flex justify-between items-center mb-[12px]">
        <div class="w-[50%] pr-2">
          <label for="floor" class="block text-sm font-medium mb-2">면적</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model.number="floor"
              class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
              type="number"
              placeholder="시공 면적을 입력해주세요."
              readonly
              min="0"
            />
          </div>
        </div>

        <div class="w-[50%] pl-2">
          <label for="totalPrice" class="block text-sm font-medium mb-2">시공 금액</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model.number="totalPrice"
              class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
              type="number"
              placeholder="시공 금액을 입력해주세요."
              readonly
              min="0"
            />
          </div>
        </div>
      </div>

      <!-- 건물 종류 선택 -->
      <div class="mb-[12px]">
        <label for="buildingTypes" class="block text-sm font-medium mb-2">건물 종류</label>
        <div class="mt-2 flex flex-wrap gap-2">
          <div v-for="type in buildingTypes" :key="type.buildingTypeId" class="flex items-center">
            <input
              type="radio"
              :value="type.buildingTypeId"
              v-model="selectedBuildingType"
              name="buildingType"
              class="mr-2 accent-midGreen"
              disabled
            />
            <span class="text-[14px]">{{ type.buildingTypeName }}</span>
          </div>
        </div>
      </div>

      <!-- 시공 종류 선택 -->
      <div class="mb-[12px]">
        <label for="constructionTypes" class="block text-sm font-medium mb-2">시공 종류</label>
        <!-- 개별 시공 종류 체크박스 -->
        <div class="mt-2 flex flex-wrap gap-2">
          <div v-for="type in constructionTypes" :key="type.constructionId" class="flex items-center">
            <input
              type="checkbox"
              :value="type.constructionId"
              v-model="selectedConstructionTypes"
              class="mr-2 accent-midGreen"
              disabled
            />
            <span class="text-[14px]">{{ type.constructionName }}</span>
          </div>
        </div>
      </div>

      <!-- 내용 입력 -->
      <div class="mb-[12px]">
        <label for="content" class="block text-sm font-medium mb-2">내용</label>
        <QuillEditor ref="quillEditor" contentType="html" v-model:content="content" :options="editorOptions" />
      </div>

      <!-- 제출 버튼 -->
      <button class="bg-midGreen text-white w-full h-[52px] mx-auto rounded-[4px] text-[16px] mt-[24px]" type="submit">
        작성하기
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import { useRoute, useRouter } from 'vue-router';
import { authInstance } from '@/utils/axiosUtils';

export default {
  components: {
    QuillEditor,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 데이터 상태
    const requestId = ref(null);
    const title = ref('');
    const content = ref('');
    const imagesToUpload = ref([]);
    const editorOptions = ref({
      placeholder: '내용을 입력해주세요.',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'], // 토글 버튼
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
            ['clean'], // 서식 제거 버튼
          ],
          // 핸들러는 onMounted에서 설정
        },
      },
    });
    const companyName = ref('');
    const rating = ref('');
    const floor = ref('');
    const startDate = ref(new Date().toISOString().slice(0, 10));
    const endDate = ref('');
    const totalPrice = ref('');
    const buildingTypes = ref([]);
    const selectedBuildingType = ref('');
    const constructionTypes = ref([]);
    const selectedConstructionTypes = ref([]);

    // Quill 에디터 참조
    const quillEditor = ref(null);

    // 컴퓨팅된 속성
    const isAllSelected = computed(() => {
      return selectedConstructionTypes.value.length === constructionTypes.value.length;
    });

    // 메서드 정의
    const fetchRegisterPageData = async () => {
      try {
        const response1 = await authInstance.get(`/api/reviews?requestId=${requestId.value}`);
        const data = response1.data;
        console.log(data);

        constructionTypes.value = data.constructionTypeResponses;
        buildingTypes.value = data.buildingTypeResponses;

        const response2 = await authInstance.get(`/api/reviews/create?requestId=${requestId.value}`);
        const data2 = response2.data;
        console.log(data2);

        companyName.value = data2.companyName;
        floor.value = data2.floor;
        totalPrice.value = data2.totalPrice;

        // 건물 종류 선택 초기화
        selectedBuildingType.value = data2.buildingTypeResponses[0].buildingTypeId;

        // 시공 종류 선택 초기화
        selectedConstructionTypes.value = data2.constructionTypeResponses.map((type) => type.constructionId);
      } catch (error) {
        console.error('리뷰 생성 페이지 데이터를 가져오는데 실패했습니다.', error);
        alert('리뷰 생성 페이지를 불러오는데 실패했습니다.');
        router.push('/'); // 안전한 경로로 리디렉션
      }
    };

    const insertReview = async () => {
      const currentRequestId = requestId.value;

      if (!currentRequestId) {
        alert('유효하지 않은 요청 ID입니다.');
        return;
      }

      const reviewRequestData = {
        requestId: currentRequestId,
        title: title.value,
        companyName: companyName.value,
        rating: rating.value,
        floor: floor.value,
        workStartDate: startDate.value,
        workEndDate: endDate.value,
        totalPrice: totalPrice.value,
        buildingTypeId: selectedBuildingType.value,
        constructionTypes: selectedConstructionTypes.value,
        content: content.value,
      };

      try {
        const reviewResponse = await authInstance.post('/api/reviews', reviewRequestData);
        alert('후기가 작성되었습니다.');

        const reviewId = reviewResponse.data.reviewId;
        await uploadRemainContents(reviewId);
      } catch (error) {
        console.error('후기 작성에 실패하였습니다.', error);
        alert('후기 작성에 실패하였습니다.');
      }
    };

    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const editor = quillEditor.value.getQuill();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', e.target.result);

          imagesToUpload.value.push({ file, placeholder: e.target.result });
        };
        reader.readAsDataURL(file);
      };
    };

    const uploadRemainContents = async (reviewId) => {
      for (let image of imagesToUpload.value) {
        try {
          const formData = new FormData();
          formData.append('file', image.file);
          const imageUploadResponse = await authInstance.post(`/api/reviews/${reviewId}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const imageUrl = imageUploadResponse.data;
          content.value = content.value.replace(image.placeholder, imageUrl);
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }

      try {
        const response = await authInstance.patch(`/api/reviews/${reviewId}`, {
          content: content.value,
        });
        console.log('Final content:', content.value);

        const registerResult = response.data;
        if (registerResult) {
          alert('등록 성공!');
          router.push(`/reviews/${reviewId}`);
        }
      } catch (error) {
        console.error('Failed to update review content:', error);
      }
    };

    const validateDates = () => {
      if (startDate.value && endDate.value) {
        if (endDate.value < startDate.value) {
          startDate.value = '';
          endDate.value = '';
          alert(`종료 날짜는 시작 날짜보다 앞설 수 없습니다.\n날짜를 다시 입력해주세요.`);
        }
      }
    };

    const toggleAllConstructionTypes = () => {
      if (isAllSelected.value) {
        selectedConstructionTypes.value = [];
      } else {
        selectedConstructionTypes.value = constructionTypes.value.map((type) => type.constructionTypeId);
      }
    };

    // onMounted 훅
    onMounted(() => {
      requestId.value = route.query.requestId;
      if (!requestId.value) {
        alert('유효하지 않은 요청 ID입니다.');
        router.push('/'); // 안전한 경로로 리디렉션
        return;
      }

      fetchRegisterPageData();

      // Quill 에디터의 이미지 핸들러 설정
      if (quillEditor.value) {
        const quill = quillEditor.value.getQuill();
        quill.getModule('toolbar').handlers.image = imageHandler;
      }
    });

    return {
      // 상태
      title,
      content,
      imagesToUpload,
      editorOptions,
      companyName,
      rating,
      floor,
      startDate,
      endDate,
      totalPrice,
      buildingTypes,
      selectedBuildingType,
      constructionTypes,
      selectedConstructionTypes,
      isAllSelected,
      quillEditor,

      // 메서드
      insertReview,
      toggleAllConstructionTypes,
      validateDates,
    };
  },
};
</script>

<style scoped>
.custom-quill-editor {
  height: 300px;
}

.ql-container {
  height: 100%;
}

.ql-editor {
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
}
</style>
