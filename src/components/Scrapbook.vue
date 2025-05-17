<template>
  <div class="scrapbook-container">
    <div class="polaroid" v-for="photo in photos" :key="photo.id">
      <img :src="photo.src" alt="Memory" class="photo-img" />
      <p class="caption">{{ photo.caption }}</p>
    </div>
    <div class="text-overlay">
      <h2>Happy Birthday, Sayang!</h2>
      <p>Our journey together is my favorite adventure. ❤️</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scrapbook',
  props: {
    show: Boolean,
  },
  data() {
    return {
      photos: [
        { id: 1, src: 'path/to/photo1.jpg', caption: 'First date ❤️' },
        { id: 2, src: 'path/to/photo2.jpg', caption: 'Our trip together' },
        { id: 3, src: 'path/to/photo3.jpg', caption: 'Special moment' },
      ],
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$emit('update:show', true)
      }
    },
  },
}
</script>

<style scoped>
.scrapbook-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 182, 193, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  z-index: 1000;
}

.polaroid {
  background: #fff;
  padding: 10px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(-2deg);
  transition: transform 0.3s;
}

.polaroid:hover {
  transform: rotate(2deg) scale(1.05);
}

.photo-img {
  width: 200px;
  height: auto;
  display: block;
}

.caption {
  text-align: center;
  font-family: ' handwriting', cursive;
  color: #ff69b4;
  margin-top: 5px;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
}

.text-overlay h2 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.text-overlay p {
  font-size: 1.2em;
}
</style>
