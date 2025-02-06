<template>
  <div class="web-otp-container">
    <h2>Validation par SMS</h2>
    <p v-if="!isSupported" class="warning">Votre navigateur ne supporte pas WebOTP.</p>
    <input
        type="text"
        v-model="otpCode"
        placeholder="Entrez votre code OTP"
        maxlength="6"
        class="otp-input"
    />
    <button @click="submitOtp" :disabled="!otpCode" class="submit-btn">Valider</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      otpCode: "",
      isSupported: "OTPCredential" in window,
    };
  },
  mounted() {
    if (this.isSupported) {
      this.readSmsCode();
    }
  },
  methods: {
    async readSmsCode() {
      try {
        const otp = await navigator.credentials.get({
          otp: { transport: ["sms"] },
        });
        if (otp && otp.code) {
          this.otpCode = otp.code;
        }
      } catch (error) {
        console.warn("WebOTP API non supportée ou refusée", error);
      }
    },
    submitOtp() {
      alert(`Code OTP soumis : ${this.otpCode}`);
      // Ici, tu peux envoyer le code au serveur pour vérification
    },
  },
};
</script>

<style scoped>
.web-otp-container {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  margin: auto;
}

h2 {
  color: #024d64;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.warning {
  color: darkred;
  font-weight: bold;
  margin-bottom: 10px;
}

.otp-input {
  width: 100%;
  padding: 10px;
  font-size: 1.2rem;
  text-align: center;
  border-radius: 6px;
  border: 2px solid #024d64;
  outline: none;
  margin-bottom: 10px;
}

.submit-btn {
  background: #024d64;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:disabled {
  background: gray;
  cursor: not-allowed;
}
</style>
