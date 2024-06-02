<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <sms :dialog="showSms" :correo="correoElectronico" @closeDialog="showSms = false" />
    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">
            <img src="@/assets/logo1.png" alt="Logo" class="logo">
          </v-card-title>
          <v-card-subtitle>
            Ingrese el número de RUC de tu negocio para finalizar la configuración de tu DEMO.
          </v-card-subtitle>
          <v-card-text>
            <v-form ref="form">
              <v-text-field label="Ingresa tu número de RUC" v-model="ruc" append-icon="mdi-magnify"
                :rules="[rules.required]" @input="obtenerInformacion"></v-text-field>

              <v-container v-if="loading" class="d-flex justify-center">
                <v-progress-circular indeterminate></v-progress-circular>
              </v-container>

              <v-container v-if="showData">
                <v-text-field label="Razón Social" v-model="razonSocial" :rules="[rules.required]"
                  required></v-text-field>
                <v-text-field type="email" label="Correo electrónico" v-model="correoElectronico"
                  :rules="[rules.required, rules.email]" required></v-text-field>
                <v-select v-model="selectedCode" :items="subsidiaries" item-value="code" item-text="commercial_name"
                  label="Seleccione una sucursal" @change="actualizarCampos"></v-select>
                <v-text-field label="Dirección" v-model="selectedSubsidiary.address" readonly></v-text-field>
                <v-text-field label="Nombre Comercial" v-model="selectedSubsidiary.commercial_name"
                  readonly></v-text-field>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="crearDemo" width="100%">Crear Demo</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import sms from '../components/mensaje';

export default {
  props: ['nombre', 'apellido', 'telefono'],

  data() {
    return {
      ruc: '',
      showSms: false,
      showData: false,
      loading: false,
      razonSocial: '',
      subsidiaries: [],
      selectedCode: null,
      selectedSubsidiary: {
        commercial_name: '',
        address: '',
      },
      correoElectronico: '',
      rules: {
        required: value => !!value || 'Este campo es obligatorio',
        email: value => {
          const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Email inválido';
        },
      },
    };
  },
  methods: {
    ...mapActions('OTP', ['informacionRuc','ActualizarLead']),

    obtenerInformacion() {
      this.loading = true;
      this.informacionRuc({ ruc: this.ruc }).then(() => {
        this.showData = true;
        this.subsidiaries = this.getDataRuc.subsidiaries;
      }).finally(() => {
        this.loading = false;
      });
    },

    actualizarCampos() {
      const selected = this.subsidiaries.find(subsidiary => subsidiary.code === this.selectedCode);
      this.selectedSubsidiary = selected || { commercial_name: '', address: '' };
    },

    crearDemo:async function() {
      if (!this.$refs.form.validate()) return;
      const datosDemo = {
        name: this.nombre,
        lastname: this.apellido,
        phone: this.telefono,
        ruc: this.ruc,
        address: this.selectedSubsidiary.address,
        commercialname: this.selectedSubsidiary.commercial_name,
        businessname: this.razonSocial,
        code: this.selectedSubsidiary.code,
        email: this.correoElectronico
      };
      const a = await this.ActualizarLead({datos:datosDemo});
      this.showSms = true;
      console.log(datosDemo);
    }
  },
  computed: {
    ...mapGetters('OTP', ['getDataRuc']),
  },
  components: {
    sms,
  }
};
</script>

<style scoped>
.logo {
  width: 100px;
  margin: 0 auto;
  display: block;
}
</style>
