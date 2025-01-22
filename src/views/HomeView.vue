<template>
  <div id="app">
    <header class="navbar">
      <div class="logo">PWA de Azazel</div>
    </header>

    <main>
      <section id="camera" class="tool-section">
        <h2>Caméra</h2>
        <Camera />
      </section>
      <section id="geolocation" class="tool-section">
        <h2>Géolocalisation</h2>
        <Geolocation />
      </section>
    </main>
  </div>
</template>

<script>
import Geolocation from "@/components/geolocalisation.vue";
import Camera from "@/components/camera.vue";

export default {
  computed: {
    camera() {
      return Camera
    }
  },
  components: {
    Camera,
    Geolocation,
  },
};
</script>

<style src="@/assets/style.css"></style>