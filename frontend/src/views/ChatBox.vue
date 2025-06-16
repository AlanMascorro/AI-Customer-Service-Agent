<template>
  <!-- centers chatbox container (the container contains conversation + input)-->
  <div class="flex justify-center">
    <!-- mt-# is distance from top of screen, not navbar (since navbar is fixed, not sticky) -->
    <!-- chatbox container -->
    <div class="bg-gray-300 mt-24 p-4 rounded flex flex-col justify-between" style="width: 80vw; height: 80vh;">
        <!-- 1) messages (overflow-y-scroll to prevent messages from pushing down input) -->
        <div ref="chatContainer" class="flex flex-col overflow-auto whitespace-pre-line">
          <div v-for="(message, index) in messages" :key="index" :class="[
            'p-3 mb-2 rounded-2xl max-w-2xl break-words',
            message.sender === 'bot' ? 'bg-red-500 text-white self-start' : 'bg-black text-white self-end',
            ]">
              {{ message.text }}
          </div>
        </div>

      <!-- 2) input -->
      <div class="flex border-gray-500 border-t-2 bg-gray-300 h-32 items-center justify-evenly"> <!-- replace as form, centers input-->
        <button 
          ref="sendButton"
    @click="showTicket"
          @mouseenter="hoverIn" 
          @mouseleave="hoverOut" 
          :class="[
    'bg-white text-black rounded-md p-2 text-xs',
    isExpanded ? 'overflow-auto max-h-96' : 'w-20 h-16 overflow-hidden'
  ]">
              <!-- this re-renders everytime we send a message, so we have to overwrite order array -->
              <template v-if="isExpanded">
                <div class="overflow-auto max-h-[15vh] pr-2 hover:overflow-scroll">
            <div v-for="(item, index) in order" :key="index" >
              <div><strong>Qty: {{ item.quantity }}</strong> - <strong>{{ item.item }}</strong> -- <strong>${{ item.price }}</strong></div>
              <!-- list inside makes sure bullet point is close to the text -->
              <ul class="list-disc ml-4">
                <li>{{ item.size }}</li>
                <li>{{ item.instructions }}</li>
              </ul>
              <!-- <ul class="list-disc ml-4">
              </ul> -->
            </div>
            </div>
            </template>
            <div>
              <span class="text-xs font-bold">Order Total: ${{ orderTotal }}</span>
            </div>
        </button>
        <!-- mt is margin from top border of input -->
        <div class="flex flex-col w-8/12 p-2 rounded-md bg-gray-400" method="GET">
            <input v-model="userInput" placeholder="Place an order or ask for other assistance" @keyup.enter="sendMessage" 
            class="p-2 rounded-md outline-none w-full placeholder-black bg-transparent" /> <!-- padding all around (p-#) -->
            <button @click="sendMessage" class="bg-black text-white px-5 py-2 rounded-2xl self-end hover:bg-gray-300"><img src="../assets/arrow-up-svgrepo-com.svg" class="w-4 h-4 stroke-white"></button>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
  import axios from 'axios';
  import { useAuth0 } from '@auth0/auth0-vue';
  import { gsap } from "gsap";

  var centered = false;
 // var oldx;
 // var oldy;
  var tween;

  let urlClient = "https://" + process.env.VUE_APP_HOST_IP + "/api/client";
  //urlClient = "api/client";
  const serverClient = await axios.get(urlClient);
  console.log(serverClient.data.clientID);
  const clientID = serverClient.data.clientID;

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
        isExpanded: false,
        userInput: "",
        buttonText: "hello",
        flag: "",
        messages: [
          { text: "Hello! How can I assist you today?", sender: "bot" }
        ],
        diagnostics: [],
        questions: [],
        formQ: [],
        order: [],
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

        let url = "https://" + process.env.VUE_APP_HOST_IP + `/api/query/${clientID}`;
        //url = `api/query/${clientID}`;
        const response = await axios.get(url, { 
          params: {
            userInput: this.userInput
          }
        });


        this.messages.push({ text: response.data.reply, sender: "bot" });


        if (response.data.order != "STOPPED") {
          // clear the current order array to overwrite it
          // we do this so that the ticket will not display the following:
          // item1 ==> (action: add item) ==> item1, item1, item2
          // instead, display the following:
          // item ==> (action: add item) + (clear current order array) ==> item1, item2
          this.order = [];
          console.log("1");
          for (let key in response.data.order) {
          console.log("2");
            if (Object.prototype.hasOwnProperty.call(response.data.order, key)) {
          console.log("3");
              if (response.data.order[key] != null) {
          console.log("4");
                const orderItem = response.data.order[key];

                // print actual contents of object for debugging
                console.log("key: " + key + " value: " + JSON.stringify(response.data.order[key], null, 2));

                let totalPrice = 0.0;
                for (let i = 0; i < response.data.order[key].length; i++) {
                  // calculate total price based on quantity
                  let price = orderItem[i].price;
                  let quantity = orderItem[i].quantity;
                  if(!isNaN(price) && !isNaN(quantity)) {
                    totalPrice = parseFloat(orderItem[i].price) * parseInt(orderItem[i].quantity);  
                  }

                  // push new items into the cleared order array
                  this.order.push({
                    item: orderItem[i].item, // e.g., "club on a aub"
                    quantity: orderItem[i].quantity,
                    size: orderItem[i].size || "Regular", // if no size, like some drinks
                    price: totalPrice.toFixed(2), // ensures 2 decimal places + price of multiple quantities
                    instructions: orderItem[i].instructions || "No special instructions"
                  });
                }
              }
            }
          }
        }
        console.log(this.order);

        // Save message to local file via backend API
  
        // Simulate bot response
        //run python script
        //when finished buf.json will have completed
        // call fetchMessages in order to see what buf.json says and provide input
        setTimeout(() => {
            this.userInput = "";


        }, 500);  


  
      },
      showTicketbox(){
          const widget = this.$refs.sendButton;
          const centerX = window.innerWidth / 2 - widget.offsetWidth / 2;
       const centerY = window.innerHeight / 2 - widget.offsetHeight / 2;
          const rect = widget.getBoundingClientRect();
          const fromLeft = `${rect.left}px`;
          const fromTop = `${rect.top}px`;
          const initbox = gsap.timeline({paused: true});
          initbox.fromTo(widget, {left: fromLeft, top: fromTop, scale: .8},{
            scale: 5,
            duration: 1,
            left: centerX,
            top: centerY,
            ease: "power2.out",
            onReverseComplete: () => {
             console.log("Reverse complete!");
              centered = false;
            }
      });
        initbox.play();

      },
      hoverIn() {
        const widget = this.$refs.sendButton;

       
       if(!centered){
        gsap.to(widget, { scale: 1.9, duration: 0.3, ease: "power2.out" });
       }else{

          widget.style.overflowY = "auto";
    
    // You might need to adjust the max height to ensure there's content to scroll
    
    // Ensure the content area knows it should be scrollable
    widget.style.msOverflowStyle = "none";  // IE and Edge
    widget.style.scrollbarWidth = "none";
    const contentArea = widget.querySelector(".overflow-auto");
    if (contentArea) {
      contentArea.style.overflowY = "auto";
      contentArea.style.maxHeight = "15vh";  // Slightly smaller than parent to ensure room for the total\
      contentArea.style.msOverflowStyle = "none";  // IE and Edge
      contentArea.style.scrollbarWidth = "none";   // Firefox
    }

       }
      },
      hoverOut() {
        if (!centered){
        gsap.to(this.$refs.sendButton, { scale: 1.0, duration: 0.3, ease: "power2.out" });
        }
      },
      showTicket() {
        if (!centered){

        centered = true; 
        const widget = this.$refs.sendButton;
        //widget.classList.remove("self-end", "mr-10", "mb-5");
        const centerX = window.innerWidth / 2 - widget.offsetWidth / 2;
        const centerY = window.innerHeight / 2 - widget.offsetHeight / 2;
       
        const rect = widget.getBoundingClientRect();
        const fromLeft = `${rect.left}px`;
        const fromTop = `${rect.top}px`;

        tween = gsap.timeline({paused: true}); 
        tween.set(widget, { position: "fixed"}); 
        this.isExpanded = true;
        tween.fromTo(widget, {left: fromLeft, top: fromTop, scale: 1},{
            scale: 3,
            duration: 1,
            left: centerX,
            top: centerY/1.4,
            overflow: "auto",
            maxHeight: "15vh",
            ease: "power2.out",
            onComplete: () => {
              widget.style.overflowY = "auto";
            },
            onReverseComplete: () => {
             console.log("Reverse complete!");
              centered = false;
              this.isExpanded = false;
              //widget.classList.add("self-end", "mr-10", "mb-5");

            }
      });
        tween.play();
                console.log("new "+gsap.getProperty(widget, "left"));

              }else{
                tween.reverse();
              }

      }
    },
        computed: {
      orderTotal() {
        console.log("not working "+this.order.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2))
        return this.order.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
       

      }
    }
  };
  </script>

  <style>

.ticket {
  font-size: 10vw; /* will shrink/grow with viewport */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


button[ref="sendButton"]:hover.isExpanded {
  overflow-y: auto !important;
}

  </style>
