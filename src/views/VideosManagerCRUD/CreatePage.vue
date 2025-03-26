<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/videos/manage"></ion-back-button>
        </ion-buttons>
        <ion-title>Crear Vídeo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-icon :icon="pencil" slot="start"></ion-icon>
            <ion-label position="floating">Títol</ion-label>
            <ion-input v-model="video.title" placeholder="Introdueix el títol"></ion-input>
          </ion-item>
          <ion-item>
            <ion-icon :icon="chatbubbleEllipses" slot="start"></ion-icon>
            <ion-label position="floating">Descripció</ion-label>
            <ion-textarea v-model="video.description" placeholder="Introdueix una descripció"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-icon :icon="link" slot="start"></ion-icon>
            <ion-label position="floating">URL</ion-label>
            <ion-input v-model="video.url" placeholder="Introdueix l'URL del vídeo"></ion-input>
          </ion-item>
          <ion-button expand="block" color="success" @click="createVideo">Crear</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { VideoForm} from "@/types/interfaces";
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
  IonIcon,
} from '@ionic/vue';
import { pencil, chatbubbleEllipses, link } from 'ionicons/icons';

const router = useRouter();
const video = ref<VideoForm>({
  title: '',
  url: '',
  description: '',
});

const createVideo = async () => {
  try {
    await api.post('/videos/manage/create', video.value);
    resetForm();
    await router.push('/videos/manage');
  } catch (error) {
    console.error('Error creant vídeo:', error);
  }
};

const resetForm = () => {
  video.value = {
    title: '',
    url: '',
    description: '',
  };
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
}

ion-item {
  --background: #252525;
  --color: #ffffff;
  margin-bottom: 15px;
}

ion-label {
  color: #b3b3b3;
}

ion-input,
ion-textarea {
  margin-top: 12px;
  --color: #ffffff;
}

ion-icon {
  color: #b3b3b3;
  font-size: 20px;
  margin-right: 10px;
  margin-top: 24px;
  transition: color 0.2s ease;
}

ion-item:hover ion-icon {
  color: #ffffff;
}

ion-button[color="success"] {
  --background: #28a745;
  --border-radius: 8px;
  --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-transform: none;
  font-weight: 500;
  margin-top: 20px;
}

ion-button[color="success"]:hover {
  --background: #218838;
}

</style>