import { ref } from 'vue';

const isLoggedIn = ref(!!localStorage.getItem('token'));

export function useAuth() {
    const login = (token: string) => {
        localStorage.setItem('token', token);
        isLoggedIn.value = true;
    };

    const logout = () => {
        localStorage.removeItem('token');

        isLoggedIn.value = false;
    };

    return { isLoggedIn, login, logout };
}