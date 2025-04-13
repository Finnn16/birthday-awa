<template>
  <div class="photobooth">
    <div class="preview-section" v-if="photos.length === 3 && !isCapturing">
      <canvas ref="previewCanvas" class="preview-canvas"></canvas>
    </div>
    <div class="container">
      <div class="video-section">
        <div class="video-wrapper">
          <video ref="video" autoplay class="video-feed"></video>
          <div v-if="showFlash" class="flash-overlay"></div>
        </div>
        <div v-if="isCapturing" class="timer">{{ countdown }} detik</div>

        <button @click="startPhotobooth" :disabled="isCapturing" class="capture-btn">
          {{ isCapturing ? "Sedang Ambil Foto..." : "Ambil Foto!" }}
        </button>
        <button v-if="photos.length === 3 && !isCapturing" @click="downloadCombinedPhoto" class="download-btn">
          Download Semua
        </button>
      </div>
      <div class="photo-gallery">
        <div v-for="(photo, index) in photos" :key="index" class="photo-wrapper">
          <img
            :src="photo"
            class="photo"
            :class="{ 'slide-in': animatePhoto === index }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stream: null,
      photos: [],
      isCapturing: false,
      countdown: 5,
      showFlash: false,
      animatePhoto: null,
    };
  },
  watch: {
    photos(newPhotos) {
      if (newPhotos.length === 3 && !this.isCapturing) {
        this.$nextTick(() => {
          this.renderPreview();
        });
      }
    },
  },
  methods: {
    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.stream;
      } catch (err) {
        console.error("Gagal akses kamera:", err);
      }
    },
    async takePhoto() {
      const video = this.$refs.video;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/png");
    },
    async startPhotobooth() {
      if (this.isCapturing) return;
      this.isCapturing = true;
      this.photos = [];

      for (let i = 0; i < 3; i++) {
        this.countdown = 5;
        const countdownInterval = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) clearInterval(countdownInterval);
        }, 1000);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        this.showFlash = true;
        setTimeout(() => {
          this.showFlash = false;
        }, 300);

        const photo = await this.takePhoto();
        this.photos.push(photo);

        this.animatePhoto = i;
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      this.isCapturing = false;
      this.countdown = 5;
    },
    async renderPreview() {
      const canvas = this.$refs.previewCanvas;
      if (!canvas) {
        console.error("Canvas tidak ditemukan!");
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Gagal mendapatkan context 2D dari canvas!");
        return;
      }

      const images = await Promise.all(
        this.photos.map((photo) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = photo;
            img.onload = () => resolve(img);
            img.onerror = () => {
              console.error("Gagal load gambar:", photo);
              reject(new Error("Gagal load gambar"));
            };
          })
        )
      ).catch((err) => {
        console.error("Error loading images:", err);
        return [];
      });

      if (images.length !== 3) {
        console.error("Jumlah gambar tidak sesuai:", images.length);
        return;
      }

      const font = new FontFace("Tangerine", "url(https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap)");
      await font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      }).catch((err) => {
        console.error("Gagal load font Tangerine:", err);
      });

      const photoWidth = images[0].width;
      const photoHeight = images[0].height;
      const padding = 10;
      const textSpaceHeight = 100;
      canvas.width = photoWidth + 40;
      canvas.height = photoHeight * 3 + padding * 2 + textSpaceHeight * 2;

      // Background putih (default)
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#ff69b4";
      ctx.lineWidth = 20;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      images.forEach((img, index) => {
        const yPosition = textSpaceHeight + index * (photoHeight + padding);
        ctx.drawImage(img, 20, yPosition, photoWidth, photoHeight);
      });

      // Teks statis di atas (ukuran 36px)
      ctx.fillStyle = "#ff69b4";
      ctx.font = "bold 36px 'Tangerine', cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Happy Birthday Awliya Najwa", canvas.width / 2, textSpaceHeight / 2);

      // Tanggal di bawah (ukuran 40px)
      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ctx.font = "bold 40px 'Tangerine', cursive";
      ctx.fillText(today, canvas.width / 2, canvas.height - textSpaceHeight / 2);
    },
    async downloadCombinedPhoto() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const images = await Promise.all(
        this.photos.map((photo) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = photo;
            img.onload = () => resolve(img);
          })
        )
      );

      const font = new FontFace("Tangerine", "url(https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap)");
      await font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      }).catch((err) => {
        console.error("Gagal load font Tangerine:", err);
      });

      const photoWidth = images[0].width;
      const photoHeight = images[0].height;
      const padding = 10;
      const textSpaceHeight = 100;
      canvas.width = photoWidth + 40;
      canvas.height = photoHeight * 3 + padding * 2 + textSpaceHeight * 2;

      // Background putih (default)
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#ff69b4";
      ctx.lineWidth = 20;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      images.forEach((img, index) => {
        const yPosition = textSpaceHeight + index * (photoHeight + padding);
        ctx.drawImage(img, 20, yPosition, photoWidth, photoHeight);
      });

      // Teks statis di atas (ukuran 36px)
      ctx.fillStyle = "#ff69b4";
      ctx.font = "bold 36px 'Tangerine', cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Happy Birthday Awliya Najwa", canvas.width / 2, textSpaceHeight / 2);

      // Tanggal di bawah (ukuran 40px)
      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ctx.font = "bold 40px 'Tangerine', cursive";
      ctx.fillText(today, canvas.width / 2, canvas.height - textSpaceHeight / 2);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "photobooth_awa_harfin.png";
      link.click();
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
    },
  },
  mounted() {
    this.startCamera();
  },
  beforeDestroy() {
    this.stopCamera();
  },
};
</script>

<style scoped>
.photobooth {
  padding: 20px;
}
.preview-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.container {
  display: flex;
  gap: 30px;
  justify-content: center;
}
.video-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.video-wrapper {
  position: relative;
}
.video-feed {
  width: 100%;
  max-width: 600px;
  border: 3px solid #ff69b4;
  border-radius: 10px;
  transform: scaleX(-1);
}
.flash-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  animation: flash 0.3s ease-out;
}
@keyframes flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.timer {
  font-size: 28px;
  color: #ff69b4;
  font-weight: bold;
}
.capture-btn {
  padding: 12px 25px;
  font-size: 18px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.capture-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.capture-btn:hover:not(:disabled) {
  background-color: #ff1493;
}
.photo-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}
.photo-wrapper {
  position: relative;
}
.photo {
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
}
.slide-in {
  animation: slideIn 1s ease-out;
}
@keyframes slideIn {
  0% {
    transform: translateX(-150%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.preview-canvas {
  width: 100%;
  max-width: 400px;
}
.download-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
.download-btn:hover {
  background-color: #ff1493;
}
</style>