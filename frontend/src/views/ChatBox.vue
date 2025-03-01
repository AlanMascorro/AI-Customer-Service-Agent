<template>
    <div class="flex h-screen">
      <div class="w-52 bg-gray-200 p-5 flex flex-col">
        <div class="mb-4">
          <h2 class="text-lg font-semibold">Welcome to Firehouse Subs</h2>
        </div>
      </div>
      <div class="flex-grow flex flex-col p-5">
        <div v-for="(message, index) in messages" :key="index" :class="[
          'p-3 mb-2 rounded-2xl max-w-2xl break-words',
          message.sender === 'bot' ? 'bg-red-500 text-white self-start' : 'bg-black text-white self-end',
        ]">
          {{ message.text }}
        </div>
        <div class="flex mt-auto border-t border-gray-300 pt-2">
          <input v-model="userInput" placeholder="Type a message..." @keyup.enter="sendMessage" class="flex-grow p-2 border border-gray-300 rounded-md mr-2 outline-none" />
          <button @click="sendMessage" class="bg-black text-white px-5 py-2 rounded-2xl">Send</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useAuth0 } from '@auth0/auth0-vue';
  import { toRaw } from 'vue';

  
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
     async fetchMessages() {
      try {


        if (this.flag == "x"){
           console.log("lots of progres")
           const response = await axios.get("http://localhost:3000/get-res");
           this.messages = response.data;
           this.questions = this.messages.map(msg => toRaw(msg));
           console.log(this.questions[1])
           let i = 0;
           while(i < this.questions.length){

             this.messages.push({ text: this.questions[i], sender: "bot" });

              i += 1;
            }
            this.flag = ""
            this.diagnostics = []
            this.questions = []
            this.formQ = []
            this.iter = "0"
        }else{
    
        this.flag = "r";

          if (this.iter == "0"){
           const response = await axios.get("http://localhost:3000/get-messages");
           this.messages = response.data;
           this.questions = this.messages.map(msg => toRaw(msg));
            this.len = parseInt(this.questions.length, 10);
        }
        let sub = Number(this.iter); 
         sub -= this.questions.length;
         console.log(sub);

        if (sub == -1 ){

            

            for (let i = 0; i < this.questions.length; i++) {
              if (i < this.questions.length) this.formQ.push(this.questions[i]);
              if (i == 0){ 
                i++;
                this.formQ.push(this.questions[i]);
              }
              if (i - 1 < this.diagnostics.length) this.formQ.push(this.diagnostics[i-1]);

           }



            this.flag = "x";
            await axios.post("http://localhost:3000/save-message", { message: this.userInput, type: this.formQ});
            setTimeout(async () => {
              await this.fetchMessages();
            }, 100);  

        }else{ 
        
        console.log(this.questions[0])

          let inter = parseInt(this.iter, 10)
          inter += 1;
          this.iter = inter;


          this.messages.push({ text: this.questions[inter], sender: "bot" });
        console.log("wingo")
     }
       console.log("ended");


   }
      } catch (error) {
        console.error("Error fetching messages:", error);
    }
  },

      async sendMessage() {

                    console.log("msg!")

        if (!this.userInput.trim()) return;
  
        // Store user message

          console.log("WOWZA"+this.userInput)
      
        this.messages.push({ text: this.userInput, sender: "user" });

        
        
                    console.log("boing!")
        if (this.flag == "x"){

            console.log("nice going")
        }else if (this.flag == "r"){

            this.diagnostics.push(this.userInput);
            console.log(this.diagnostics+ "yes its true ");

        }else if (this.flag == ""){

                    await axios.post("http://localhost:3000/save-message", { message: this.userInput, type: "script"});


        }
        // Save message to local file via backend API
  
        // Simulate bot response
        //run python script
        //when finished buf.json will have completed
        // call fetchMessages in order to see what buf.json says and provide input
        setTimeout(() => {
            this.userInput = "";


        }, 500);  


        setTimeout(async () => {
          await this.fetchMessages();
        }, 100);      

  
      }



    },
  };
  </script>