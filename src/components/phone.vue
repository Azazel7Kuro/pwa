<template>
  <div class="section">
    <h3>Passer un appel</h3>
    <input v-model="phoneNumber" type="tel" placeholder="Entrez un numéro" />
    <button v-if="canCall" @click="makeCall" :disabled="!phoneNumber">
      📞 Appeler
    </button>
    <p v-else style="color: darkred;">Votre appareil ne peut pas passer d'appels.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phoneNumber: "",
      canCall: false,
    };
  },
  mounted() {
    this.checkCallCapability();
  },
  methods: {
    checkCallCapability() {
      this.canCall = "navigator" in window && "canShare" in navigator; // Vérifie si l'appareil est compatible
    },
    makeCall() {
      if (this.canCall) {
        window.location.href = `tel:${this.phoneNumber}`;
      } else {
        alert("Votre appareil ne prend pas en charge les appels téléphoniques.");
      }
    },
  },
};
</script>
