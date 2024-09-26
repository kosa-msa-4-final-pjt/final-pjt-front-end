import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import 'quill/dist/quill.snow.css'; // Quill 스타일 추가

import VuePaginatePlugin from '@svifty7/vue-paginate';

import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

library.add(fas);
library.add(far);

const app = createApp(App);
const pinia = createPinia();
pinia.use(createPersistedState());

app.use(router);
app.use(pinia);
app.use(VuePaginatePlugin);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');

export { pinia };
