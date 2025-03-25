<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Explora</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Mostra un loading mentre es carreguen els ítems -->
      <div v-if="loading" class="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregant contingut...</p>
      </div>
      <!-- Mostra les targetes quan els ítems estiguin carregats -->
      <div v-else>
        <div
            v-for="(item, index) in shuffledItems"
            :key="item.id"
            class="media-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="navigateToItem(item)"
        >
          <div class="media-thumbnail">
            <img
                v-if="item.type === 'video'"
                :src="getThumbnailUrl(item.url)"
                :alt="item.title"
                class="thumbnail-image"
            />
            <img
                v-else-if="item.type === 'multimedia' && item.file_type === 'image'"
                :src="getMultimediaUrl(item.file_path)"
                :alt="item.title"
                class="thumbnail-image"
            />
            <video
                v-else-if="item.type === 'multimedia' && item.file_type === 'video'"
                :src="getMultimediaUrl(item.file_path)"
                class="thumbnail-video"
                muted
            ></video>
            <ion-icon :icon="playCircle" class="play-icon" v-if="item.type === 'video' || item.file_type === 'video'"></ion-icon>
          </div>
          <div class="media-info">
            <h2>{{ item.title }}</h2>
            <p class="description">{{ item.description }}</p>
            <p class="published-at">{{ formatDate(item.published_at) }}</p>
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
  toastController,
} from '@ionic/vue';
import { playCircle } from 'ionicons/icons';
import api from '@/services/api';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const videos = ref([]);
const multimedia = ref([]);
const loading = ref(true);

// Combina i barreja els ítems
const shuffledItems = computed(() => {
  const allItems = [
    ...videos.value.map(video => ({ ...video, type: 'video' })),
    ...multimedia.value.map(item => ({ ...item, type: 'multimedia' })),
  ];
  return shuffleArray(allItems);
});

const fetchContent = async () => {
  try {
    const [videosResponse, multimediaResponse] = await Promise.all([
      api.get('/videos'),
      api.get('/multimedia'),
    ]);
    videos.value = videosResponse.data.data;
    multimedia.value = multimediaResponse.data.data;
    console.log('Videos carregats:', videos.value);
    console.log('Multimèdia carregats:', multimedia.value);
  } catch (error) {
    console.error('Error carregant el contingut:', error);
    const toast = await toastController.create({
      message: `Error carregant el contingut: ${error.response?.data?.message || 'Desconegut'}`,
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  } finally {
    loading.value = false;
  }
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getThumbnailUrl = (url: string) => {
  const videoId = url.split('/embed/')[1]?.split('?')[0];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/480x360';
};

const getMultimediaUrl = (filePath: string) => {
  const baseUrl = 'http://localhost:8000'; // Ajusta segons el teu domini
  return `${baseUrl}/storage/${filePath}`;
};

const navigateToItem = (item) => {
  if (item.type === 'video') {
    router.push(`/video/${item.id}`);
  } else if (item.type === 'multimedia') {
    router.push(`/multimedia/manage/show/${item.id}`);
  }
};

onMounted(() => {
  fetchContent();
});
</script>

<style scoped>
.media-card {
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

.media-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.media-thumbnail {
  position: relative;
  padding-top: 56.25%; /* Proporció 16:9 */
}

.thumbnail-image, .thumbnail-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.media-card:hover .thumbnail-image,
.media-card:hover .thumbnail-video {
  opacity: 0.8;
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

.media-card:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

.media-info {
  padding: 15px;
  transition: background 0.3s ease;
}

.media-card:hover .media-info {
  background: var(--ion-color-step-100);
}

.media-info h2 {
  margin: 0 0 5px;
  font-size: 1.2rem;
  color: var(--ion-text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}

.media-card:hover .media-info h2 {
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