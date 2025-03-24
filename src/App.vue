<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="info-list" v-if="isLoggedIn">
            <ion-list-header>Inbox</ion-list-header>
            <ion-note>hi@ionicframework.com</ion-note>
          </ion-list>
          <ion-list id="general-pages">
            <ion-list-header><h1>General</h1></ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="p in appPages" :key="p.url">
              <ion-item router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: $route.path === p.url }">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
          <ion-list id="auth-pages">
            <ion-list-header><h1>Compte</h1></ion-list-header>
            <ion-menu-toggle :auto-hide="false" v-for="p in currentAuthPages" :key="p.url">
              <ion-item router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: $route.path === p.url }" @click="p.action ? p.action() : null">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
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
  IonSplitPane,
} from '@ionic/vue';
import { computed } from 'vue';
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
  logOutSharp,
} from 'ionicons/icons';
import { useAuth } from '@/stores/auth'; // Importem l'estat compartit

const router = useRouter();
const { isLoggedIn, logout } = useAuth(); // Desestructurem l'estat i la funció logout

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

const currentAuthPages = computed(() => (isLoggedIn.value ? loggedInPages : notLoggedInPages));

const appPages = [
  { title: 'Home', url: '/home', iosIcon: homeOutline, mdIcon: homeSharp },
];
</script>

<style scoped>
ion-menu ion-content {
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

ion-menu.md ion-note {
  margin-bottom: 30px;
  padding-left: 10px;
  display: inline-block;
  font-size: 16px;
  color: var(--ion-color-medium-shade);
}

ion-menu.md ion-list-header {
  padding-left: 10px;
}

ion-menu.md ion-list#info-list ion-list-header {
  font-size: 22px;
  font-weight: 600;
  min-height: 20px;
}

ion-menu.md ion-list#general-pages ion-list-header,
ion-menu.md ion-list#auth-pages ion-list-header {
  font-size: 22px;
  font-weight: 600;
  min-height: 20px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
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

ion-menu.ios ion-list#auth-pages {
  border-bottom: none;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 16px;
  color: var(--ion-color-medium-shade);
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
</style>