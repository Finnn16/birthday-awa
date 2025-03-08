<template>
  <div class="challenge-container">
    <div class="challenge-card">
      <div class="challenge-header">
        <div class="heart-icon">💖</div>
        <h2>Tantangan Cinta Hari Ini</h2>
      </div>
      
      <div class="challenge-content">
        <div class="challenge-text">
          {{ currentChallenge.text }}
        </div>
        
        <div class="challenge-details">
          <span class="challenge-category">{{ currentChallenge.category }}</span>
          <div class="challenge-difficulty">
            <span v-for="n in currentChallenge.difficulty" :key="n" class="difficulty-heart">❤️</span>
          </div>
        </div>
      </div>
      
      <div class="challenge-timer">
        Tantangan berlaku hingga: {{ formatRemainingTime }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalRomanticChallenge',
  data() {
    return {
      weekChallenges: [
        // ... challenges tetap sama
      ],
      currentChallenge: null,
      challengeStartDate: new Date('2025-03-09T09:00:00+07:00'),
      challengeEndDate: new Date('2025-03-16T09:00:00+07:00')
    }
  },
  methods: {
    initializeChallenges() {
      try {
        // Cek dukungan localStorage
        if (typeof localStorage === 'undefined') {
          console.warn('LocalStorage tidak didukung')
          this.selectChallengeForToday()
          return
        }

        const savedChallenges = localStorage.getItem('weekChallengesData')
        
        if (savedChallenges) {
          try {
            const parsedData = JSON.parse(savedChallenges)
            
            // Validasi struktur data
            if (parsedData && parsedData.weekChallenges) {
              this.weekChallenges = parsedData.weekChallenges.map(challenge => ({
                ...challenge,
                date: challenge.date ? new Date(challenge.date) : null
              }))
            }
            
            // Cari challenge untuk hari ini
            const today = this.getIndonesiaTime()
            this.currentChallenge = this.weekChallenges.find(challenge => 
              challenge.date && this.isSameDay(new Date(challenge.date), today)
            )
          } catch (parseError) {
            console.error('Error parsing localStorage:', parseError)
            // Hapus data localStorage yang rusak
            localStorage.removeItem('weekChallengesData')
          }
        }
        
        // Jika belum ada challenge untuk hari ini, buat challenge baru
        if (!this.currentChallenge) {
          this.selectChallengeForToday()
        }
      } catch (error) {
        console.error('Error initializing challenges:', error)
        this.selectChallengeForToday()
      }
    },
    selectChallengeForToday() {
      const today = this.getIndonesiaTime()
      
      // Pastikan challenge sesuai rentang tanggal
      if (today < this.challengeStartDate || today > this.challengeEndDate) {
        this.currentChallenge = null
        return
      }
      
      // Cari challenge yang belum memiliki tanggal
      const availableChallenge = this.weekChallenges.find(challenge => !challenge.date)
      
      if (availableChallenge) {
        // Set tanggal challenge ke hari ini
        availableChallenge.date = new Date(today)
        this.currentChallenge = availableChallenge
        
        // Simpan data
        this.saveChallenges()
      } else {
        // Fallback jika semua challenge sudah memiliki tanggal
        this.currentChallenge = this.weekChallenges[0]
      }
    },
    // ... method lainnya tetap sama
  },
  created() {
    // Pastikan currentChallenge selalu memiliki nilai
    this.currentChallenge = this.weekChallenges[0] || null
    this.initializeChallenges()
  },
  // ... bagian lain tetap sama
}
</script>

<style scoped>
/* Style tetap sama seperti sebelumnya */
.challenge-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.challenge-card {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

/* ... sisanya sama seperti sebelumnya ... */
</style>