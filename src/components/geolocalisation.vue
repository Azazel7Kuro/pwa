<template>
  <div class="section">
    <button @click="getLocation">Obtenir ma position</button>
    <div v-if="location">
      <p><strong>Latitude :</strong> {{ location.latitude }}</p>
      <p><strong>Longitude :</strong> {{ location.longitude }}</p>
    </div>
    <p v-if="error" style="color: red;">Erreur : {{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const location = ref<{ latitude: number; longitude: number } | null>(null);
    const error = ref<string | null>(null);

    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              location.value = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              error.value = null;
            },
            (err) => {
              error.value = err.message;
            }
        );
      } else {
        error.value = "La géolocalisation n'est pas prise en charge par ce navigateur.";
      }
    };

    return {
      location,
      error,
      getLocation,
    };
  },
});
</script>
