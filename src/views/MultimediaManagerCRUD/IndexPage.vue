<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Gestionar Multimèdia</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="multimedia-list">
        <div @click="router.push(`/multimedia/manage/show/${item.id}`)" v-for="item in multimedia" :key="item.id" class="multimedia-card">
          <div class="multimedia-info">
            <p class="multimedia-id">#{{ item.id }}</p>
            <h3>{{ item.title }}</h3>
            <p class="multimedia-type">{{ item.file_type === 'video' ? 'Vídeo' : 'Imatge' }}</p>
          </div>
          <div class="multimedia-actions">
            <ion-button size="small" color="primary" @click.stop="editMultimedia(item.id)">Editar</ion-button>
            <ion-button size="small" color="danger" @click.stop="deleteMultimedia(item.id)">Eliminar</ion-button>
          </div>
        </div>
      </div>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="success" @click="router.push('/multimedia/manage/create')">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { Multimedia } from "@/types/interfaces";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/vue';
import { add } from 'ionicons/icons';

const router = useRouter();
const multimedia = ref<Multimedia[]>([]);

const fetchMultimedia = async () => {
  try {
    const response = await api.get('/multimedia/manage');
    multimedia.value = response.data.data;
  } catch (error) {
    console.error('Error carregant multimèdia:', error);
  }
};

const editMultimedia = (id: number) => {
  router.push(`/multimedia/manage/edit/${id}`);
};

const deleteMultimedia = (id: number) => {
  router.push(`/multimedia/manage/delete/${id}`);
};

onMounted(() => {
  fetchMultimedia();
});

onIonViewWillEnter(() => {
  fetchMultimedia();
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

/* Llista de multimèdia */
.multimedia-list {
  padding: 10px 0;
}

.multimedia-card {
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

.multimedia-card:hover {
  transform: translateY(-3px);
}

.multimedia-info {
  flex: 1;
}

.multimedia-id {
  font-size: 0.8rem;
  color: #b3b3b3;
  margin: 0;
}

.multimedia-info h3 {
  font-size: 1.2rem;
  color: #ffffff;
  margin: 5px 0;
  font-weight: 500;
}

.multimedia-type {
  font-size: 0.9rem;
  color: #b3b3b3;
  margin: 0;
}

.multimedia-actions {
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