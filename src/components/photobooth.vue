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

    <!-- Debug Preview (opsional untuk debugging) -->
    <div v-if="photos.length > 0" class="debug-preview">
      <h3>Debug: Foto Mentah</h3>
      <img v-for="(photo, index) in photos" :key="index" :src="photo" style="max-width: 200px; margin: 10px;" />
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
    <div class="gallery-section">
      <h2>Galeri Momen Kita 💕</h2>
      <div v-if="isGalleryLoading">
        <p>Memuat galeri...</p>
      </div>
      <div v-else-if="galleryPhotos.length">
        <div class="gallery-grid">
          <div v-for="photo in galleryPhotos" :key="photo.id" class="gallery-item">
            <img :src="photo.url" class="gallery-photo" @error="handleImageError(photo)" />
            <p>{{ new Date(photo.created_at).toLocaleDateString("id-ID") }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Belum ada foto di galeri. Ayo ambil foto bareng Awa! 📸</p>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

let supabase = null;
try {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL atau Key tidak ditemukan!");
  }
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error(error.message);
}

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
      isCanvasReady: false,
      isGalleryLoading: true,
    };
  },
  watch: {
    photos(newPhotos) {
      if (newPhotos.length === 3 && !this.isCapturing) {
        setTimeout(async () => {
          console.log("Photos diperbarui, merender pratinjau...");
          try {
            await this.renderPreview();
            console.log("Canvas siap untuk di-download");
          } catch (error) {
            console.error("Gagal merender pratinjau:", error);
            this.isCanvasReady = false;
            this.errorMessage = "Gagal merender pratinjau. Download foto mentah sebagai alternatif.";
            this.showErrorPopup = true;
          }
        }, 100); // Penundaan 100ms untuk memastikan DOM siap
      }
    },
  },
  methods: {
    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });
        this.$refs.video.srcObject = this.stream;
        console.log("Kamera dimulai, dimensi video:", this.$refs.video.videoWidth, "x", this.$refs.video.videoHeight);
      } catch (err) {
        console.error("Gagal akses kamera:", err);
        this.errorMessage = "Gagal akses kamera. Cek izin kamera ya!";
        this.showErrorPopup = true;
      }
    },
    async takePhoto() {
      const video = this.$refs.video;
      if (!video.videoWidth || !video.videoHeight) {
        console.error("Umpan video belum siap, dimensi:", video.videoWidth, "x", video.videoHeight);
        throw new Error("Kamera belum siap. Coba lagi ya!");
      }

      // Tunggu hingga video benar-benar siap
      await new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadeddata = resolve;
        }
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      // Gambar tanpa transformasi (karena video sudah dibalik via CSS)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      console.log("Foto diambil, panjang data URL:", dataUrl.length);

      if (dataUrl.length < 1000) {
        console.error("Foto yang diambil kemungkinan kosong, panjang data URL:", dataUrl.length);
        throw new Error("Gagal mengambil foto. Foto kosong!");
      }

      return dataUrl;
    },
    async startPhotobooth() {
      if (this.isCapturing) return;
      this.isCapturing = true;
      this.photos = [];
      this.isCanvasReady = false;
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

        try {
          const photo = await this.takePhoto();
          this.photos.push(photo);
        } catch (error) {
          console.error("Gagal mengambil foto:", error);
          this.errorMessage = error.message;
          this.showErrorPopup = true;
          this.isCapturing = false;
          return;
        }

        this.animatePhoto = i;
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      this.isCapturing = false;
      this.countdown = 5;
    },
    async renderPreview() {
      const canvas = this.$refs.previewCanvas;
      if (!canvas) {
        console.error("Canvas tidak ditemukan di DOM");
        throw new Error("Canvas tidak ditemukan");
      }

      console.log("Merender pratinjau di canvas...");
      const ctx = canvas.getContext("2d");

      // Validasi gambar
      const images = await Promise.all(
        this.photos.map(
          (photo, index) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.src = photo;
              img.onload = () => {
                console.log(`Gambar ${index} dimuat, dimensi:`, img.width, "x", img.height);
                if (img.width === 0 || img.height === 0) {
                  reject(new Error(`Gambar ${index} memiliki dimensi nol`));
                }
                resolve(img);
              };
              img.onerror = () => {
                console.error(`Gagal memuat gambar ${index}:`, photo.substring(0, 50) + "...");
                reject(new Error(`Gagal memuat gambar ${index}`));
              };
            })
        )
      );

      // Cek apakah ada gambar yang valid
      if (images.length !== 3) {
        throw new Error("Jumlah gambar tidak sesuai, harap ambil 3 foto");
      }

      // Dimensi foto
      const photoWidth = images[0].width;
      const photoHeight = images[0].height;
      const padding = 10; // Jarak antar foto
      const textSpaceHeight = 50; // Ruang untuk teks di atas dan bawah
      const borderWidth = 20; // Lebar border pink

      // Atur dimensi canvas
      canvas.width = photoWidth + borderWidth * 2; // Lebar canvas = lebar foto + border di kedua sisi
      canvas.height = photoHeight * 3 + padding * 2 + textSpaceHeight * 2 + borderWidth * 2; // Tinggi canvas = tinggi 3 foto + padding + teks + border

      console.log("Dimensi canvas:", canvas.width, "x", canvas.height);

      // Bersihkan canvas dan beri background putih
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gambar border pink
      ctx.strokeStyle = "#ff69b4";
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

      // Gambar tiga foto dengan posisi yang benar
      images.forEach((img, index) => {
        const yPosition = borderWidth + textSpaceHeight + index * (photoHeight + padding);
        console.log("Menggambar gambar", index, "di y:", yPosition);
        ctx.drawImage(img, borderWidth, yPosition, photoWidth, photoHeight);
      });

      // Tambahkan teks "Happy Birthday Awa Najwa" di atas
      ctx.fillStyle = "#ff69b4";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Happy Birthday Awa Najwa", canvas.width / 2, borderWidth + textSpaceHeight / 2);

      // Tambahkan tanggal di bawah
      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ctx.font = "bold 30px Arial";
      ctx.fillText(today, canvas.width / 2, canvas.height - borderWidth - textSpaceHeight / 2);

      console.log("Pratinjau berhasil dirender");
      this.isCanvasReady = true;
    },
    async saveAndDownload() {
      if (this.isSaving) return;
      this.isSaving = true;
      this.errorMessage = '';
      this.showErrorPopup = false;

      try {
        let dataUrl;
        let fileName = `photobooth_${Date.now()}.png`;

        if (this.isCanvasReady) {
          console.log("Canvas siap, menghasilkan data URL...");
          const canvas = this.$refs.previewCanvas;
          if (!canvas) {
            console.error("Canvas tidak ditemukan untuk di-download");
            throw new Error("Gagal menemukan pratinjau. Coba lagi ya!");
          }

          dataUrl = canvas.toDataURL("image/png");
          console.log("Data URL dari canvas, panjang:", dataUrl.length);

          if (dataUrl.length < 1000) {
            console.warn("Data URL canvas terlalu pendek, kemungkinan kosong");
            throw new Error("Pratinjau kosong. Menggunakan foto mentah sebagai alternatif.");
          }
        } else {
          console.warn("Canvas tidak siap, menggunakan foto pertama sebagai cadangan...");
          if (!this.photos.length) {
            throw new Error("Tidak ada foto untuk di-download!");
          }
          dataUrl = this.photos[0];
          fileName = `photobooth_fallback_${Date.now()}.png`;
        }

        // Convert data URL ke Blob dan kompresi jika perlu
        console.log("Mengonversi data URL ke Blob...");
        let response = await fetch(dataUrl);
        let blob = await response.blob();
        console.log("Blob asli, ukuran:", blob.size, "byte");

        if (blob.size > 2 * 1024 * 1024) { // Jika lebih dari 2MB
          console.log("Mengompresi gambar...");
          const img = new Image();
          img.src = dataUrl;
          await new Promise((resolve) => (img.onload = resolve));
          const canvas = document.createElement("canvas");
          canvas.width = img.width * 0.7;
          canvas.height = img.height * 0.7;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.8)
          );
          console.log("Blob terkompresi, ukuran:", blob.size, "byte");
        }

        // Upload ke Supabase Storage
        console.log("Mengunggah ke bucket 'photobooth'...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photobooth')
          .upload(`photos/${fileName}`, blob, {
            contentType: blob.type,
          });

        if (uploadError) {
          console.error("Gagal mengunggah:", uploadError);
          throw new Error(`Gagal mengunggah ke storage: ${uploadError.message}`);
        }
        console.log("Unggahan berhasil:", uploadData);

        // Ambil public URL
        console.log("Mengambil URL publik...");
        const { data: publicUrlData } = supabase.storage
          .from('photobooth')
          .getPublicUrl(`photos/${fileName}`);

        const publicUrl = publicUrlData.publicUrl;
        if (!publicUrl) {
          console.error("Gagal mendapatkan URL publik");
          throw new Error("Gagal mendapatkan URL publik");
        }
        console.log("URL Publik:", publicUrl);

        // Simpan metadata ke tabel
        console.log("Menyisipkan metadata ke tabel 'photos'...");
        const { error: dbError } = await supabase
          .from('photos')
          .insert([{ url: publicUrl, file_name: fileName, created_at: new Date().toISOString() }]);

        if (dbError) {
          console.error("Gagal menyisipkan ke database:", dbError);
          await supabase.storage.from('photobooth').remove([`photos/${fileName}`]);
          throw new Error(`Gagal menyimpan metadata ke tabel: ${dbError.message}`);
        }
        console.log("Metadata berhasil disimpan");

        // Download foto
        console.log("Mengunduh foto...");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        link.click();
        console.log("Pengunduhan dimulai");

        // Refresh galeri
        console.log("Memperbarui galeri...");
        await this.loadGallery();
        console.log("Galeri diperbarui, foto:", this.galleryPhotos);
      } catch (error) {
        console.error("Kesalahan dalam saveAndDownload:", error);
        this.errorMessage = error.message;
        this.showErrorPopup = true;
      } finally {
        this.isSaving = false;
      }
    },
    async loadGallery() {
      try {
        console.log("Memuat galeri dari tabel 'photos'...");
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error("Gagal memuat galeri:", error);
          throw new Error(`Query gagal: ${error.message}`);
        }
        console.log("Data mentah dari Supabase:", data);
        // Filter entri dengan URL valid
        this.galleryPhotos = (data || []).filter(
          (photo) => photo.url && typeof photo.url === 'string' && photo.url.startsWith('http')
        );
        console.log("Galeri dimuat:", this.galleryPhotos.length, "foto");
      } catch (error) {
        console.error("Gagal memuat galeri:", error);
        this.errorMessage = "Gagal memuat galeri: " + error.message;
        this.showErrorPopup = true;
      } finally {
        this.isGalleryLoading = false;
      }
    },
    handleImageError(photo) {
      console.error("Gagal memuat gambar:", photo.url);
      // Hapus foto yang gagal dari galeri
      this.galleryPhotos = this.galleryPhotos.filter((p) => p.id !== photo.id);
      console.warn(`Gambar ${photo.url} dihapus dari galeri karena gagal dimuat.`);
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
    console.log("Mounted: Memulai kamera dan memuat galeri...");
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
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRoYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RDdGRTdGQkI1RDExRTdBODZBRkI2N0EyNDU0QzI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZEN0ZFN0ZDQjVEMTFFN0E4NkFGQjY3QTI0NTRDMjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RDdGRTdGOUI1RDExRTdBODZBRkI2N0EyNDU0QzI2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZEN0ZFN0ZBQjVEMTFFN0E4NkFGQjY3QTI0NTRDMjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7nxZ2eAAAAMklEQVR42mL4z8Dwn4GBgQHoJpgYGIBeo4mBAeghmBgYgF6jiYEB6CWYGJiAHqOJgQEAh84R4pW8p2IAAAAASUVORK5CYII=') repeat;
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
.preview-canvas {
  width: 100%;
  max-width: 400px;
  border: 2px solid #ff69b4;
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
  height: auto;
  border: 3px solid #ff69b4;
  border-radius: 10px;
  transform: scaleX(-1);
  object-fit: cover;
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
.debug-preview {
  margin: 20px 0;
  text-align: center;
}
</style>