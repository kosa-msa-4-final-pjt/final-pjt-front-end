<template>
  <div></div>
</template>

<script>
import { instance } from '@/utils/axiosUtils';
import Swal from 'sweetalert2';

export default {
  mounted() {
    const code = this.$route.query.code;
    const email = this.$route.query.email;

    const request = async () => {
      const response = await instance.post('/api/verify', {
        verificationCode: code,
        email: email,
      });

      if (response.data.code == 200) {
        Swal.fire({
          text: '인증이 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          confirmButtonColor: '#429f50',
        });
        this.$router.push('/login');
      }
    };

    request();
  },
};
</script>

<style></style>
