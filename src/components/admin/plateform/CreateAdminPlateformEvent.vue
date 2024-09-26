<template>
  <div class="w-full mx-auto px-6 py-8">
    <p class="text-2xl font-semibold text-center pb-6">공지사항 등록</p>

    <form
      @submit.prevent="insertPlateformEvent"
      class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg"
    >
      <div class="mb-6">
        <label for="title" class="block text-sm font-medium mb-2">멤버십명</label>
        <input
          v-model="title"
          class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
      </div>

      <div class="mb-6">
        <label for="content" class="block text-sm font-medium mb-2">내용</label>
        <QuillEditor ref="quillEditor" @insert-images="afterUploadImages" v-model:modelValue="content" required />
      </div>

      <!-- 버튼 공간 -->
      <div class="flex gap-12">
        <button
          class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          type="submit"
        >
          등록하기
        </button>
        <button
          class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          @click="this.$router.back()"
        >
          되돌아가기
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// import axios from 'axios';
// import { useUserStore } from '@/stores/userStore';
import QuillEditor from '@/components/common/QuillEditor.vue';

export default {
  components: { QuillEditor },
  data() {
    return {
      title: '',
      content: '',
      today: '',
    };
  },
  mounted() {
    const today = new Date().toISOString().split('T')[0];
    this.today = today;
  },
  methods: {
    //   async afterUploadImages(platformEventId, afterUpdateContent, resolve, reject) {
    //     console.log('이미지 삽입 후 내용');
    //     console.log(afterUpdateContent);
    //     const userStore = useUserStore();
    //     const token = userStore.accessToken;
    //     const platformEventrtfolioRequest = {
    //       title: this.title,
    //       content: afterUpdateContent,
    //     };
    //     try {
    //       const response = await axios.patch(`/api/platformEvent/${platformEventId}`, platformEventrtfolioRequest, {
    //         headers: {
    //           Authorization: token,
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       return resolve(response);
    //     } catch (error) {
    //       reject(error);
    //     }
    //   },
    //
    //   async insertPlateformEvent() {
    //     const userStore = useUserStore();
    //     const token = userStore.accessToken;
    //     const platformEventrtfolioRequest = {
    //       title: this.title,
    //       content: '대체 예정',
    //     };
    //     try {
    //       const response = await axios.post('/api/platformEvent/create', platformEventrtfolioRequest, {
    //         headers: {
    //           Authorization: token,
    //           'Content-Type': 'application/json',
    //         },
    //       });
    //       alert('공지사항이 작성되었습니다.');
    //       const platformEventId = response.data.id;
    //       console.log('이미지 저장 호출');
    //       await this.$refs.quillEditor.uploadImages(platformEventId);
    //       this.$router.push(`/platformEvent/${platformEventId}`);
    //     } catch (error) {
    //       console.error(error);
    //       alert('공지사항 작성에 실패하였습니다.');
    //     }
    //   },
  },
};
</script>

<style scoped>
.custom-quill-editor {
  height: 200px;
}

.ql-container {
  height: 100%;
}

.ql-editor {
  min-height: 150px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
