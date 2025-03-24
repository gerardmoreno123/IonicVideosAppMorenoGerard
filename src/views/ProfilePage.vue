<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
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
        <!-- Secció dels vídeos -->
        <div class="videos-section">
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
          <p v-else class="no-videos">Encara no tens vídeos.</p>
        </div>
      </div>
      <div v-else class="error">
        <p>No s'ha pogut carregar el perfil. Si us plau, inicia sessió.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, IonIcon } from '@ionic/vue';
import { playCircle } from 'ionicons/icons';
import api from '@/services/api';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref(null);
const loading = ref(true);

const fetchProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data; // Accedim a 'data' de la resposta
    console.log('Perfil carregat:', user.value);
  } catch (error) {
    console.error('Error carregant el perfil:', error);
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
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/480x360';
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

.videos-section {
  padding: 20px;
  background: var(--ion-background-color-step-50);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.videos-section h2 {
  margin: 0 0 20px;
  font-size: 1.5rem;
  color: var(--ion-text-color);
}

.video-card {
  max-width: 100%;
  margin-bottom: 20px;
  background: var(--ion-background-color-step-100);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  padding-top: 56.25%;
}

.thumbnail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.video-card:hover .thumbnail-image {
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

.video-card:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

.video-info {
  padding: 15px;
}

.video-info h3 {
  margin: 0 0 5px;
  font-size: 1.1rem;
  color: var(--ion-text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}

.video-card:hover .video-info h3 {
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

.no-videos {
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