<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Videos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Mostra un loading mentre es carreguen els vídeos -->
      <div v-if="loading" class="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregant vídeos...</p>
      </div>
      <!-- Mostra les targetes quan els vídeos estiguin carregats -->
      <div v-else>
        <div
            v-for="(video, index) in videos"
            :key="video.id"
            class="video-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="router.push(`/video/${video.id}`)"
        >
          <div class="video-thumbnail">
            <img :src="getThumbnailUrl(video.url)" alt="Video thumbnail" class="thumbnail-image" />
            <ion-icon :icon="playCircle" class="play-icon"></ion-icon>
          </div>
          <div class="video-info">
            <h2>{{ video.title }}</h2>
            <p class="description">{{ video.description }}</p>
            <p class="published-at">{{ formatDate(video.published_at) }}</p>
          </div>
        </div>
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
  IonMenuButton,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon,
  toastController
} from '@ionic/vue';
import { playCircle } from 'ionicons/icons';
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const videos = ref([] );
const loading = ref(true);

const fetchVideos = async () => {
  try {
    const response = await api.get('/videos');
    videos.value = response.data.data;
    console.log('Primer vídeo carregat:', videos.value[0]);
  } catch (error) {
    console.error('Error carregant els vídeos:', error);
    const toast = await toastController.create({
      message: `Error carregant els vídeos: ${error.response?.data?.message || 'Desconegut'}`,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Funció per extreure l'ID del vídeo i obtenir la URL de la thumbnail
const getThumbnailUrl = (url: string) => {
  const videoId = url.split('/embed/')[1]?.split('?')[0]; // Extreu l'ID (ex: CYXJYQZ3FX0)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/480x360'; // Fallback si falla
};

onMounted(() => {
  fetchVideos();
});
</script>

<style scoped>
.video-card {
  max-width: 600px;
  margin: 0 auto 20px;
  background: var(--ion-background-color-step-50);
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideIn 0.5s ease-out forwards;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.video-thumbnail {
  position: relative;
  padding-top: 56.25%; /* Proporció 16:9 */
}

.thumbnail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ajusta la imatge perquè ompli l'espai */
  transition: opacity 0.3s ease;
}

.video-card:hover .thumbnail-image {
  opacity: 0.8; /* Lleuger descoloriment al fer hover */
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s ease, opacity 0.3s ease;
  opacity: 0.7;
}

.video-card:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

.video-info {
  padding: 15px;
  transition: background 0.3s ease;
}

.video-card:hover .video-info {
  background: var(--ion-color-step-100);
}

.video-info h2 {
  margin: 0 0 5px;
  font-size: 1.2rem;
  color: var(--ion-text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}

.video-card:hover .video-info h2 {
  color: var(--ion-color-primary);
}

.description {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  line-height: 1.4;
}

.published-at {
  margin: 0;
  font-size: 0.8rem;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>