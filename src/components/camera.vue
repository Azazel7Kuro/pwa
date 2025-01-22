<template>
  <div>
    <video ref="video" autoplay></video>
    <canvas ref="canvas" style="display: none;"></canvas>
    <br>
    <button @click="startCamera" :disabled="isCameraOn">Démarrer la caméra</button>
      <button @click="stopCamera" :disabled="!isCameraOn">Arrêter la caméra</button>
    <button @click="capturePhoto" :disabled="!isCameraOn">Prendre une photo</button>

    <h4>Photos sauvegardées :</h4>
    <div class="photos">
      <img v-for="(photo, index) in photos" :key="index" :src="photo" alt="Photo sauvegardée" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCameraOn: false,
      photos: [], // Stockage local des photos
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
        this.$refs.video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
        this.isCameraOn = true;
      } catch (error) {
        alert("Impossible d'accéder à la caméra : " + error.message);
      }
      this.requestPermission();
      this.sendNotification("Caméra démarrée");
    },
    async stopCamera() {
      const stream = this.$refs.video.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());
      this.$refs.video.srcObject = null;
      this.isCameraOn = false;
      this.requestPermission();
      this.sendNotification("Caméra arrêtée");
    },
    capturePhoto() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;

      // Définir la taille du canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dessiner l'image vidéo sur le canvas
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir le contenu du canvas en Base64
      const photoData = canvas.toDataURL("image/png");

      // Sauvegarder la photo localement
      this.savePhoto(photoData);
    },
    savePhoto(photoData) {
      // Charger les photos existantes depuis LocalStorage
      const photos = JSON.parse(localStorage.getItem("photos") || "[]");

      // Ajouter la nouvelle photo
      photos.push(photoData);

      // Sauvegarder les photos mises à jour dans LocalStorage
      localStorage.setItem("photos", JSON.stringify(photos));

      // Mettre à jour l'état local pour afficher les photos
      this.photos = photos;
    },
    loadPhotos() {
      // Charger les photos depuis LocalStorage au montage du composant
      this.photos = JSON.parse(localStorage.getItem("photos") || "[]");
    },
    requestPermission() {
      Notification.requestPermission().then(permission => {
        this.permission = permission;
        this.isGranted = permission === "granted";
      });
    },
    sendNotification(title) {
      if (this.isGranted) {
        new Notification(title);
      } else {
        alert("Vous devez d'abord activer les notifications !");
      }
    },

  },
};
</script>
