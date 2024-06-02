<template>
  <v-app>
    <FormOTP />
    <Footer></Footer>
  </v-app>
</template>

<script>
  import FormOTP from '../components/FormOTP'
  import Footer from '@/components/footer.vue';
  export default {
    name: 'Home',

    components: {
      FormOTP,
      Footer,
    },
  }
</script>
