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

<script>
export default {
  data() {
    return {
      isCameraOn: false,
      photos: [],
      permission: Notification.permission,
      isGranted: Notification.permission === "granted",
    };
  },
  mounted() {
    this.loadPhotos();
  },
  methods: {
    async startCamera() {
      try {
        this.$refs.video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
        this.isCameraOn = true;
        this.triggerNotification("Caméra démarrée");
      } catch (error) {
        alert("Impossible d'accéder à la caméra : " + error.message);
      }
    },
    async stopCamera() {
      const stream = this.$refs.video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        this.$refs.video.srcObject = null;
        this.isCameraOn = false;
        this.triggerNotification("Caméra arrêtée");
      }
    },
    capturePhoto() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoData = canvas.toDataURL("image/png");
      this.savePhoto(photoData);
      this.triggerNotification("Photo capturée !");
    },
    savePhoto(photoData) {
      this.photos.push(photoData);
      localStorage.setItem("photos", JSON.stringify(this.photos));
    },
    loadPhotos() {
      this.photos = JSON.parse(localStorage.getItem("photos") || "[]");
    },
    deletePhoto(index) {
      this.photos.splice(index, 1);
      localStorage.setItem("photos", JSON.stringify(this.photos));
    },
    requestPermission() {
      Notification.requestPermission().then(permission => {
        this.permission = permission;
        this.isGranted = permission === "granted";
      });
    },
    triggerNotification(title) {
      if (this.isGranted) {
        new Notification(title);
        this.vibrateDevice();
      } else {
        alert("Vous devez d'abord activer les notifications !");
      }
    },
    vibrateDevice() {
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }
};
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
