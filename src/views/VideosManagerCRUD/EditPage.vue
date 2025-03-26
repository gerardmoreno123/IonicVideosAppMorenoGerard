<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/videos/manage"></ion-back-button>
        </ion-buttons>
        <ion-title>Editar Vídeo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Títol</ion-label>
            <ion-input v-model="video.title" placeholder="Introdueix el títol"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">URL</ion-label>
            <ion-input v-model="video.url" placeholder="Introdueix l'URL del vídeo"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Descripció</ion-label>
            <ion-textarea v-model="video.description" placeholder="Introdueix una descripció"></ion-textarea>
          </ion-item>
          <ion-button expand="block" color="primary" @click="updateVideo">Actualitzar</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import { Video } from '@/types/interfaces';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTitle,
  IonLabel,
  IonItem,
  IonInput,
  IonContent,
  IonTextarea,
  IonCard,
  IonCardContent,
} from '@ionic/vue';

const router = useRouter();
const route = useRoute();
const video = ref<Video>({} as Video);

const fetchVideo = async () => {
  try {
    const response = await api.get(`/videos/manage/edit/${route.params.id}`);
    video.value = response.data.data;
  } catch (error) {
    console.error('Error carregant vídeo:', error);
  }
};

const updateVideo = async () => {
  try {
    await api.put(`/videos/manage/update/${route.params.id}`, video.value);
    await router.push('/videos/manage');
  } catch (error) {
    console.error('Error actualitzant vídeo:', error);
  }
};

onMounted(() => {
  fetchVideo();
});
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
}

ion-item {
  --background: #252525;
  --color: #ffffff;
  margin-bottom: 15px;
}

ion-label {
  color: #b3b3b3;
}

ion-input, ion-textarea {
  --color: #ffffff;
}

ion-button[color="primary"] {
  --background: #007bff;
  --border-radius: 8px;
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-transform: none;
  font-weight: 500;
  margin-top: 20px;
}

ion-button[color="primary"]:hover {
  --background: #0056b3;
}
</style>