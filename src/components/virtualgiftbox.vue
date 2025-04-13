<!-- VirtualGiftBox.vue -->
<template>
    <div class="gift-box">
      <div v-if="!isOpen" class="box-closed" @click="openGift">
        <img src="/gift-box-closed.png" alt="Kotak Hadiah" class="box-image" />
        <p>Klik untuk membuka hadiahmu! 🎁</p>
      </div>
      <div v-else class="box-open">
        <img src="/gift-box-open.png" alt="Kotak Hadiah Terbuka" class="box-image" />
        <div class="gift-content">
          <h2>Selamat, Sayang! 💖</h2>
          <p>Ini hadiah virtual dariku: voucher date night bareng di kafe favorit kita!</p>
          <img src="/gift-voucher.png" alt="Hadiah" class="gift-image" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      openGift() {
        this.isOpen = true;
      },
    },
  };
  </script>
  
  <style scoped>
  .gift-box {
    text-align: center;
    padding: 20px;
  }
  .box-closed,
  .box-open {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .box-closed {
    cursor: pointer;
  }
  .box-image {
    width: 150px;
    height: 150px;
    transition: transform 0.3s ease;
  }
  .box-closed:hover .box-image {
    transform: scale(1.1);
  }
  .gift-content {
    background-color: #fff;
    border: 2px solid #ff69b4;
    border-radius: 10px;
    padding: 15px;
    max-width: 300px;
  }
  .gift-content h2 {
    color: #ff69b4;
    font-size: 20px;
    margin: 0;
  }
  .gift-content p {
    font-size: 16px;
    margin: 10px 0;
  }
  .gift-image {
    width: 100%;
    max-width: 200px;
    border-radius: 5px;
  }
  </style>