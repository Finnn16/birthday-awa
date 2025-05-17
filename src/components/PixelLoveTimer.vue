<template>
  <div class="pixel-love-timer">
    <div class="timer-container">
      <div class="pixel-heart"></div>
      <h1 class="pixel-title">Countdown to Special Day</h1>

      <div class="timer-display">
        <div class="timer-unit">
          <div class="timer-value">{{ days }}</div>
          <div class="timer-label">DAYS</div>
        </div>
        <div class="timer-unit">
          <div class="timer-value">{{ hours }}</div>
          <div class="timer-label">HOURS</div>
        </div>
        <div class="timer-unit">
          <div class="timer-value">{{ minutes }}</div>
          <div class="timer-label">MINUTES</div>
        </div>
        <div class="timer-unit">
          <div class="timer-value">{{ seconds }}</div>
          <div class="timer-label">SECONDS</div>
        </div>
      </div>

      <div class="message-box">
        <p class="pixel-message">{{ message }}</p>

        <!-- Link opsional, bisa dihapus kalau gak perlu -->
        <div v-if="isSpecialDay" class="home-link-container">
          <a href="/" class="home-link">
            <span class="pixel-arrow">→</span> Go to Main Page <span class="pixel-arrow">←</span>
          </a>
        </div>
      </div>

      <div class="pixel-hearts-container">
        <div class="small-heart heart1"></div>
        <div class="small-heart heart2"></div>
        <div class="small-heart heart3"></div>
        <div class="small-heart heart4"></div>
        <div class="small-heart heart5"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PixelLoveTimer',
  data() {
    return {
      targetDate: new Date('2025-05-24T17:00:00Z'), // 00:00 WIB 25 Mei 2025
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      interval: null,
      message: 'Counting down to our special day ❤️',
      isSpecialDay: false,
    }
  },
  mounted() {
    this.interval = setInterval(this.updateTimer, 1000)
    this.updateTimer()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    updateTimer() {
      const now = new Date()
      const timeDifference = this.targetDate - now

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

        this.days = this.formatTime(days)
        this.hours = this.formatTime(hours)
        this.minutes = this.formatTime(minutes)
        this.seconds = this.formatTime(seconds)
        this.isSpecialDay = false

        if (days > 365) {
          this.message = "More than a year to go! Can't wait! ❤️"
        } else if (days > 30) {
          this.message = 'Just a few more months to go! ❤️'
        } else if (days > 7) {
          this.message = 'Less than a month now! Getting excited! ❤️'
        } else if (days > 0) {
          this.message = 'Just days away! So excited! ❤️'
        } else {
          this.message = 'Almost there! Counting every second! ❤️'
        }
      } else {
        this.days = '00'
        this.hours = '00'
        this.minutes = '00'
        this.seconds = '00'
        this.message = 'Our special day has arrived! ❤️'
        this.isSpecialDay = true
        this.$emit('countdown-finished') // Emit event pas countdown selesai
      }
    },
    formatTime(time) {
      return time < 10 ? `0${time}` : time
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.pixel-love-timer {
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
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.timer-container {
  background-color: rgba(255, 255, 255, 0.85);
  border: 8px solid #ff69b4;
  box-shadow:
    0 0 0 4px white,
    0 0 0 12px #ff69b4;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  text-align: center;
  position: relative;
  image-rendering: pixelated;
}

.pixel-title {
  color: #ff1493;
  font-size: 24px;
  margin-bottom: 40px;
  letter-spacing: -1px;
}

.timer-display {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.timer-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-value {
  font-size: 36px;
  background-color: #ff69b4;
  color: white;
  padding: 15px;
  border-radius: 8px;
  min-width: 80px;
  margin-bottom: 10px;
  box-shadow: 0 4px 0 #d64990;
}

.timer-label {
  font-size: 12px;
  color: #ff1493;
}

.message-box {
  background-color: #ffdde1;
  border: 4px solid #ff69b4;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

.pixel-message {
  font-size: 14px;
  color: #ff1493;
  line-height: 1.5;
  margin-bottom: 15px;
}

/* Home Link Styles */
.home-link-container {
  margin-top: 20px;
  animation: pulse 1.5s infinite alternate;
}

.home-link {
  display: inline-block;
  background-color: #ff1493;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  border: 3px solid white;
  box-shadow: 0 4px 0 #d64990;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.home-link:hover {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #d64990;
}

.pixel-arrow {
  display: inline-block;
  animation: bounce 0.8s infinite alternate;
}

/* Pixel Heart CSS */
.pixel-heart {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: #ff1493;
  position: relative;
  transform: rotate(45deg);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.pixel-heart:before,
.pixel-heart:after {
  content: '';
  width: 40px;
  height: 40px;
  background-color: #ff1493;
  border-radius: 50%;
  position: absolute;
}

.pixel-heart:before {
  top: -20px;
  left: 0;
}

.pixel-heart:after {
  top: 0;
  left: -20px;
}

/* Small Hearts Animation */
.pixel-hearts-container {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  height: 100px;
}

.small-heart {
  width: 15px;
  height: 15px;
  background-color: #ff1493;
  position: absolute;
  transform: rotate(45deg);
  animation: float-up 8s linear infinite;
  opacity: 0.7;
}

.small-heart:before,
.small-heart:after {
  content: '';
  width: 15px;
  height: 15px;
  background-color: #ff1493;
  border-radius: 50%;
  position: absolute;
}

.small-heart:before {
  top: -7.5px;
  left: 0;
}

.small-heart:after {
  top: 0;
  left: -7.5px;
}

.heart1 {
  left: 10%;
  animation-delay: 0s;
}
.heart2 {
  left: 30%;
  animation-delay: 2s;
}
.heart3 {
  left: 50%;
  animation-delay: 4s;
}
.heart4 {
  left: 70%;
  animation-delay: 1s;
}
.heart5 {
  left: 90%;
  animation-delay: 3s;
}

@keyframes float-up {
  0% {
    bottom: -20px;
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    bottom: 100%;
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(3px);
  }
}

/* Responsif untuk layar kecil */
@media (max-width: 768px) {
  .pixel-title {
    font-size: 18px;
  }

  .timer-display {
    flex-wrap: wrap;
  }

  .timer-value {
    font-size: 28px;
    min-width: 60px;
    padding: 10px;
  }

  .timer-label {
    font-size: 10px;
  }

  .pixel-message {
    font-size: 12px;
  }

  .home-link {
    font-size: 12px;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .timer-container {
    padding: 20px 10px;
  }

  .timer-display {
    gap: 10px;
  }

  .timer-value {
    font-size: 22px;
    min-width: 50px;
    padding: 8px;
  }
}
</style>
