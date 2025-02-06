import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'


createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker enregistré avec succès :', registration);
            })
            .catch(error => {
                console.error('Erreur d’enregistrement du Service Worker :', error);
            });
    });
}

