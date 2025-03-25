<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ video?.title || 'Carregant...' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="video" class="video-container">
        <div class="video-player">
          <iframe
              :src="`${video.url}?autoplay=1`"
              frameborder="0"
              allowfullscreen
              title="YouTube video player"
              class="video-iframe"
          ></iframe>
        </div>
        <div class="video-details">
          <h1>{{ video.title }}</h1>
          <p class="description">{{ video.description }}</p>
          <p class="published-at">Publicat el {{ formatDate(video.published_at) }}</p>
        </div>
      </div>
      <div v-else class="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregant vídeo...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
  toastController
} from '@ionic/vue';
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const video = ref(null);

const fetchVideo = async () => {
  try {
    const response = await api.get(`/videos/${route.params.id}`);
    video.value = response.data.data;
  } catch (error) {
    console.error('Error carregant el vídeo:', error);
    const toast = await toastController.create({
      message: `Error carregant el video: ${error.response?.data?.message || 'Desconegut'}`,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(() => {
  fetchVideo();
});
</script>

<style scoped>
.video-container {
  max-width: 900px; /* Amplada més gran per al vídeo */
  margin: 0 auto;
  padding: 20px;
  background: var(--ion-background-color-step-50);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.video-container:hover {
  transform: translateY(-5px); /* Efecte d'elevació al passar-hi per sobre */
}

.video-player {
  position: relative;
  padding-top: 56.25%; /* Proporció 16:9 */
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

.video-container:hover .video-iframe {
  opacity: 0.95; /* Lleuger descoloriment al hover */
}

.video-details {
  padding: 20px;
  background: var(--ion-color-step-100);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.video-container:hover .video-details {
  background: var(--ion-color-step-150); /* Fons més clar al hover */
}

.video-details h1 {
  margin: 0 0 15px;
  font-size: 1.8rem;
  color: var(--ion-text-color);
  font-weight: 600;
  transition: color 0.3s ease;
}

.video-container:hover .video-details h1 {
  color: var(--ion-color-primary); /* Canvi de color al títol */
}

.description {
  margin: 0 0 15px;
  font-size: 1rem;
  color: var(--ion-color-medium);
  line-height: 1.6;
  transition: color 0.3s ease;
}

.video-container:hover .description {
  color: var(--ion-text-color); /* Text més fosc al hover */
}

.published-at {
  margin: 0;
  font-size: 0.9rem;
  color: var(--ion-color-medium-tint);
  font-style: italic;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--ion-color-medium);
}

.loading ion-spinner {
  margin-bottom: 10px;
  --color: var(--ion-color-primary);
}
</style>