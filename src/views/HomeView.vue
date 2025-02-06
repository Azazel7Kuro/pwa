<template>
  <div id="app">
    <div class="navbar">
      <h1 class="infos">PWA</h1>
      <div class="battery"><Battery /></div>
    </div>

    <div>
      <section id="camera" class="tool-section">
        <h2 class="title">🎬 CAMERA</h2>
        <Camera />
      </section>
      <div class="line_center">
      <div class="line"></div>
      </div>
      <section id="geolocation" class="tool-section">
        <h2 class="title">🌍 GEOLOCATION</h2>
        <Geolocation />
      </section>
      <div class="line_center">
        <div class="line"></div>
      </div>
      <section id="phone" class="tool-section">
        <h2 class="title">☎️ PHONE</h2>
        <Phone />
      </section>
      <div class="line_center">
        <div class="line"></div>
      </div>
      <section id="mdp" class="tool-section">
        <h2 class="title">✅ MOT DE PASSE</h2>
        <MdpVerification />
      </section>
      <div class="line_center">
        <div class="line"></div>
      </div>
      <section id="chat" class="tool-section">
        <h2 class="title">💭 CHAT</h2>
        <Chat />
      </section>
    </div>
  </div>
</template>

<script>
import Geolocation from "@/components/geolocalisation.vue";
import Camera from "@/components/camera.vue";
import Phone from "@/components/phone.vue";
import Battery from "@/components/batteryIndicator.vue";
import MdpVerification from "@/components/mdpVerification.vue";
import Chat from "@/components/chat.vue";

export default {
  components: {
    Camera,
    Geolocation,
    Phone,
    Battery,
    MdpVerification,
    Chat,
  },
};
</script>

<style src="@/assets/style.css"></style>