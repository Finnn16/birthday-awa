<template>
    <div class="dream-board">
      <h2>Our Dream Board</h2>
      <div class="dream-form">
        <input v-model="dreamTitle" placeholder="What's our next dream?" />
        <input type="file" accept="image/*" @change="handleImage" />
        <input v-model="dreamLink" placeholder="Add a link (optional)" />
        <button @click="addDream">Add Dream</button>
      </div>
      <div class="dream-grid">
        <div
          v-for="dream in dreams"
          :key="dream.id"
          class="dream-card"
          @mouseenter="hoverCard(dream.id)"
          @mouseleave="leaveCard(dream.id)"
        >
          <h3>{{ dream.title }}</h3>
          <img v-if="dream.image" :src="dream.image" alt="Dream image" />
          <a v-if="dream.link" :href="dream.link" target="_blank">Visit Link</a>
          <button class="like-btn" @click="toggleLike(dream)">
            {{ dream.liked ? '❤️' : '♡' }} {{ dream.likes || 0 }}
          </button>
        </div>
      </div>
      <div class="hearts-background"></div>
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
        dreamTitle: '',
        dreamImage: null,
        dreamLink: '',
        dreams: [],
        hoveredCard: null
      }
    },
    async mounted() {
      await this.fetchDreams()
    },
    methods: {
      async handleImage(event) {
        this.dreamImage = event.target.files[0]
      },
      async addDream() {
        let imageUrl = ''
        if (this.dreamImage) {
          const fileName = `dream-${Date.now()}`
          const { data, error } = await supabase.storage
            .from('dreams')
            .upload(fileName, this.dreamImage)
          if (error) {
            console.error('Upload error:', error)
            return
          }
          imageUrl = supabase.storage.from('dreams').getPublicUrl(fileName).data.publicUrl
        }
        const { error } = await supabase.from('dreams').insert({
          title: this.dreamTitle,
          image: imageUrl,
          link: this.dreamLink,
          likes: 0,
          liked: false
        })
        if (error) {
          console.error('Insert error:', error)
          return
        }
        this.dreamTitle = ''
        this.dreamImage = null
        this.dreamLink = ''
        await this.fetchDreams()
      },
      async fetchDreams() {
        const { data, error } = await supabase.from('dreams').select('*')
        if (error) {
          console.error('Fetch error:', error)
          return
        }
        this.dreams = data.map(dream => ({
          ...dream,
          liked: dream.liked || false
        }))
      },
      async toggleLike(dream) {
        const newLiked = !dream.liked
        const newLikes = newLiked ? (dream.likes || 0) + 1 : (dream.likes || 0) - 1
        const { error } = await supabase
          .from('dreams')
          .update({ likes: newLikes, liked: newLiked })
          .eq('id', dream.id)
        if (error) {
          console.error('Like error:', error)
          return
        }
        dream.liked = newLiked
        dream.likes = newLikes
      },
      hoverCard(id) {
        this.hoveredCard = id
      },
      leaveCard() {
        this.hoveredCard = null
      }
    }
  }
  </script>
  
  <style scoped>
  .dream-board {
    padding: 20px;
    background: #f5c6cb;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
  .dream-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  .dream-form input,
  .dream-form button {
    padding: 10px;
    border: none;
    border-radius: 5px;
  }
  .dream-form button {
    background: #c8e6c9;
    cursor: pointer;
  }
  .dream-form button:hover {
    background: #b2d8b2;
  }
  .dream-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  .dream-card {
    background: #fff9c4;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    opacity: 0;
    animation: fadeIn 0.5s ease-in forwards;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .dream-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .dream-card img {
    max-width: 100%;
    border-radius: 5px;
    margin: 10px 0;
  }
  .dream-card a {
    color: #f5c6cb;
    text-decoration: none;
  }
  .dream-card a:hover {
    text-decoration: underline;
  }
  .like-btn {
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
  }
  .hearts-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }
  .hearts-background::before {
    content: '❤️';
    position: absolute;
    animation: float 5s infinite linear;
    font-size: 1.5em;
    opacity: 0.3;
  }
  .hearts-background::after {
    content: '💖';
    position: absolute;
    animation: float 7s infinite linear;
    font-size: 1.5em;
    opacity: 0.3;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes float {
    0% {
      transform: translateY(100vh) translateX(0);
    }
    100% {
      transform: translateY(-100vh) translateX(20px);
    }
  }
  </style>