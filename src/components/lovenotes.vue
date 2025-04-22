<template>
  <div class="love-notes">
    <h1>Daily Love Note Challenge 💕</h1>
    <p>Tulis Pesan Singkat Saja Sayang (I love You Sayaaangku, semangat tudeyy!!)</p>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

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

    <div class="note-list-wrapper">
      <div class="note-list" ref="noteList">
        <div v-for="note in loveNotes" :key="note.id" class="note-card">
          <p>{{ note.text }}</p>
          <small>Dari: {{ note.author }} | {{ new Date(note.created_at).toLocaleDateString("id-ID") }}</small>
        </div>
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
      loveNotes: [],
      newNote: "",
      isSubmitting: false,
      errorMessage: "",
    };
  },
  computed: {
    author() {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("ipad") || userAgent.includes("macintosh")) {
        return "Awa";
      }
      return "Harfin";
    },
  },
  async mounted() {
    if (!supabase) {
      this.errorMessage = "Gagal terhubung ke server. Cek konfigurasi!";
      console.error("Supabase client tidak terinisialisasi.");
      return;
    }
    console.log("User Agent:", navigator.userAgent);
    console.log("Author:", this.author);
    console.log("Supabase URL:", supabaseUrl);
    await this.loadNotes();
  },
  methods: {
    async loadNotes() {
      try {
        this.errorMessage = "";
        const { data, error } = await supabase
          .from('love_notes')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          throw new Error(`Supabase error: ${error.message} (code: ${error.code})`);
        }
        this.loveNotes = data || [];
        // Scroll ke atas setelah load data
        this.$nextTick(() => {
          if (this.$refs.noteList) {
            this.$refs.noteList.scrollTop = 0;
          }
        });
      } catch (error) {
        this.errorMessage = "Gagal memuat catatan. Coba refresh atau hubungi admin!";
        console.error("Gagal load love notes:", error);
      }
    },
    async addNote() {
      if (!this.newNote) return;

      this.isSubmitting = true;
      this.errorMessage = "";

      try {
        const { error } = await supabase
          .from('love_notes')
          .insert([{ text: this.newNote, author: this.author }]);
        if (error) {
          throw new Error(`Supabase error: ${error.message} (code: ${error.code})`);
        }

        alert("Catatan berhasil disimpan!");
        this.newNote = "";
        await this.loadNotes();
      } catch (error) {
        this.errorMessage = "Gagal menyimpan catatan. Coba lagi!";
        console.error("Error menyimpan catatan:", error);
        alert("Gagal menyimpan: " + error.message);
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
.error-message {
  color: red;
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
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
.note-list-wrapper {
  max-width: 600px;
  margin: 0 auto;
  border: 2px solid #ff69b4;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
}
.note-list {
  max-height: 300px; /* Atur tinggi maksimum */
  overflow-y: auto; /* Tambah scroll vertikal */
  display: flex;
  flex-direction: column;
  gap: 15px;
}
/* Styling scrollbar biar lebih cantik */
.note-list::-webkit-scrollbar {
  width: 8px;
}
.note-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}
.note-list::-webkit-scrollbar-thumb {
  background: #ff69b4;
  border-radius: 5px;
}
.note-list::-webkit-scrollbar-thumb:hover {
  background: #ff1493;
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