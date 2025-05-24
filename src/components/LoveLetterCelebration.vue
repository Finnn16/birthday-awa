<template>
  <div class="celebration-container" v-if="show">
    <!-- Confetti Explosion -->
    <ConfettiExplosion
      v-if="showConfetti"
      :duration="3000"
      :particleCount="200"
      :colors="['#ff69b4', '#ffcccb', '#ffe4e1', '#ffb6c1']"
      @finished="onConfettiFinished"
    />

    <!-- Love Letter -->
    <div class="letter-wrapper" :class="{ 'letter-open': letterVisible }">
      <div class="envelope"></div>
      <div class="letter-content">
        <h2>Selamat Ulang Tahun, Sayangku! 🎂</h2>
        <p>
          Hai cinta, hari ini adalah hari spesialmu, dan aku bersyukur banget bisa merayakannya
          bareng kamu. Setiap detik bersamamu bikin hidupku penuh warna, kayak confetti yang barusan
          meledak tadi. Aku janji bakal selalu ada buatmu, ngelewatin semua momen indah dan
          tantangan bareng-bareng. I love you more than words can say. ❤️
        </p>
        <p class="signature">— Cintamu, [Nama Kamu]</p>
      </div>
    </div>
  </div>
</template>

<script>
import ConfettiExplosion from 'vue-confetti-explosion'

export default {
  name: 'LoveLetterCelebration',
  components: { ConfettiExplosion },
  props: {
    show: { type: Boolean, default: false },
  },
  data() {
    return {
      showConfetti: false,
      letterVisible: false,
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        console.log('LoveLetterCelebration is triggered at', new Date().toLocaleTimeString())
        this.showConfetti = true
        this.$emit('update:show', true)
      }
    },
  },
  methods: {
    onConfettiFinished() {
      setTimeout(() => {
        this.letterVisible = true
      }, 500)
    },
  },
}
</script>

<style scoped>
.celebration-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    url('https://www.transparenttextures.com/patterns/paper-fibers.png'), rgba(255, 230, 230, 0.95);
  background-blend-mode: overlay;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
}

.letter-wrapper {
  position: relative;
  width: 80%;
  max-width: 600px;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.letter-open {
  opacity: 1;
}

.envelope {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 60px;
  background: url('https://www.transparenttextures.com/patterns/paper-fibers.png'), #fff;
  border: 2px solid #ff69b4;
  clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  z-index: 1;
}

.letter-content {
  background: #fff;
  padding: 30px;
  border: 2px solid #ff69b4;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: 'Caveat', cursive;
  color: #333;
}

.letter-content h2 {
  font-family: 'Dancing Script', cursive;
  font-size: 2.5em;
  color: #ff69b4;
  margin-bottom: 20px;
}

.letter-content p {
  font-size: 1.3em;
  line-height: 1.5;
  margin-bottom: 20px;
}

.signature {
  font-style: italic;
  font-size: 1.2em;
  color: #ff69b4;
}
</style>
