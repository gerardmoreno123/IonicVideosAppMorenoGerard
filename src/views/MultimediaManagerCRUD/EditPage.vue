<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/multimedia/manage"></ion-back-button>
        </ion-buttons>
        <ion-title>Editar Multimèdia</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-icon :icon="pencil" slot="start"></ion-icon>
            <ion-label position="floating">Títol</ion-label>
            <ion-input v-model="multimedia.title" placeholder="Introdueix el títol"></ion-input>
          </ion-item>

          <ion-item>
            <ion-icon :icon="chatbubbleEllipses" slot="start"></ion-icon>
            <ion-label position="floating">Descripció</ion-label>
            <ion-textarea v-model="multimedia.description" placeholder="Introdueix una descripció"></ion-textarea>
          </ion-item>

          <div class="filepond-container">
            <ion-label class="filepond-label">Fitxer Multimèdia</ion-label>
            <file-pond
                name="file"
                ref="pond"
                label-idle="Arrossega el teu fitxer aquí o <span class='filepond--label-action'>selecciona'l</span>"
                allow-drop="true"
                allow-browse="true"
                allow-multiple="false"
                accepted-file-types="video/mp4,video/mpeg,video/avi,video/mov,video/webm,video/mkv,image/jpeg,image/png,image/jpg"
                instant-upload="false"
                v-bind:files="myFiles"
                :server="filePondServer"
            />
          </div>
          <ion-button expand="block" color="success" @click="updateMultimedia">Actualitzar</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import { AxiosError} from "axios";
import { Pond, FilePondFile } from "@/types/interfaces";
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
import { pencil, chatbubbleEllipses } from 'ionicons/icons';
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

const router = useRouter();
const route = useRoute();
const pond = ref<Pond>({} as Pond);
const multimedia = ref({
  title: '',
  description: '',
});
const myFiles = ref<FilePondFile[]>([]);

const filePondServer = {
  load: async (source: string, load: (file: File | Blob) => void) => {
    try {
      const response = await fetch(source, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!response.ok) throw new Error('No es pot carregar el fitxer');

      const blob = await response.blob();
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
      const fileName = source.split('/').pop() || 'file';

      const file = new File([blob], fileName, { type: contentType });
      load(file);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error carregant el fitxer:', axiosError);
    }
  },
};

const fetchMultimedia = async () => {
  try {
    const response = await api.get(`/multimedia/manage/edit/${route.params.id}`);
    multimedia.value = {
      title: response.data.data.title,
      description: response.data.data.description || '',
    };
    if (response.data.data.file_path) {
      myFiles.value = [{
        source: response.data.data.file_path,
        options: { type: 'local' },
      }];
    }
  } catch (error) {
    console.error('Error carregant multimèdia:', error);
  }
};

const updateMultimedia = async () => {
  const formData = new FormData();
  formData.append('title', multimedia.value.title);
  formData.append('description', multimedia.value.description || '');
  formData.append('_method', 'PUT');

  const files = pond.value.getFiles();
  if (files.length) {
    const file = files[0].file;
    if (files[0].source !== myFiles.value[0]?.source) {
      console.log('Enviant fitxer nou:', file.name, file.type, file.size);
      formData.append('file', file, file.name);
    } else {
      console.log('No s\'ha canviat el fitxer, no s\'envia.');
    }
  }

  try {
    await api.post(`/multimedia/manage/update/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    await router.push('/multimedia/manage');
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error actualitzant multimèdia:', axiosError.message);
    throw error;
  }
};

onMounted(() => {
  fetchMultimedia();
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

ion-item {
  --background: #252525;
  --color: #ffffff;
  margin-bottom: 15px;
  --border-radius: 10px;
  --padding-start: 15px;
  transition: border 0.3s ease;
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

ion-button[color="success"]:disabled {
  --background: #6c757d;
  --box-shadow: none;
}

.filepond-container {
  margin-bottom: 15px;
}

.filepond-label {
  color: #b3b3b3;
  font-size: 1rem;
  margin-bottom: 8px;
  display: block;
}

:deep(.filepond--root) {
  background: #252525;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 10px;
}

:deep(.filepond--drop-label) {
  color: #b3b3b3;
  font-size: 1rem;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.filepond--label-action) {
  text-decoration: underline;
  color: #28a745;
  cursor: pointer;
  transition: color 0.3s ease;
}

:deep(.filepond--label-action:hover) {
  color: #218838;
}

:deep(.filepond--panel-root) {
  background: #2a2a2a;
  border: none;
}

:deep(.filepond--file) {
  background: #333333;
  border-radius: 6px;
  color: #ffffff;
  padding: 8px;
}

:deep(.filepond--file-action-button) {
  background: #dc3545;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

:deep(.filepond--file-action-button:hover) {
  transform: scale(1.1);
}
</style>