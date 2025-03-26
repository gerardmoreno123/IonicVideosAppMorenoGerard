// src/types/interfaces.ts
export interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url: string;
    videos: Video[];
    multimedia: Multimedia[];
}

export interface VideoForm {
    title: string;
    description: string;
    url: string;
}

export interface Video {
    id: number;
    title: string;
    description: string;
    url: string;
    published_at: string;
    user: User;
}

export interface Arxiu {
    id: number;
    title: string;
    description: string;
    file_path: string;
    file_type: 'image' | 'video';
    published_at: string;
    user: User
}

export interface Multimedia {
    id: number;
    title: string;
    description: string;
    file_path: string;
    file_type: 'image' | 'video';
    published_at: string;
}

export interface FilePondFile {
    source: string;
    options: {
        type: 'local' | 'limbo' | 'remote'; // Tipos válidos según FilePond
    };
}

export interface Pond {
    getFiles: () => any;
    removeFiles: () => void;
}

// Para HomePage.vue
export interface MediaItem {
    id: number;
    title: string;
    description: string;
    published_at: string;
    type: 'video' | 'multimedia';
    url?: string;
    file_path?: string;
    file_type?: 'image' | 'video';
}

// Para App.vue
export interface AuthPage {
    title: string;
    url: string;
    iosIcon: string;
    mdIcon: string;
    action?: () => void;
}