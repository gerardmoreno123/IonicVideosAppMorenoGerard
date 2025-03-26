<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Gestió de Vídeos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="videos-list">
        <div @click="router.push(`/videos/manage/show/${video.id}`)" v-for="video in videos" :key="video.id" class="video-card">
          <div class="video-info">
            <p class="video-id">#{{ video.id }}</p>
            <h3>{{ video.title }}</h3>
            <p class="video-date">{{ formatDate(video.published_at) }}</p>
          </div>
          <div class="video-actions">
            <ion-button size="small" color="primary" @click="editVideo(video.id)">Editar</ion-button>
            <ion-button size="small" color="danger" @click="deleteVideo(video.id)">Eliminar</ion-button>
          </div>
        </div>
      </div>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="success" @click="router.push('/videos/manage/create')">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { add } from 'ionicons/icons';
import api from '@/services/api';
import {onMounted, ref} from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { Video } from "@/types/interfaces";


const router = useRouter();
const videos = ref<Video[]>([]);

const fetchVideos = async () => {
  const response = await api.get('/videos/manage');
  videos.value = response.data.data;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const editVideo = (id: number) => {
  router.push(`/videos/manage/edit/${id}`);
};

const deleteVideo = (id: number) => {
  router.push(`/videos/manage/delete/${id}`);
};

onMounted(() => {
  fetchVideos();
});

onIonViewWillEnter(() => {
  fetchVideos();
});
</script>

<style scoped>
/* Estil general per a mode fosc */
ion-content {
  --background: #1a1a1a;
  --color: #ffffff;
}

ion-toolbar {
  --background: #2a2a2a;
  --color: #ffffff;
}

/* Llista de vídeos */
.videos-list {
  padding: 10px 0;
}

.video-card {
  background: #252525;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease;
}

.video-card:hover {
  transform: translateY(-3px);
}

.video-info {
  flex: 1;
}

.video-id {
  font-size: 0.8rem;
  color: #b3b3b3;
  margin: 0;
}

.video-info h3 {
  font-size: 1.2rem;
  color: #ffffff;
  margin: 5px 0;
  font-weight: 500;
}

.video-date {
  font-size: 0.9rem;
  color: #b3b3b3;
  margin: 0;
}

.video-actions {
  display: flex;
  gap: 10px;
}

ion-button[size="small"] {
  --padding-start: 10px;
  --padding-end: 10px;
  --border-radius: 6px;
  --box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-transform: none;
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

ion-button[color="primary"] {
  --background: #007bff;
}

ion-button[color="primary"]:hover {
  --background: #0056b3;
  transform: translateY(-1px);
}

ion-button[color="danger"] {
  --background: #dc3545;
}

ion-button[color="danger"]:hover {
  --background: #b02a37;
  transform: translateY(-1px);
}

/* Botó flotant Crear */
ion-fab-button {
  --background: #28a745;
  --border-radius: 50%;
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

ion-fab-button:hover {
  --background: #218838;
  transform: scale(1.1);
}

ion-icon {
  font-size: 24px;
}
</style>