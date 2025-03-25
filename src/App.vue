<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <!-- Secció d'informació de l'usuari -->
          <ion-list id="info-list" v-if="isLoggedIn">
            <ion-list-header>Benvingut</ion-list-header>
            <div class="user-info">
              <img :src="user.profile_photo_url" alt="Foto de perfil" class="profile-photo" />
              <div class="user-details">
                <ion-label>{{ user.name }}</ion-label>
                <ion-note>{{ user.email }}</ion-note>
              </div>
            </div>
          </ion-list>
          <!-- Pàgines generals -->
          <ion-list id="general-pages">
            <ion-list-header><h1>General</h1></ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="p in appPages" :key="p.url">
              <ion-item
                  router-direction="root"
                  :router-link="p.url"
                  lines="none"
                  :detail="false"
                  class="hydrated"
                  :class="{ selected: $route.path === p.url }"
              >
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <!-- Pàgines CRUD -->
          <ion-list id="crud-pages">
            <ion-list-header><h1>CRUD</h1></ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="p in currentCrudPages" :key="p.url">
              <ion-item
                  router-direction="root"
                  :router-link="p.url"
                  lines="none"
                  :detail="false"
                  class="hydrated"
                  :class="{ selected: $route.path === p.url }"
              >
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <!-- Pàgines d'autenticació -->
          <ion-list id="auth-pages">
            <ion-list-header><h1>Compte</h1></ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="p in currentAuthPages" :key="p.url">
              <ion-item
                  router-direction="root"
                  :router-link="p.url"
                  lines="none"
                  :detail="false"
                  class="hydrated"
                  :class="{ selected: $route.path === p.url }"
                  @click="p.action ? p.action() : null"
              >
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <div class="sidebar-footer">
            <ion-note>© {{ new Date().getFullYear() }} Gerard Moreno Campos</ion-note>
            <ion-item lines="none" href="https://github.com/gerardmoreno123" target="_blank">
              <ion-icon slot="start" :icon="logoGithub"></ion-icon>
              <ion-label>GitHub</ion-label>
            </ion-item>
          </div>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane, toastController,
} from '@ionic/vue';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  homeOutline,
  homeSharp,
  keyOutline,
  keySharp,
  personAddOutline,
  personAddSharp,
  personOutline,
  personSharp,
  logOutOutline,
  logOutSharp, logoGithub, videocamSharp, fileTrayFullSharp,
} from 'ionicons/icons';
import { useAuth } from '@/stores/auth';
import api from '@/services/api';

const router = useRouter();
const { isLoggedIn, logout } = useAuth();

// Dades de l'usuari
const user = ref({
  name: '',
  email: '',
  profile_photo_url: 'https://via.placeholder.com/50', // Placeholder inicial
});

const fetchUserProfile = async () => {
  if (isLoggedIn.value) {
    try {
      const response = await api.get('/profile');
      user.value = response.data.data;
    } catch (error) {
      console.error('Error carregant el perfil:', error);
      const toast = await toastController.create({
        message: `Error carregant el perfil: ${error.response?.data?.message || 'Desconegut'}`,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
};

onMounted(() => {
  fetchUserProfile();
});

function logout_action() {
  return () => {
    logout();
    router.push('/');
  };
}

const notLoggedInPages = [
  { title: 'Login', url: '/auth/login', iosIcon: keyOutline, mdIcon: keySharp },
  { title: 'Register', url: '/auth/register', iosIcon: personAddOutline, mdIcon: personAddSharp },
];

const loggedInPages = [
  { title: 'Perfil', url: '/profile', iosIcon: personOutline, mdIcon: personSharp },
  { title: 'Logout', url: '', iosIcon: logOutOutline, mdIcon: logOutSharp, action: logout_action() },
];

const crudPages = [
  { title: 'Videos Manager', url: '/videos/manage', iosIcon: videocamSharp, mdIcon: videocamSharp },
  { title: 'Multimedia Manager', url: '/multimedia/manage', iosIcon: fileTrayFullSharp, mdIcon: fileTrayFullSharp },
];

const currentAuthPages = computed(() => (isLoggedIn.value ? loggedInPages : notLoggedInPages));
const currentCrudPages = computed(() => (isLoggedIn.value ? crudPages : []));

const appPages = [
  { title: 'Explora', url: '/', iosIcon: homeOutline, mdIcon: homeSharp },
];
</script>

<style scoped>

ion-menu ion-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#auth-pages {
  border-bottom: none;
}

ion-menu.md ion-list#info-list {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
}

.profile-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.user-info:hover .profile-photo {
  transform: scale(1.1);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details ion-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--ion-text-color);
}

.user-details ion-note {
  font-size: 14px;
  color: var(--ion-color-medium-shade);
}

ion-menu.md ion-list-header {
  padding-left: 10px;
  font-size: 22px;
  font-weight: 600;
  min-height: 20px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 16px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list-header {
  padding-left: 16px;
  padding-right: 16px;
}

ion-item.selected {
  --color: var(--ion-color-primary);
}

.sidebar-footer {
  margin-top: auto;
  padding: 20px 10px;
  border-top: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

.sidebar-footer ion-note {
  font-size: 12px;
  color: var(--ion-color-medium-shade);
  display: block;
  margin-bottom: 10px;
}

.sidebar-footer ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --color: var(--ion-color-medium);
}

.sidebar-footer ion-icon {
  font-size: 20px;
  margin-right: 8px;
}

.sidebar-footer ion-label {
  font-size: 14px;
}
</style>