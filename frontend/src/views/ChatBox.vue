<template>
  <!-- centers chatbox container (the container contains conversation + input)-->
  <div class="flex justify-center">
    <!-- mt-# is distance from top of screen, not navbar (since navbar is fixed, not sticky) -->
     <!-- chatbox container -->
    <div class="bg-gray-300 mt-24 p-4 rounded flex flex-col justify-between" style="width: 80vw; height: 80vh;">
        <!-- 1) messages (overflow-y-scroll to prevent messages from pushing down input) -->
        <div ref="chatContainer" class="flex flex-col overflow-auto">
          <div v-for="(message, index) in messages" :key="index" :class="[
            'p-3 mb-2 rounded-2xl max-w-2xl break-words',
            message.sender === 'bot' ? 'bg-red-500 text-white self-start' : 'bg-black text-white self-end',
            ]">
              {{ message.text }}
          </div>
        </div>
      <!-- 2) input -->
      <div class="flex justify-center border-gray-500 border-t-2"> <!-- replace as form, centers input-->
        <!-- mt is margin from top border of input -->
        <div class="flex flex-col w-8/12 p-2 rounded-md bg-gray-400 mt-3" method="GET">
            <input v-model="userInput" placeholder="Place an order or ask for other assistance" @keyup.enter="sendMessage" 
            class="p-2 rounded-md outline-none w-full placeholder-black bg-transparent" /> <!-- padding all around (p-#) -->
            <button @click="sendMessage" class="bg-black text-white px-5 py-2 rounded-2xl self-end"><img src="../assets/arrow-up-svgrepo-com.svg" class="w-4 h-4 stroke-white"></button>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
  import axios from 'axios';
  import { useAuth0 } from '@auth0/auth0-vue';

  
  export default {
    setup() {
      const auth0 = useAuth0();
      return {
        logout() {
          auth0.logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
        }
      };
    },
    data() {
      return {
        userInput: "",
        flag: "",
        messages: [
          { text: "Hello! How can I assist you today?", sender: "bot" }
        ],
        diagnostics: [],
        questions: [],
        formQ: [],
        len: "",
        iter: "0"
      };
    },
    methods: {

      async sendMessage() {

        if (!this.userInput.trim()) return;
  
        // Store user message

        console.log(this.userInput)
      
        this.messages.push({ text: this.userInput, sender: "user" });

        const url = "http://" + process.env.VUE_APP_HOST_IP + ":" + process.env.VUE_APP_HOST_PORT + "/api/query";
                

        const response = await axios.get(url, { 
          params: {
            userInput: this.userInput
          }
        });


        this.messages.push({ text: response.data.reply, sender: "bot" });
        console.log(response.data.order);
        // Save message to local file via backend API
  
        // Simulate bot response
        //run python script
        //when finished buf.json will have completed
        // call fetchMessages in order to see what buf.json says and provide input
        setTimeout(() => {
            this.userInput = "";


        }, 500);  


  
      }



    },
  };
  </script>