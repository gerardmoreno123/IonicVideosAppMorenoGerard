<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/multimedia/manage"></ion-back-button>
        </ion-buttons>
        <ion-title>Eliminar Vídeo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <p>Estàs segur que vols eliminar aquest vídeo?</p>
          <div class="confirmation-buttons">
            <ion-button color="danger" @click="confirmDelete">Sí, elimina</ion-button>
            <ion-button color="medium" @click="$router.push('/videos/manage')">Cancel·la</ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
} from '@ionic/vue';

const router = useRouter();
const route = useRoute();

const confirmDelete = async () => {
  try {
    await api.delete(`/multimedia/manage/destroy/${route.params.id}`);
    await router.push('/multimedia/manage');
  } catch (error) {
    console.error('Error eliminant vídeo:', error);
  }
};
</script>

<style scoped>
ion-content {
  --background: #1a1a1a;
  --color: #ffffff;
}

ion-toolbar {
  --background: #2a2a2a;
  --color: #ffffff;
}

ion-card {
  background: #252525;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  text-align: center;
}

ion-card-content p {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.confirmation-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

ion-button[color="danger"] {
  --background: #dc3545;
  --border-radius: 8px;
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-transform: none;
  font-weight: 500;
}

ion-button[color="danger"]:hover {
  --background: #b02a37;
}

ion-button[color="medium"] {
  --background: #6c757d;
  --border-radius: 8px;
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-transform: none;
  font-weight: 500;
}

ion-button[color="medium"]:hover {
  --background: #5a6268;
}
</style>