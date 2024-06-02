import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,

    state: {
        codeOtp:'',
        codeOtp2:true,
        dataRuc: [],
    },

    getters: {

        getCode(state) {
            return state.codeOtp;
        },

        getDataRuc(state) {
            return state.dataRuc;
        },

        getCodeValor(state){
            return state.codeOtp2;
        }
    },

    mutations: {

        capturarOTP(state, code) {
            state.codeOtp = code;
        },

        llenarDataRuc(state, data) {
            state.dataRuc = data;
        },

        setCodeOTP(state, valor){
            state.codeOtp2 = valor;

        }
    },

    actions: {
        enviarCodeOtp: async function ({ commit }, { telefono }) {
            try {
                const setting = {
                    mode: 'cors',
                    method: 'GET',
                };
                //const url = 'http://test.wanqara.com/api/send-code';
                //cambio el API para simular una respuesta 200, ya que los cors no me lo permiten
                const url = 'https://picsum.photos/v2/list?page=2&limit=5';
                const response = await fetch(url, setting);
                if (!response.ok) {
                    console.error('Error en la respuesta del servidor:', response.statusText);
                    return false;
                }
                try {
                    const json = await response.json();
                    if (json.ok !== undefined) {
                        if (json.ok) {
                            return true;
                        } else {
                            console.error('El servidor respondió con un error:', json);
                            return false;
                        }
                    } else {
                        return true;
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return false;
                }
            } catch (error) {
                console.error('Error enviando código OTP:', error);
                return false;
            }
        },


        verificarCodeOtp: async function ({ commit }, { code }) {
            try {
                const codeOTP = new FormData();
                codeOTP.append("code", code);
                const setting = {
                    method: 'POST',
                    body: codeOTP
                }
                const url = "https://test.wanqara.com/api/verify-code";
                const data = await fetch(url, setting);
                const res = await data.json();
                if (res.status) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Error al válidar código OTP:', error);
            }

        },

        informacionRuc: async function ({ commit }, { ruc }) {
            try {
                const codeOTP = new FormData();
                const setting = {
                    method: 'Get',
                }
                const url = `https://test.wanqara.com/api/ruc/${1234567890001}`;
                const data = await fetch(url, setting);
                const res = await data.json();
                commit('llenarDataRuc', res.data);
            } catch (error) {
                console.error('Error al válidar código OTP:', error);
            }
        },

        guardarLead: async function ({ commit }, { datos }) {
            try {
                const lead = new FormData();
                lead.append("name", datos.name);
                lead.append("lastname", datos.lastname);
                lead.append("phone", datos.phone);
                const setting = {
                    mode: 'no-cors',
                    method: 'POST',
                    body: lead
                }
                const url = "http://test.wanqara.com/api/lead";
                const data = await fetch(url, setting);
                const res = await data.json();
                if (res.ok) {
                    return true;
                } else {
                    return false;
                }

            } catch (error) {
                console.error("Error al guardar el lead:", error);
            }

        },

        ActualizarLead:async function (leadData) {
            try {
              const response = await fetch('http://test.illarli.com/api/lead', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
              });
          
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
          
              const data = await response.json();
              console.log('Lead actualizado exitosamente:', data);
          
              if (data.status) {
                // Lead actualizado correctamente
                return data;
              } else {
                // Manejar el caso cuando la respuesta no es exitosa
                throw new Error('Error en la actualización del lead: ' + data.message);
              }
            } catch (error) {
              console.error('Error al actualizar el lead:', error);
            }
          }
          

    },



}
