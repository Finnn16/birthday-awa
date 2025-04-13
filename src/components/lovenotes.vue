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

// Cek apakah environment variables ada
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL atau Key tidak ditemukan! Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_KEY sudah diatur di environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
        const { data, error } = await supabase
          .from('love_notes')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        this.loveNotes = data || [];
      } catch (error) {
        console.error("Gagal load love notes:", error.message);
      }
    },
    async addNote() {
      if (!this.newNote) return;

      this.isSubmitting = true;

      try {
        const { error } = await supabase
          .from('love_notes')
          .insert([{ text: this.newNote, author: this.author }]);
        if (error) throw error;

        alert("Catatan berhasil disimpan!");
        this.newNote = "";
        await this.loadNotes(); // Refresh list
      } catch (error) {
        console.error("Error menyimpan catatan:", error.message);
        alert("Gagal menyimpan catatan: " + error.message);
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