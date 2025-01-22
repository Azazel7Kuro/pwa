<template>
  <div>
    <h3>Géolocalisation</h3>
    <p>Appuyez sur le bouton ci-dessous pour obtenir votre position actuelle :</p>
    <button @click="getLocation">Obtenir ma position</button>
    <div v-if="location">
      <p><strong>Latitude :</strong> {{ location.latitude }}</p>
      <p><strong>Longitude :</strong> {{ location.longitude }}</p>
    </div>
    <p v-if="error" style="color: red;">Erreur : {{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      location: null,
      error: null,
    };
  },
  methods: {
    getLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
              this.location = position.coords;
              this.error = null;
            },
            error => {
              this.error = error.message;
            }
        );
      } else {
        this.error = "La géolocalisation n'est pas prise en charge par ce navigateur.";
      }
    },
  },
};
</script>

