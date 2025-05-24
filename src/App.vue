<template>
  <div class="pixel-love-container">
    <PixelLoveTimer />
  </div>
</template>

<script>
import PixelLoveTimer from './components/PixelLoveTimer.vue'
import RomanticDailyChallenge from './components/RomanticDailyChallenge.vue'
import photobooth from './components/photobooth.vue'
import lovenotes from './components/lovenotes.vue'

export default {
  name: 'App',
  components: {
    PixelLoveTimer,
    RomanticDailyChallenge,
    photobooth,
    lovenotes,
  },
  data() {
    return {
      isChallengeVisible: false,
    }
  },
  methods: {
    toggleChallengeVisibility() {
      this.isChallengeVisible = !this.isChallengeVisible
    },
  },
}
</script>

<style scoped>
:global(body) {
  margin: 0;
  padding: 0;
}

.pixel-love-container {
  font-family: 'Press Start 2P', cursive;
  background-color: #ffb6c1;
  background-image: linear-gradient(
    45deg,
    #ffb6c1 25%,
    #ffc0cb 25%,
    #ffc0cb 50%,
    #ffb6c1 50%,
    #ffb6c1 75%,
    #ffc0cb 75%,
    #ffc0cb 100%
  );
  background-size: 20px 20px;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.challenge-section {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
}

.challenge-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.pixel-button.challenge-btn {
  background-color: #ff1493;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s;
  width: 400px;
  height: 100px;
  font-size: 20px;
  font-family: 'Press Start 2P', cursive;
}

.pixel-button.challenge-btn:hover {
  transform: scale(1.05);
}

.daily-challenge-component {
  width: 100%;
}

/* Transisi slide-fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
