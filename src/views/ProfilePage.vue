<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="loading" class="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Carregant perfil...</p>
      </div>
      <div v-else-if="user" class="profile-container">
        <!-- Secció del perfil -->
        <div class="profile-header">
          <img :src="user.profile_photo_url" alt="Foto de perfil" class="profile-photo" />
          <h1>{{ user.name }}</h1>
          <p class="email">{{ user.email }}</p>
        </div>

        <!-- Secció de tabs -->
        <div class="media-section">
          <ion-segment v-model="activeTab" class="media-tabs">
            <ion-segment-button value="videos">
              <ion-label>Vídeos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="multimedia">
              <ion-label>Multimèdia</ion-label>
            </ion-segment-button>
          </ion-segment>

          <!-- Contingut dels vídeos -->
          <div v-if="activeTab === 'videos'" class="tab-content">
            <h2>Els meus vídeos</h2>
            <div v-if="user.videos.length > 0" class="videos-list">
              <div
                  v-for="(video, index) in user.videos"
                  :key="video.id"
                  class="video-card"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                  @click="$router.push(`/video/${video.id}`)"
              >
                <div class="video-thumbnail">
                  <img :src="getThumbnailUrl(video.url)" alt="Video thumbnail" class="thumbnail-image" />
                  <ion-icon :icon="playCircle" class="play-icon"></ion-icon>
                </div>
                <div class="video-info">
                  <h3>{{ video.title }}</h3>
                  <p class="description">{{ video.description }}</p>
                  <p class="published-at">{{ formatDate(video.published_at) }}</p>
                </div>
              </div>
            </div>
            <p v-else class="no-content">Encara no tens vídeos.</p>
          </div>

          <!-- Contingut dels multimèdia -->
          <div v-if="activeTab === 'multimedia'" class="tab-content">
            <h2>Els meus arxius multimèdia</h2>
            <div v-if="user.multimedia.length > 0" class="multimedia-list">
              <div
                  v-for="(item, index) in user.multimedia"
                  :key="item.id"
                  class="multimedia-card"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                  @click="$router.push(`/multimedia/${item.id}`)"
              >
                <div class="multimedia-thumbnail">
                  <img
                      v-if="item.file_type === 'image'"
                      :src="getMultimediaUrl(item.file_path)"
                      :alt="item.title"
                      class="thumbnail-image"
                  />
                  <video
                      v-else-if="item.file_type === 'video'"
                      :src="getMultimediaUrl(item.file_path)"
                      class="thumbnail-video"
                      muted
                  ></video>
                  <ion-icon :icon="playCircle" v-if="item.file_type === 'video'" class="play-icon"></ion-icon>
                </div>
                <div class="multimedia-info">
                  <h3>{{ item.title }}</h3>
                  <p class="description">{{ item.description }}</p>
                  <p class="published-at">{{ formatDate(item.published_at) }}</p>
                </div>
              </div>
            </div>
            <p v-else class="no-content">Encara no tens arxius multimèdia.</p>
          </div>
        </div>
      </div>
      <div v-else class="error">
        <p>No s'ha pogut carregar el perfil. Si us plau, inicia sessió.</p>
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
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  toastController,
} from '@ionic/vue';
import { playCircle } from 'ionicons/icons';
import api from '@/services/api';
import { AxiosError } from "axios";
import { ref, onMounted } from 'vue';
import { User } from '@/types/interfaces';

const user = ref<User | null>(null);
const loading = ref(true);
const activeTab = ref('videos'); // Tab actiu per defecte

const fetchProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error carregant el perfil:', axiosError);
    const toast = await toastController.create({
      message: `Error carregant el perfil: ${axiosError?.message || 'Desconegut'}`,
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

const getThumbnailUrl = (url: string) => {
  const videoId = url.split('/embed/')[1]?.split('?')[0];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const getMultimediaUrl = (filePath: string) => {
  const baseUrl = 'http://localhost:8000';
  return `${baseUrl}/storage/${filePath}`;
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  padding: 20px;
  background: var(--ion-background-color-step-50);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  transition: transform 0.3s ease;
}

.profile-header:hover {
  transform: translateY(-5px);
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.profile-header:hover .profile-photo {
  transform: scale(1.05);
}

.profile-header h1 {
  margin: 0 0 10px;
  font-size: 1.8rem;
  color: var(--ion-text-color);
  font-weight: 600;
}

.email {
  margin: 0;
  font-size: 1rem;
  color: var(--ion-color-medium);
}

.media-section {
  padding: 20px;
  background: var(--ion-background-color-step-50);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.media-tabs {
  margin-bottom: 20px;
}

.tab-content h2 {
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: var(--ion-text-color);
}

.videos-list, .multimedia-list {
  display: grid;
  gap: 20px;
}

.video-card, .multimedia-card {
  background: var(--ion-background-color-step-100);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideIn 0.5s ease-out forwards;
  cursor: pointer;
}

.video-card:hover, .multimedia-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.video-thumbnail, .multimedia-thumbnail {
  position: relative;
  padding-top: 56.25%; /* 16:9 aspect ratio */
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

.video-card:hover .thumbnail-image, .multimedia-card:hover .thumbnail-image,
.video-card:hover .thumbnail-video, .multimedia-card:hover .thumbnail-video {
  opacity: 0.8;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s ease, opacity 0.3s ease;
  opacity: 0.7;
}

.video-card:hover .play-icon, .multimedia-card:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

.video-info, .multimedia-info {
  padding: 15px;
}

.video-info h3, .multimedia-info h3 {
  margin: 0 0 5px;
  font-size: 1.1rem;
  color: var(--ion-text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}

.video-card:hover .video-info h3, .multimedia-card:hover .multimedia-info h3 {
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

.no-content {
  text-align: center;
  font-size: 1rem;
  color: var(--ion-color-medium);
}

.loading, .error {
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