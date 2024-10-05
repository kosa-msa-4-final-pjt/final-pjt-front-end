<script>
import { useUserStore } from '@/stores/userStore';

export default {
  mounted() {
    const accessToken = this.$route.query.authorization;
    const nickName = decodeURIComponent(this.$route.query.nickName);
    const role = this.$route.query.role;

    const store = useUserStore();

    store.login(nickName, accessToken, role);

    this.$router.push('/');
  },

  methods: {
    decodeBase64(encodedString) {
      try {
        // Base64 디코딩
        const decodedString = atob(encodedString);
        return JSON.parse(decodedString);
      } catch (error) {
        console.error('Base64 디코딩 오류:', error);
        return null;
      }
    },

    getCookieValue(cookieString, cookieName) {
      const cookies = cookieString.split('; '); // 쿠키를 분리
      const targetCookie = cookies.find((cookie) => cookie.startsWith(cookieName + '=')); // 특정 쿠키 찾기

      if (targetCookie) {
        const encodedValue = targetCookie.split('=')[1]; // 값 부분 추출
        return JSON.parse(atob(encodedValue)); // Base64 디코딩 후 JSON으로 파싱
      }

      return null; // 쿠키가 없을 경우 null 반환
    },
  },
};
</script>
