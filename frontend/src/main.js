import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js';  // Ensure you are importing the router
import  './index.css'



import { createAuth0 } from '@auth0/auth0-vue';
const app = createApp(App);

app.use(
  createAuth0({
    domain: "dev-qug84gqbi343u542.us.auth0.com",
    clientId: "pfjIj0QDI640Q7M2sE2bL8hwLiY4lnNF",
    authorizationParams: {
      redirect_uri: window.location.origin + '/chatbox',
    }
  })
);
app.use(router);
app.mount('#app');
