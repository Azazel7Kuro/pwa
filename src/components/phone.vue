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

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  setup() {
    const phoneNumber = ref<string>("");
    const canCall = ref<boolean>(false);

    const checkCallCapability = () => {
      canCall.value = "navigator" in window && "canShare" in navigator;
    };

    const makeCall = () => {
      if (canCall.value) {
        window.location.href = `tel:${phoneNumber.value}`;
      } else {
        alert("Votre appareil ne prend pas en charge les appels téléphoniques.");
      }
    };

    onMounted(() => {
      checkCallCapability();
    });

    return {
      phoneNumber,
      canCall,
      makeCall,
    };
  },
});
</script>
