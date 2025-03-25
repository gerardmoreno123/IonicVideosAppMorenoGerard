<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/multimedia/manage"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ arxiu.title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <ion-item lines="none">
            <ion-label>
              <h2>Títol: {{ arxiu.title }}</h2>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>
              <h3>Publicat el</h3>
              <p>{{ formatDate(arxiu.published_at) }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>
              <p>Publicat per: {{ arxiu.user?.name || 'Unknow' }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>
              <h3>Descripció</h3>
              <p>{{ arxiu.description || 'Sense descripció' }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>
              <h3>Ruta del fitxer</h3>
              <p>{{ arxiu.file_path }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>
              <h3>URL APP</h3>
              <ion-button color="primary" @click="router.push(`/multimedia/${arxiu.id}`)" expand="block" target="_blank">
                Veure arxiu multimedia
              </ion-button>
            </ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/vue';

const router = useRouter();
const route = useRoute();
const arxiu = ref({});

const fetchVideo = async () => {
  try {
    const response = await api.get(`/multimedia/manage/show/${route.params.id}`);
    console.log(response.data.data);
    arxiu.value = response.data.data;
  } catch (error) {
    console.error('Error carregant vídeo:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
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

ion-card-content {
  padding: 20px;
}

ion-item {
  --background: transparent;
  --color: #ffffff;
  margin-bottom: 15px;
}

ion-label h2,
ion-label h3 {
  color: #ffffff;
  margin-bottom: 5px;
}

ion-label p {
  color: #b3b3b3;
  margin: 0;
}

ion-button {
  --background: #007bff;
  --border-radius: 8px;
  --box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  text-transform: none;
  font-weight: 500;
}

ion-button:hover {
  --background: #0056b3;
}
</style>