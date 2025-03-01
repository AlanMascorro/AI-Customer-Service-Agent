import { createRouter, createWebHistory } from 'vue-router';

import ChatBox from '../views/ChatBox.vue';
const routes = [
  { path: '/', component: ChatBox },


  { path: '/chatbox', component: ChatBox, meta: { requiresAuth: true } }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;