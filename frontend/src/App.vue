<template>
    <Navbar />
  <router-view />
</template>

<script>
import Navbar from "./components/NavBar.vue"; // import

export default {
  name: 'App',
  components: {
    Navbar // register
  }
};
</script>