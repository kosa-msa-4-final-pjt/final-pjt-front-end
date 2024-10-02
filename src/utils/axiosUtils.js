import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
});

const authInstance = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터 설정 (선택 사항)
authInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    let accessToken = user?.accessToken;
    if (accessToken === null) {
      accessToken = '';
    }

    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(error);
    if (error.status == 500) {
      console.log('서버 예외');
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      console.log('이미 재요청 시도를 진행함');
      return Promise.reject(error);
    }

    if (originalRequest) console.log('액세스 토큰 만료 가능성 있음 ' + originalRequest);
    console.log(originalRequest);
    originalRequest._retry = true;
    try {
      console.log('재발급 요청');
      const res = await axios.post(
        process.env.VUE_APP_SERVER_URI + '/refreshToken',
        {},
        {
          withCredentials: true, // 쿠키로 refreshToken이 전송될 경우 필요
        }
      );
      const accessToken = res.data.data;
      setAccessToken(accessToken);

      originalRequest.Authorization = accessToken;

      console.log('발급 이후의 요청');
      console.log(originalRequest);

      return authInstance(originalRequest);
    } catch (refreshError) {
      console.log(refreshError);
      return Promise.reject(refreshError);
    }
  }
);

function setAccessToken(accessToken) {
  const user = JSON.parse(localStorage.getItem('user'));
  user.accessToken = accessToken == undefined ? '' : accessToken;
  localStorage.setItem('user', JSON.stringify(user));
}

export { instance, authInstance };
