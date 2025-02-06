<template>
  <div class="battery-indicator">
    <span :class="batteryClass">
      <span v-if="charging">⚡</span> {{ batteryLevel }}%
    </span>
    <div class="battery-container">
      <div class="battery-level" :style="{ width: batteryLevel + '%', backgroundColor: batteryColor }"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      batteryLevel: 100,
      charging: false,
    };
  },
  computed: {
    batteryColor() {
      if (this.batteryLevel > 50) return "green";
      if (this.batteryLevel > 20) return "orange";
      return "red";
    },
    batteryClass() {
      return {
        "low-battery": this.batteryLevel <= 20,
        "medium-battery": this.batteryLevel > 20 && this.batteryLevel <= 50,
        "high-battery": this.batteryLevel > 50,
      };
    },
  },
  methods: {
    async getBatteryStatus() {
      if ("getBattery" in navigator) {
        const battery = await navigator.getBattery();
        this.batteryLevel = Math.round(battery.level * 100);
        this.charging = battery.charging;

        battery.addEventListener("levelchange", () => {
          this.batteryLevel = Math.round(battery.level * 100);
        });

        battery.addEventListener("chargingchange", () => {
          this.charging = battery.charging;
        });
      } else {
        console.warn("L'API Battery Status n'est pas supportée.");
      }
    },
  },
  mounted() {
    this.getBatteryStatus();
  },
};
</script>