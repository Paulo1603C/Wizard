<template>
    <v-dialog v-model="localDialog" width="600">
        <v-card max-width="auto">
            <v-container class="d-flex justify-center align-center fill-height">
                <v-sheet class="pa-10 ma-4" width="500" elevation="4" rounded="lg">
                    <v-row class="d-flex justify-center align-center">
                        <v-col cols="12">
                            <img src="@/assets/logo1.png" alt="Logo" class="logo">
                        </v-col>
                        <v-col cols="12">
                            <h2>¡Te recordamos que tu DEMO ya fue creado!</h2>
                        </v-col>
                        <v-col cols="12">
                            <v-icon large color="success">mdi-check-circle</v-icon>
                        </v-col>
                        <v-col cols="12">
                            <p>
                                Las credenciales y link de acceso fueron enviadas a tu correo electrónico
                                <strong>{{ correo }}</strong>
                                también las podrás encontrar en tu Whatsapp, verifica el spam de tu correo
                                <br>
                                Si necesitas ayuda puedes comunicarte al número <strong>0999062424</strong>
                            </p>
                        </v-col>
                        <v-btn class="ms-auto" @click="closeDialog">Ok</v-btn>
                    </v-row>
                </v-sheet>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    name: 'DemoCreated',
    props: ['correo', 'dialog'],
    data() {
        return {
            localDialog: this.dialog,
        };
    },
    watch: {
        dialog(val) {
            this.localDialog = val;
        },
        localDialog(val) {
            this.$emit('update:dialog', val);
        }
    },
    methods: {

        ...mapMutations('OTP',['setCodeOTP']),

        closeDialog() {
            this.localDialog = false;
            this.$emit('closeDialog');
            this.setCodeOTP(true);
        },
    },
}
</script>

<style scoped>
.logo {
    width: 100px;
    margin: 0 auto 20px;
    display: block;
}
</style>