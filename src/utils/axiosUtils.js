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

    if (error.status == 500) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
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

      return authInstance(originalRequest);
    } catch (refreshError) {
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
