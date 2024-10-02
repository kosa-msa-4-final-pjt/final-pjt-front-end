<template>
  <div>안녕</div>
</template>

<script>
import authInstance from '@/utils/axiosUtils';

export default {
  setup() {
    const FAQList = async () => {
      try {
        const response = await authInstance.get('/api/faq/list');
        console.log(response);
      } catch (error) {
        console.log('FAQ 리스트를 가져오는 데 실패했습니다.');
      }
    };

    FAQList();

    return {};
  },
};
</script>

<style></style>
