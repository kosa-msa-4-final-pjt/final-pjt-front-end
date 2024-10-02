<template>
  <div>
    <div ref="quillEditor" class="quill-editor"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { instance } from '@/utils/axiosUtils';

export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      previousContent: '', // 이전 content 저장
      pendingImages: [], // 서버로 업로드할 이미지 리스트
    };
  },
  mounted() {
    this.quill = new Quill(this.$refs.quillEditor, {
      theme: 'snow',
      placeholder: this.placeholder,
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['image'], // 이미지 추가 버튼 포함
            ['clean'],
          ],
          handlers: {
            image: this.handleImageAdded, // 이미지 추가 핸들러 등록
          },
        },
      },
    });

    // 초기 모델 값 설정
    if (this.modelValue) {
      this.quill.root.innerHTML = this.modelValue;
    }

    // 내용 변경 감지
    this.quill.on('text-change', () => {
      const currentContent = this.quill.root.innerHTML;
      this.previousContent = currentContent;
      this.$emit('update:modelValue', currentContent);
    });
  },

  methods: {
    handleImageAdded() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          // Quill 에디터의 선택 범위 가져옴
          const range = this.quill.getSelection();

          // 선택 범위가 없을 경우 에디터 끝에 이미지를 삽입
          const base64Image = e.target.result;

          if (!range) {
            const length = this.quill.getLength();
            this.quill.insertEmbed(length - 1, 'image', base64Image);
          } else {
            this.quill.insertEmbed(range.index, 'image', base64Image);
          }

          // 파일과 삽입할 위치를 pendingImages 배열에 추가
          this.pendingImages.push({
            file,
            range: range ? { index: range.index, length: 1 } : { index: this.quill.getLength(), length: 0 },
            placeholder: e.target.result,
          });
        };

        reader.readAsDataURL(file);
      };
    },

    async uploadImages(portfolioId) {
      const uploadedUrls = [];
      let afterUpdate = this.quill.root.innerHTML;

      for (const { file, range, placeholder } of this.pendingImages) {
        const formData = new FormData();
        formData.append('file', file);
        console.log(range);
        try {
          const response = await instance.post(`/api/portfolio/${portfolioId}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const imageUrl = response.data;
          console.log(imageUrl);
          uploadedUrls.push(imageUrl);
          afterUpdate = afterUpdate.replace(placeholder, imageUrl);
          // Base64 이미지를 서버 URL로 교체
          //this.quill.deleteText(range.index, range.length);
          //this.quill.insertEmbed(range.index, 'image', imageUrl);
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }

      const updateResult = await new Promise((resolve, reject) =>
        this.$emit('insert-images', portfolioId, afterUpdate, resolve, reject)
      );
      console.log(updateResult);
      this.pendingImages = [];
    },
  },
};
</script>

<style scoped>
.quill-editor {
  max-height: 500px;
  overflow-y: auto;
  min-height: 300px;
  padding: 10px;
}
</style>
