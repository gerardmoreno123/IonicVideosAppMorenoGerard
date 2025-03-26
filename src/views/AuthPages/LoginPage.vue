<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Iniciar Sessió</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="form-container">
        <ion-item class="form-item" :class="{ 'invalid': emailError }">
          <ion-icon :icon="mail" slot="start"></ion-icon>
          <ion-label class="form-item-title" position="floating">Email</ion-label>
          <ion-input v-model="email" type="email" @input="validateEmail" required></ion-input>
        </ion-item>
        <div v-if="emailError" class="error-message">Introdueix un email vàlid.</div>

        <ion-item class="form-item" :class="{ 'invalid': passwordError }">
          <ion-icon :icon="lockClosed" slot="start"></ion-icon>
          <ion-label class="form-item-title" position="floating">Contrasenya</ion-label>
          <ion-input v-model="password" type="password" @input="validatePassword" required></ion-input>
        </ion-item>
        <div v-if="passwordError" class="error-message">La contrasenya ha de tenir almenys 6 caràcters.</div>

        <ion-button expand="block" class="login-button" :disabled="formInvalid" @click="login">Iniciar Sessió</ion-button>
        <ion-button expand="block" color="light" class="register-button" @click="$router.push('/auth/register')">Registre</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { AxiosError } from "axios";
import { ref, computed } from 'vue';
import { useAuth } from '@/stores/auth';
import { toastController } from '@ionic/vue';
import { mail, lockClosed } from 'ionicons/icons';

const email = ref('');
const password = ref('');

const emailError = ref(false);
const passwordError = ref(false);

const router = useRouter();
const { login: authLogin } = useAuth();

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = !emailRegex.test(email.value);
};
const validatePassword = () => {
  passwordError.value = password.value.length < 6;
};

const formInvalid = computed(() => {
  return emailError.value || passwordError.value || !email.value || !password.value;
});

const login = async () => {
  if (formInvalid.value) return;

  try {
    const response = await api.post('/auth/login', { email: email.value, password: password.value });
    const { token } = response.data;
    authLogin(token);
    const toast = await toastController.create({
      message: 'Sessió iniciada amb èxit!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();
    await router.push('/');
  } catch (error) {
    const axiosError = error as AxiosError;
    const toast = await toastController.create({
      message: `Error en les credencials: ${axiosError.message || 'Desconegut'}`,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
};
</script>

<style scoped>
.form-container {
  max-width: 450px;
  margin: 0 auto;
  padding: 25px;
  background: var(--ion-background-color-step-50);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.form-item {
  margin-bottom: 20px;
  --background: var(--ion-background-color-step-100);
  --border-radius: 10px;
  --padding-start: 15px;
  --color: var(--ion-text-color);
  transition: border 0.3s ease;
}

.form-item-title {
  margin-bottom: 12px;
}

.form-item.invalid {
  --border-color: var(--ion-color-danger);
  --border-width: 2px;
}

.form-item:not(.invalid):focus-within {
  --border-color: var(--ion-color-primary);
  --border-width: 2px;
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 12px;
  margin-top: -15px;
  margin-bottom: 15px;
  padding-left: 15px;
}

.login-button {
  --background: linear-gradient(45deg, #3880ff, #3dc2ff);
  --border-radius: 10px;
  --box-shadow: 0 4px 10px rgba(56, 128, 255, 0.3);
  margin-top: 30px;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.login-button:hover {
  transform: scale(1.02);
}

.login-button:disabled {
  --background: var(--ion-color-medium);
  --box-shadow: none;
}

.register-button {
  --border-radius: 10px;
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
  --color: var(--ion-color-primary);
  transition: transform 0.2s ease;
}

.register-button:hover {
  transform: scale(1.02);
}

ion-icon {
  color: var(--ion-color-primary);
  font-size: 20px;
  margin-right: 10px;
  padding-top: 3px;
}
</style>