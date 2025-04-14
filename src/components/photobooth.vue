<!-- Photobooth.vue -->
<template>
  <div class="photobooth">
    <!-- Pop-up Error -->
    <div v-if="showErrorPopup" class="error-popup-overlay">
      <div class="error-popup">
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorPopup" class="error-popup-btn">OK</button>
      </div>
    </div>

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
      galleryPhotos: [],
      isSaving: false,
      errorMessage: '',
      showErrorPopup: false,
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
        this.errorMessage = "Gagal akses kamera. Cek izin kamera ya!";
        this.showErrorPopup = true;
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
      this.errorMessage = '';
      this.showErrorPopup = false;

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
      this.errorMessage = '';
      this.showErrorPopup = false;

      try {
        const canvas = this.$refs.previewCanvas;
        const dataUrl = canvas.toDataURL("image/png");
        const fileName = `photobooth_${Date.now()}.png`;

        // Convert data URL ke Blob
        console.log("Converting data URL to Blob...");
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        console.log("Blob created, size:", blob.size, "bytes");

        // Upload ke Supabase Storage
        console.log("Uploading to storage bucket 'photobooth'...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photobooth')
          .upload(`photos/${fileName}`, blob, {
            contentType: 'image/png',
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Gagal upload ke storage: ${uploadError.message}`);
        }
        console.log("Upload successful:", uploadData);

        // Ambil public URL
        console.log("Getting public URL...");
        const { data: publicUrlData } = supabase.storage
          .from('photobooth')
          .getPublicUrl(`photos/${fileName}`);

        const publicUrl = publicUrlData.publicUrl;
        if (!publicUrl) {
          throw new Error("Gagal mendapatkan public URL");
        }
        console.log("Public URL:", publicUrl);

        // Simpan metadata ke tabel
        console.log("Inserting metadata to table 'photos'...");
        const { error: dbError } = await supabase
          .from('photos')
          .insert([{ url: publicUrl, file_name: fileName, created_at: new Date().toISOString() }]);

        if (dbError) {
          console.error("Database error:", dbError);
          await supabase.storage.from('photobooth').remove([`photos/${fileName}`]);
          throw new Error(`Gagal menyimpan metadata: ${dbError.message}`);
        }
        console.log("Metadata saved successfully");

        // Download foto
        console.log("Downloading photo...");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        link.click();

        // Refresh galeri
        await this.loadGallery();

        alert("Foto berhasil disimpan dan di-download!");
      } catch (error) {
        console.error("Error saat save/download:", error);
        this.errorMessage = error.message;
        this.showErrorPopup = true;
      } finally {
        this.isSaving = false;
      }
    },
    async loadGallery() {
      try {
        console.log("Loading gallery...");
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        this.galleryPhotos = data || [];
        console.log("Gallery loaded:", this.galleryPhotos.length, "photos");
      } catch (error) {
        console.error("Gagal load galeri:", error);
        this.errorMessage = "Gagal memuat galeri: " + error.message;
        this.showErrorPopup = true;
      }
    },
    closeErrorPopup() {
      this.showErrorPopup = false;
      this.errorMessage = '';
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
    },
  },
  async mounted() {
    if (!supabaseUrl || !supabaseKey) {
      this.errorMessage = "Gagal terhubung ke server. Cek konfigurasi!";
      this.showErrorPopup = true;
      return;
    }
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
.error-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.error-popup {
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RDdGRTdGQkI1RDExRTdBODZBRkI2N0EyNDU0QzI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZEN0ZFN0ZDQjVEMTFFN0E4NkFGQjY3QTI0NTRDMjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RDdGRTdGOUI1RDExRTdBODZBRkI2N0EyNDU0QzI2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEN0ZFN0ZBQjVEMTFFN0E4NkFGQjY3QTI0NTRDMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7nxZ2eAAAAMklEQVR42mL4z8Dwn4GBgQHoJpgYGIBeo4mBAeghmBgYgF6jiYEB6CWYGJiAHqOJgQEAh84R4pW8p2IAAAAASUVORK5CYII=') repeat;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.error-popup p {
  color: red;
  font-size: 16px;
  margin: 0 0 15px;
}
.error-popup-btn {
  padding: 8px 20px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.error-popup-btn:hover {
  background-color: #ff1493;
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
  background: rgba(255, 255, 231, 0.9);
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