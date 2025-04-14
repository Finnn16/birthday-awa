<!-- Photobooth.vue -->
<template>
  <div class="photobooth">
    <!-- Preview Section -->
    <div class="preview-section" v-if="photos.length === 3 && !isCapturing">
      <canvas ref="previewCanvas" class="preview-canvas"></canvas>
    </div>

    <!-- Video dan Capture Section -->
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
        <button v-if="photos.length === 3 && !isCapturing" @click="saveAndDownload" class="download-btn">
          Simpan & Download
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

    <!-- Galeri Foto dari Supabase -->
    <div class="gallery-section" v-if="galleryPhotos.length">
      <h2>Galeri Momen Kita 💕</h2>
      <div class="gallery-grid">
        <div v-for="photo in galleryPhotos" :key="photo.id" class="gallery-item">
          <img :src="photo.url" class="gallery-photo" />
          <p>{{ new Date(photo.created_at).toLocaleDateString("id-ID") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default {
  data() {
    return {
      stream: null,
      photos: [],
      isCapturing: false,
      countdown: 5,
      showFlash: false,
      animatePhoto: null,
      galleryPhotos: [], // Foto dari Supabase
      isSaving: false,
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
        alert("Gagal akses kamera. Cek izin kamera ya!");
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
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const images = await Promise.all(
        this.photos.map(
          (photo) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = photo;
              img.onload = () => resolve(img);
            })
        )
      );

      const photoWidth = images[0].width;
      const photoHeight = images[0].height;
      const padding = 10;
      const textSpaceHeight = 100;
      canvas.width = photoWidth + 40;
      canvas.height = photoHeight * 3 + padding * 2 + textSpaceHeight * 2;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#ff69b4";
      ctx.lineWidth = 20;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      images.forEach((img, index) => {
        const yPosition = textSpaceHeight + index * (photoHeight + padding);
        ctx.drawImage(img, 20, yPosition, photoWidth, photoHeight);
      });

      ctx.fillStyle = "#ff69b4";
      ctx.font = "bold 36px 'Tangerine', cursive";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Happy Birthday Awliya Najwa", canvas.width / 2, textSpaceHeight / 2);

      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ctx.font = "bold 40px 'Tangerine', cursive";
      ctx.fillText(today, canvas.width / 2, canvas.height - textSpaceHeight / 2);
    },
    async saveAndDownload() {
      if (this.isSaving) return;
      this.isSaving = true;

      try {
        const canvas = this.$refs.previewCanvas;
        const dataUrl = canvas.toDataURL("image/png");
        const fileName = `photobooth_${Date.now()}.png`;

        // Convert data URL ke Blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Upload ke Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('photobooth')
          .upload(`photos/${fileName}`, blob, {
            contentType: 'image/png',
          });

        if (uploadError) {
          throw new Error(`Gagal upload foto: ${uploadError.message}`);
        }

        // Ambil public URL
        const { publicUrl } = supabase.storage
          .from('photobooth')
          .getPublicUrl(`photos/${fileName}`);

        // Simpan metadata ke tabel
        const { error: dbError } = await supabase
          .from('photos')
          .insert([{ url: publicUrl, file_name: fileName, created_at: new Date().toISOString() }]);

        if (dbError) {
          throw new Error(`Gagal simpan metadata: ${dbError.message}`);
        }

        // Download foto
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        link.click();

        // Refresh galeri
        await this.loadGallery();

        alert("Foto berhasil disimpan dan di-download!");
      } catch (error) {
        console.error("Error saat save/download:", error);
        alert("Gagal menyimpan foto: " + error.message);
      } finally {
        this.isSaving = false;
      }
    },
    async loadGallery() {
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        this.galleryPhotos = data || [];
      } catch (error) {
        console.error("Gagal load galeri:", error);
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
    },
  },
  async mounted() {
    await this.startCamera();
    await this.loadGallery();
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
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
.timer {
  font-size: 28px;
  color: #ff69b4;
  font-weight: bold;
}
.capture-btn, .download-btn {
  padding: 12px 25px;
  font-size: 18px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.capture-btn:disabled, .download-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.capture-btn:hover:not(:disabled), .download-btn:hover:not(:disabled) {
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
  0% { transform: translateX(-150%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
.preview-canvas {
  width: 100%;
  max-width: 400px;
}
.gallery-section {
  margin-top: 40px;
  text-align: center;
}
.gallery-section h2 {
  color: #ff69b4;
  font-size: 24px;
  margin-bottom: 20px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.gallery-item {
  text-align: center;
}
.gallery-photo {
  width: 100%;
  border-radius: 10px;
  border: 2px solid #ff69b4;
}
</style>