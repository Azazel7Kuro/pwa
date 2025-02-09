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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";

export default defineComponent({
  setup() {
    const batteryLevel = ref<number>(100);
    const charging = ref<boolean>(false);

    const batteryColor = computed<string>(() => {
      if (batteryLevel.value > 50) return "green";
      if (batteryLevel.value > 20) return "orange";
      return "red";
    });

    const batteryClass = computed<Record<string, boolean>>(() => ({
      "low-battery": batteryLevel.value <= 20,
      "medium-battery": batteryLevel.value > 20 && batteryLevel.value <= 50,
      "high-battery": batteryLevel.value > 50,
    }));

    const getBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        batteryLevel.value = Math.round(battery.level * 100);
        charging.value = battery.charging;

        battery.addEventListener("levelchange", () => {
          batteryLevel.value = Math.round(battery.level * 100);
        });

        battery.addEventListener("chargingchange", () => {
          charging.value = battery.charging;
        });
      } else {
        console.warn("L'API Battery Status n'est pas supportée.");
      }
    };

    onMounted(() => {
      getBatteryStatus();
    });

    return {
      batteryLevel,
      charging,
      batteryColor,
      batteryClass,
    };
  },
});
</script>
