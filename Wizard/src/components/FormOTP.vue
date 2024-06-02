<template>
  <v-container v-if="getCodeValor" class="d-flex justify-center align-center fill-height">
    <v-sheet class="pa-10 ma-4" width="500" elevation="4" rounded="lg">
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" class="text-center">
          <span>Wizard_1.0</span>
        </v-col>
        <v-col cols="12" class="text-center">
          <span>Favor llenar los campos para acceder a la DEMO</span>
        </v-col>
      </v-row>
      <v-form ref="form" @submit.prevent="sendOTP">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="nombre" :rules="[rules.nombreRules, rules.apellidoRules]"
              label="Nombre"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="apellido" :rules="[rules.nombreRules, rules.apellidoRules]"
              label="Apellido"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field type="number" v-model="telefono" :rules="telefonoRules" maxlength="10"
              label="Telefono"></v-text-field>
          </v-col>
          <v-btn class="mt-2" color="primary" type="submit" block :loading="loading">Solicitar código</v-btn>
        </v-row>
      </v-form>
      <div v-if="showOTP">
        <v-container class="mt-5">
          <v-form ref="otpForm" @submit.prevent="verifyOTP">
            <v-row class="justify-center">
              <v-col cols="12" class="text-center">
                <p>El código tiene vigencia de 2 minutos</p>
              </v-col>
              <v-row class="justify-center">
                <v-col v-for="(code, index) in codes" :key="index" cols="2" class="text-center d-flex justify-center">
                  <v-text-field v-model="codes[index]" class="code-input" outlined maxlength="1" solo></v-text-field>
                </v-col>
              </v-row>
              <v-btn class="mt-2" color="primary" type="submit" block :loading="loading">Validar código</v-btn>
              <v-alert v-if="error" type="error" dismissible>
                {{ errorMessage }}
              </v-alert>
            </v-row>
          </v-form>
        </v-container>
      </div>
    </v-sheet>
  </v-container>

  <div v-else class="d-flex justify-center align-center fill-height">
    <Datos :nombre="nombre" :apellido="apellido" :telefono="telefono" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Datos from '../components/SegundaVentana';

export default {
  data() {
    return {
      datosLead: {},
      F_OTP: true,
      showOTP: false,
      codes: Array(6).fill(''),
      nombre: '',
      apellido: '',
      telefono: '',
      loading: false,
      error: false,
      errorMessage: '',
      rules: {
        nombreRules: value => value.length > 3 || 'El nombre debe tener al menos 3 caracteres.',
        apellidoRules: value => /[^0-9]/.test(value) || 'El apellido no puede contener dígitos.'
      },
      telefonoRules: [
        value => !!value || 'Teléfono es requerido.',
        value => /^\d{10}$/.test(value) || 'Teléfono debe tener 10 dígitos.'
      ],
    };
  },
  methods: {
    ...mapActions('OTP', ['enviarCodeOtp', 'verificarCodeOtp', 'guardarLead']),
    ...mapMutations('OTP',['setCodeOTP']),

    async sendOTP() {
      this.$refs.form.validate();
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      this.datosLead = {
        name: this.nombre,
        lastname: this.apellido,
        phone: this.telefono,
      };
      try {
        const aux = await this.enviarCodeOtp({ telefono: this.telefono });
        if (aux === true) {
          console.log("Código enviado exitosamente");
          this.showOTP = true;
        } else {
          this.error = true;
          this.errorMessage = 'Error al enviar el código. Intente nuevamente.';
        }
      } catch (error) {
        this.error = true;
        this.errorMessage = 'Error al enviar el código. Intente nuevamente.';
        console.error('Error al enviar el código OTP:', error);
      } finally {
        this.loading = false;
      }
    },

    async verifyOTP() {
      this.$refs.otpForm.validate();
      if (!this.$refs.otpForm.validate()) return;
      let codigo = this.codes.join('');
      if (codigo.length === 6) {
        this.loading = true;
        try {
          let res = await this.verificarCodeOtp({ code: codigo });
          console.log(res)
          if (res === true) {
            this.setCodeOTP(false);
            await this.guardarLead({ datos: this.datosLead });
          } else {
            this.error = true;
            this.errorMessage = 'Código no válido. Intente nuevamente.';
          }
        } catch (error) {
          this.error = true;
          this.errorMessage = 'Error al verificar el código. Intente nuevamente.';
          console.error('Error al verificar el código OTP:', error);
        } finally {
          this.loading = false;
        }
      } else {
        this.error = true;
        this.errorMessage = 'El código debe tener 6 dígitos.';
      }
    }
  },

  components: {
    Datos,
  },

  computed: {
        ...mapGetters('OTP', ['getCodeValor']),
    },
}
</script>

<style>
.code-input {
  width: 70px;
  height: auto;
  text-align: center;
}
</style>
