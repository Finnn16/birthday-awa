<!-- LoveNotes.vue -->
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

    <div class="note-list">
      <div v-for="note in loveNotes" :key="note.id" class="note-card">
        <p>{{ note.text }}</p>
        <small>Dari: {{ note.author }} | {{ new Date(note.created_at).toLocaleDateString("id-ID") }}</small>
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
    // Cek koneksi Supabase
    if (!supabase) {
      this.errorMessage = "Gagal terhubung ke server. Cek konfigurasi!";
      console.error("Supabase client tidak terinisialisasi.");
      return;
    }

    // Debug info
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
  margin: 10