<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/multimedia/manage"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ multimedia?.title || 'Carregant...' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="multimedia" class="multimedia-container">
        <div class="multimedia-player">
          <video
              v-if="multimedia.file_type === 'video'"
              :src="mediaUrl"
              controls
              class="multimedia-content"
              @error="handleMediaError"
          ></video>
          <img
              v-else-if="multimedia.file_type === 'image'"
              :src="mediaUrl"
              :alt="multimedia.title"
              class="multimedia-content"
              @error="handleMediaError"
          />
        </div>
        <div class="multimedia-details">
          <h1>{{ multimedia.title }}</h1>
          <p class="description">{{ multimedia.description }}</p>
          <p class="published-at">Publicat el {{ formatDate(multimedia.published_at) }}</p>
        </div>
      </div>
      <div v-else class="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregant multimèdia...</p>
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
  toastController,
} from '@ionic/vue';
import api from '@/services/api';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const multimedia = ref(null);

// Compute the full URL dynamically
const mediaUrl = computed(() => {
  if (!multimedia.value?.file_path) return '';
  const baseUrl = "http://localhost:8000";
  return `${baseUrl}/storage/${multimedia.value.file_path}`;
});

const fetchMultimedia = async () => {
  try {
    const response = await api.get(`/multimedia/${route.params.id}`);
    multimedia.value = response.data.data;
  } catch (error) {
    console.error('Error carregant el multimèdia:', error);
    const toast = await toastController.create({
      message: `Error carregant el multimèdia: ${error.response?.data?.message || 'Desconegut'}`,
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

const handleMediaError = (event) => {
  console.error('Media failed to load:', {
    src: event.target.src,
    error: event.target.error || 'Unknown error',
  });
};

onMounted(() => {
  fetchMultimedia();
});
</script>

<style scoped>
.multimedia-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: var(--ion-background-color-step-50);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.multimedia-container:hover {
  transform: translateY(-5px);
}

.multimedia-player {
  position: relative;
  padding-top: 56.25%; /* Proporció 16:9 per a vídeos */
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.multimedia-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Per a imatges i vídeos */
  transition: opacity 0.3s ease;
}

.multimedia-container:hover .multimedia-content {
  opacity: 0.95;
}

.multimedia-details {
  padding: 20px;
  background: var(--ion-color-step-100);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.multimedia-container:hover .multimedia-details {
  background: var(--ion-color-step-150);
}

.multimedia-details h1 {
  margin: 0 0 15px;
  font-size: 1.8rem;
  color: var(--ion-text-color);
  font-weight: 600;
  transition: color 0.3s ease;
}

.multimedia-container:hover .multimedia-details h1 {
  color: var(--ion-color-primary);
}

.description {
  margin: 0 0 15px;
  font-size: 1rem;
  color: var(--ion-color-medium);
  line-height: 1.6;
  transition: color 0.3s ease;
}

.multimedia-container:hover .description {
  color: var(--ion-text-color);
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