<!-- LoveNotes.vue -->
<template>
    <div class="love-notes">
      <h1>Daily Love Note Challenge 💕</h1>
      <p>Tulis pesan cinta harian buat pasanganmu, nanti otomatis tersimpan!</p>
  
      <div class="note-form">
        <input
          v-model="newNote"
          placeholder="Tulis pesan cinta kamu..."
          maxlength="100"
        />
        <button @click="addNote" :disabled="!newNote || isSubmitting">
          {{ isSubmitting ? "Menyimpan..." : "Simpan Catatan" }}
        </button>
      </div>
  
      <div class="note-list">
        <div v-for="(note, index) in loveNotes" :key="index" class="note-card">
          <p>{{ note.text }}</p>
          <small>Dari: {{ note.author }} | {{ new Date(note.date).toLocaleDateString("id-ID") }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loveNotes: [],
        newNote: "",
        isSubmitting: false,
      };
    },
    computed: {
      author() {
        // Deteksi device buat set author otomatis
        const userAgent = navigator.userAgent;
        if (userAgent.includes("iPad")) {
          return "Awa"; // iPad pacar otomatis jadi Awa
        }
        return "Harfin"; // Device lain (elo) jadi Harfin
      },
    },
    async mounted() {
      await this.loadNotes();
    },
    methods: {
      async loadNotes() {
        try {
          const response = await fetch("/love-notes.json");
          const data = await response.json();
          this.loveNotes = data.notes || [];
        } catch (error) {
          console.error("Gagal load love notes:", error);
        }
      },
      async addNote() {
        if (!this.newNote) return;
  
        this.isSubmitting = true;
  
        const newNote = {
          text: this.newNote,
          author: this.author,
          date: new Date().toISOString(),
        };
  
        this.loveNotes.push(newNote);
  
        // Update file di GitHub
        try {
          const repoOwner = "USERNAME_GITHUB_ELO"; // Ganti sama username GitHub elo
          const repoName = "NAMA_REPO_ELO"; // Ganti sama nama repo
          const filePath = "public/love-notes.json";
          const token = process.env.GITHUB_TOKEN; // Ambil dari environment variable Vercel
  
          // Ambil konten file saat ini dari GitHub
          const getFileResponse = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
  
          const fileData = await getFileResponse.json();
          const sha = fileData.sha; // Dapatkan SHA file buat update
  
          // Update file dengan data baru
          const updatedContent = JSON.stringify({ notes: this.loveNotes }, null, 2);
          const encodedContent = btoa(unescape(encodeURIComponent(updatedContent))); // Encode ke base64
  
          const updateResponse = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
              method: "PUT",
              headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json",
              },
              body: JSON.stringify({
                message: `Add love note from ${this.author}`,
                content: encodedContent,
                sha: sha,
              }),
            }
          );
  
          if (updateResponse.ok) {
            alert("Catatan berhasil disimpan dan disinkronkan!");
            this.newNote = "";
            await this.loadNotes(); // Refresh list
          } else {
            throw new Error("Gagal update file di GitHub");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Gagal menyimpan catatan. Cek console untuk detail.");
        } finally {
          this.isSubmitting = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .love-notes {
    padding: 20px;
    text-align: center;
  }
  h1 {
    color: #ff69b4;
    font-size: 28px;
  }
  .note-form {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
  }
  .note-form input {
    padding: 8px;
    font-size: 14px;
    border: 2px solid #ff69b4;
    border-radius: 5px;
    width: 300px;
  }
  .note-form button {
    padding: 8px 15px;
    background-color: #ff69b4;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .note-form button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .note-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 600px;
    margin: 0 auto;
  }
  .note-card {
    background-color: #fff;
    border: 2px solid #ff69b4;
    border-radius: 10px;
    padding: 15px;
    text-align: left;
  }
  .note-card p {
    margin: 0;
    font-size: 16px;
  }
  .note-card small {
    color: #888;
    font-size: 12px;
  }
  </style>