<template>
  <div class="section">
    <video ref="video" autoplay></video>
    <canvas ref="canvas" style="display: none;"></canvas>
    <br>
    <div class="triple_btn">
      <button @click="startCamera" :disabled="isCameraOn">Démarrer la caméra</button>
      <button @click="stopCamera" :disabled="!isCameraOn">Arrêter la caméra</button>
      <button @click="capturePhoto" :disabled="!isCameraOn">Prendre une photo</button>
    </div>

    <h4>Photos sauvegardées :</h4>
    <div class="photos">
      <div v-for="(photo, index) in photos" :key="index" class="photo-container">
        <img :src="photo" alt="Photo sauvegardée" />
        <button @click="deletePhoto(index)" class="delete-btn">🗑️</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  setup() {
    const isCameraOn = ref<boolean>(false);
    const photos = ref<string[]>([]);
    const video = ref<HTMLVideoElement | null>(null);
    const canvas = ref<HTMLCanvasElement | null>(null);
    const permission = ref<NotificationPermission>(Notification.permission);
    const isGranted = ref<boolean>(Notification.permission === "granted");

    const startCamera = async () => {
      try {
        if (video.value) {
          video.value.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
          isCameraOn.value = true;
          triggerNotification("Caméra démarrée");
        }
      } catch (error) {
        alert("Impossible d'accéder à la caméra : " + (error as Error).message);
      }
    };

    const stopCamera = () => {
      if (video.value && video.value.srcObject) {
        (video.value.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        video.value.srcObject = null;
        isCameraOn.value = false;
        triggerNotification("Caméra arrêtée");
      }
    };

    const capturePhoto = () => {
      if (video.value && canvas.value) {
        const ctx = canvas.value.getContext("2d");
        if (ctx) {
          canvas.value.width = video.value.videoWidth;
          canvas.value.height = video.value.videoHeight;
          ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
          const photoData = canvas.value.toDataURL("image/png");
          savePhoto(photoData);
          triggerNotification("Photo capturée !");
        }
      }
    };

    const savePhoto = (photoData: string) => {
      photos.value.push(photoData);
      localStorage.setItem("photos", JSON.stringify(photos.value));
    };

    const loadPhotos = () => {
      photos.value = JSON.parse(localStorage.getItem("photos") || "[]");
    };

    const deletePhoto = (index: number) => {
      photos.value.splice(index, 1);
      localStorage.setItem("photos", JSON.stringify(photos.value));
    };

    const requestPermission = () => {
      Notification.requestPermission().then(perm => {
        permission.value = perm;
        isGranted.value = perm === "granted";
      });
    };

    const triggerNotification = (title: string) => {
      if (isGranted.value) {
        new Notification(title);
        vibrateDevice();
      } else {
        alert("Vous devez d'abord activer les notifications !");
      }
    };

    const vibrateDevice = () => {
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    };

    onMounted(() => {
      loadPhotos();
    });

    return {
      isCameraOn,
      photos,
      video,
      canvas,
      permission,
      isGranted,
      startCamera,
      stopCamera,
      capturePhoto,
      deletePhoto,
      requestPermission,
    };
  },
});
</script>

<style scoped>
.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.photo-container {
  position: relative;
  display: inline-block;
}

.photo-container img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  text-align: center;
}
</style>
