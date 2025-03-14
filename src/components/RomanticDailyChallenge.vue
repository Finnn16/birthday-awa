<template>
  <div class="pixel-challenge-container">
    <div class="challenge-wrapper">
      <div class="pixel-heart-challenge"></div>
      <div class="music-player">
        <audio ref="bgMusic" loop>
          <source src="/public/music/Maroon_5_Wont_Go_Home.mp3" type="audio/mpeg">
          Browser Anda tidak mendukung elemen audio.
        </audio>
        <button 
          @click="toggleMusic" 
          class="pixel-button music-btn"
          :class="{ 'playing': isMusicPlaying }"
        >
          {{ isMusicPlaying ? 'Pause Music' : 'Play Music' }}
        </button>
        <div class="lyrics-display">
          <p class="typing-lyrics" 
          :class="{ 'finished': isTypingFinished }">{{ displayedLyrics }}</p>
        </div>
      </div>
      <div class="player-stats-container">
        <div class="player-level">
          <div class="level-badge">
            Level {{ currentLevelInfo.level }}: {{ currentLevelInfo.name }}
          </div>
          
          <div class="points-display">
            Total Points: {{ playerStats.totalPoints }}
          </div>
          
          <div class="level-progress">
            <div 
              class="progress-bar" 
              :style="{ width: `${progressToNextLevel}%` }"
            ></div>
          </div>
          
          <div v-if="nextLevelInfo" class="next-level-info">
            <p>Next Level: {{ nextLevelInfo.name }}</p>
            <p>Hadiah 1: {{ nextLevelInfo.reward }}</p>
            <p>Hadiah 2: {{ nextLevelInfo.physicalReward }}</p>
          </div>
        </div>
      </div>
      
      <h2 class="challenge-title">Goal : Agar Makin Asik Jeu mwehehehe</h2>
      
      <div v-if="!isValidTime" class="challenge-inactive">
        <p>SABAARRR!!! Misi nya cuman ada di jam <br> 09:00 - 21:00 WIB</p>
        <p>SABAR YAAA CINTAKUUU XIXIXIXIXIXI  </p>
      </div>
      
      <div v-else-if="!isValidPeriod" class="challenge-inactive">
        <p>Challenges are only available from 09-03-2025 to 16-03-2025</p>
      </div>
      
      <div v-else class="challenges-content">
        <div 
          v-for="(challenge, index) in todayChallenges" 
          :key="index" 
          class="challenge-item"
        >
          <div class="challenge-text">
            {{ challenge.text }}
          </div>
          
          <div class="challenge-details">
            <div class="challenge-category">
              <span class="pixel-tag">{{ challenge.category }}</span>
            </div>
            
            <div class="challenge-difficulty">
              <span class="pixel-difficulty">
                Level: 
                <span 
                  v-for="n in challenge.difficulty" 
                  :key="n" 
                  class="difficulty-heart"
                >❤️</span>
              </span>
            </div>
          </div>
          
          <div class="challenge-actions">
            <button 
              @click="completeChallenge(index)" 
              :disabled="challenge.completed"
              class="pixel-button complete-btn"
              :class="{ 'completed': challenge.completed }"
            >
              {{ challenge.completed ? 'Completed' : 'Complete Challenge' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="challenge-history">
        <h3>Challenge History</h3>
        <ul>
          <li 
            v-for="(challenge, index) in completedChallenges" 
            :key="index"
            :class="challenge.completed ? 'completed' : 'skipped'"
          >
            {{ challenge.text }}
            <span class="challenge-status">
              {{ challenge.completed ? '✓' : '↷' }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RomanticDailyChallenge',
  data() {
    return {
      challenges: {
        '09-03-2025': [
          { 
            text: "Ceritakan First Impression dan Berikan 3 Hal Yang Langsung Membuat Kamu Berpikir (Dia Orangnya)",
            category: "Memory Lane",
            difficulty: 1,
            completed: false
          },
          { 
            text: "Upload 1 Foto Pasanganmu di Story Dengan Lagu Apapun",
            category: "Create Memory",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Apresiasi Pasangan Kamu Tentang Apapun Itu",
            category: "Love Language",
            difficulty: 2,
            completed: false
          }
        ],
        '10-03-2025': [
          { 
            text: "Bagikan Minimal 3 Momen Berkesan Kalian",
            category: "Memory Lane",
            difficulty: 1,
            completed: false
          },
          { 
            text: "Rekam Video Singkat Terkait Kegiatan Hari Ini",
            category: "Having Fun",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Diskusikan Keberatan Anda Tentang Hubungan",
            category: "Future Planning",
            difficulty: 4,
            completed: false
          }
        ],
        '11-03-2025': [
          { 
            text: "Buatkan atau kirimkan pasanganmu makanan",
            category: "Bounding",
            difficulty: 4,
            completed: false
          },
          { 
            text: "Kirimkan 5 Foto dan Video kamu hari ini",
            category: "Bounding",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Sebutkan beberapa barang Wishlist kamu",
            category: "Planning",
            difficulty: 2,
            completed: false
          }
        ],
        '12-03-2025': [
          { 
            text: "Develop a secret communication code only you two understand",
            category: "Connection",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Share a detailed timeline of your relationship's most significant moments",
            category: "Memory Lane",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Plan a series of surprise gestures for the upcoming months",
            category: "Acts of Love",
            difficulty: 4,
            completed: false
          }
        ],
        '13-03-2025': [
          { 
            text: "Buat plan budgeting date dengan modal 100k untuk 2 orang",
            category: "Planning",
            difficulty: 4,
            completed: false
          },
          { 
            text: "Tuliskan 5 hal yang ingin kamu lakukan bersama di masa depan",
            category: "Future Memories",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Tulis pesan cinta pendek (maksimal 50 kata) dan kirim via teks atau gambar, lalu baca bersama di call.",
            category: "Bonding",
            difficulty: 2,
            completed: false
          }
        ],
        '14-03-2025': [
          { 
            text: "Buatkan pasanganmu playlist lagu favoritmu",
            category: "Fun",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Buat story apresiasi pasanganmu",
            category: "Word Of Affirmation",
            difficulty: 4,
            completed: false
          },
          { 
            text: "Buat perencanaan evaluasi hubungan dan strategi masa depan",
            category: "Strategic Love",
            difficulty: 4,
            completed: false
          }
        ],
        '15-03-2025': [
          { 
            text: "Develop a secret romantic communication ritual",
            category: "Intimacy",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Create a joint vision board for your shared dreams",
            category: "Future Planning",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Write and exchange letters to your future selves as a couple",
            category: "Reflection",
            difficulty: 4,
            completed: false
          }
        ],
        '16-03-2025': [
          { 
            text: "Compile a comprehensive love language guide for each other",
            category: "Communication",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Create a digital memory book of your relationship's highlights",
            category: "Memory Celebration",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Design a mutual personal and relationship growth plan",
            category: "Personal Development",
            difficulty: 4,
            completed: false
          }
        ]
      },
      completedChallenges: [],
      todayChallenges: [],
      currentIndonesiaTime: null,
      playerStats: {
        totalPoints: 16,
        currentLevel: 1,
        levelInfo: [
        { 
            level: 0, 
            name: "PDKT", 
            minPoints: 0, 
            maxPoints: 10,
            reward: "Kartu Digital Ucapan (Birthday)",
            physicalReward: "Coklat atau permen bebas awa"
          },
          { 
            level: 1, 
            name: "EZ INIMAH BLOM KECINTAAN", 
            minPoints: 11, 
            maxPoints: 25,
            reward: "Kartu Digital Ucapan (Birthday)",
            physicalReward: "Coklat atau permen bebas sayangku"
          },
          { 
            level: 2, 
            name: "Bibit Bibit cingtaah nich<3", 
            minPoints: 26, 
            maxPoints: 50,
            reward: "Nonton Bioskop",
            physicalReward: "Mam Pecel Persaudaraan"
          },
          { 
            level: 3, 
            name: "Mitra Sejati", 
            minPoints: 51, 
            maxPoints: 75,
            reward: "Animasi spesial saat login",
            physicalReward: "Gelang couple atau kaos couple sederhana"
          },
          { 
            level: 4, 
            name: "Legenda Cinta", 
            minPoints: 76, 
            maxPoints: 100,
            reward: "Titel khusus di profile",
            physicalReward: "Dinner voucher atau pengalaman bersama"
          }
        ]
      },
      dailyChallengesStatus: {},
      isMusicPlaying: false,
      startTime: 35,
      isTypingFinished: false,
      fullLyrics: "Just give me one more chance to make it right I may not make it through the night I won't go home without you...<3",
      displayedLyrics: "",
      typingSpeed: 100
    }
  },
  methods: {
    toggleMusic() {
      const audio = this.$refs.bgMusic;
      if (!this.isMusicPlaying) {
        audio.currentTime = this.startTime;
        audio.play();
        this.typeLyrics(); // Mulai efek ketik saat musik diputar
      } else {
        audio.pause();
        this.displayedLyrics = this.fullLyrics; // Tampilkan semua lirik saat pause
        this.isTypingFinished = true;
      }
      this.isMusicPlaying = !this.isMusicPlaying;
    },
    typeLyrics() {
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      this.displayedLyrics = "";
      this.isTypingFinished = false;
      let charIndex = 0;

      this.typingInterval = setInterval(() => {
        if (charIndex < this.fullLyrics.length) {
          this.displayedLyrics += this.fullLyrics[charIndex];
          charIndex++;
        } else {
          clearInterval(this.typingInterval);
          this.typingInterval = null;
          this.isTypingFinished = true;
          setTimeout(() => {
            if (this.isMusicPlaying) this.typeLyrics();
          }, 9000);
        }
      }, this.typingSpeed);
    },
    getIndonesiaTime() {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
      this.currentIndonesiaTime = now
      return now
    },
    setTodayChallenges() {
      const todayKey = this.todayKey
      this.todayChallenges = this.challenges[todayKey] || []
    },
    loadCompletedChallenges() {
      const saved = localStorage.getItem('completedChallenges')
      if (saved) {
        this.completedChallenges = JSON.parse(saved)
      }
    },
    loadPlayerStats() {
      const savedStats = localStorage.getItem('playerStats')
      if (savedStats) {
        this.playerStats = JSON.parse(savedStats)
      }
    },
    savePlayerStats() {
      localStorage.setItem('playerStats', JSON.stringify(this.playerStats))
    },
    updatePlayerPoints(difficulty) {
      // Tambahkan poin sesuai difficulty challenge
      this.playerStats.totalPoints += difficulty
      
      // Update level jika perlu
      this.updatePlayerLevel()
      
      // Simpan stats
      this.savePlayerStats()
    },
    updatePlayerLevel() {
      const currentLevel = this.playerStats.levelInfo.find(
        level => this.playerStats.totalPoints >= level.minPoints && 
                 this.playerStats.totalPoints <= level.maxPoints
      )
      
      if (currentLevel) {
        this.playerStats.currentLevel = currentLevel.level
      }
    },
    completeChallenge(index) {
      if (!this.todayChallenges[index]) return

      const challenge = this.todayChallenges[index]
      
      // Mark challenge as completed
      challenge.completed = true

      // Update player points
      this.updatePlayerPoints(challenge.difficulty)

      // Add to completed challenges
      this.completedChallenges.unshift({
        text: challenge.text,
        completed: true,
        points: challenge.difficulty,
        date: this.getIndonesiaTime().toISOString()
      })
      
      // Save challenges
      this.saveCompletedChallenges()
    },
    saveCompletedChallenges() {
      localStorage.setItem('completedChallenges', JSON.stringify(this.completedChallenges))
    },
    loadDailyChallengesStatus() {
      const saved = localStorage.getItem('dailyChallengesStatus')
      if (saved) {
        this.dailyChallengesStatus = JSON.parse(saved)
      }
    },

    // Metode untuk menyimpan status challenges harian
    saveDailyChallengesStatus() {
      localStorage.setItem('dailyChallengesStatus', JSON.stringify(this.dailyChallengesStatus))
    },

    // Modifikasi metode setTodayChallenges
    setTodayChallenges() {
      const todayKey = this.todayKey
      
      // Cek apakah challenges untuk hari ini sudah pernah dimuat sebelumnya
      const savedDayStatus = this.dailyChallengesStatus[todayKey]
      
      // Ambil challenges untuk hari ini
      let todayChallenges = this.challenges[todayKey] || []
      
      // Jika sudah ada status sebelumnya, gunakan status tersebut
      if (savedDayStatus) {
        todayChallenges = todayChallenges.map(challenge => ({
          ...challenge,
          completed: savedDayStatus[challenge.text] || false
        }))
      }
      
      this.todayChallenges = todayChallenges
    },

    completeChallenge(index) {
      if (!this.todayChallenges[index]) return

      const challenge = this.todayChallenges[index]
      
      // Mark challenge as completed
      challenge.completed = true

      // Update player points hanya jika belum pernah di-complete
      const todayKey = this.todayKey
      
      // Inisialisasi status challenges untuk hari ini jika belum ada
      if (!this.dailyChallengesStatus[todayKey]) {
        this.dailyChallengesStatus[todayKey] = {}
      }

      // Cek apakah challenge sudah pernah diselesaikan sebelumnya
      if (!this.dailyChallengesStatus[todayKey][challenge.text]) {
        // Update player points
        this.updatePlayerPoints(challenge.difficulty)
        
        // Tandai challenge sebagai sudah diselesaikan
        this.dailyChallengesStatus[todayKey][challenge.text] = true
      }

      // Add to completed challenges
      this.completedChallenges.unshift({
        text: challenge.text,
        completed: true,
        points: challenge.difficulty,
        date: this.getIndonesiaTime().toISOString()
      })
      
      // Simpan status challenges
      this.saveDailyChallengesStatus()
      
      // Simpan challenges
      this.saveCompletedChallenges()
    },
  },
  computed: {
    isValidTime() {
      if (!this.currentIndonesiaTime) return false
      const hours = this.currentIndonesiaTime.getHours()
      return hours >= 9 && hours < 21
    },  
    isValidPeriod() {
      if (!this.currentIndonesiaTime) return false
      
      const currentYear = this.currentIndonesiaTime.getFullYear()
      const currentMonth = this.currentIndonesiaTime.getMonth() + 1
      const currentDate = this.currentIndonesiaTime.getDate()
      
      return (currentYear === 2025) && 
             (currentMonth === 3) && 
             (currentDate >= 9 && currentDate <= 16)
    },
    todayKey() {
      if (!this.currentIndonesiaTime) return ''
      const day = String(this.currentIndonesiaTime.getDate()).padStart(2, '0')
      const month = String(this.currentIndonesiaTime.getMonth() + 1).padStart(2, '0')
      const year = this.currentIndonesiaTime.getFullYear()
      return `${day}-${month}-${year}`
    },
    currentLevelInfo() {
      return this.playerStats.levelInfo.find(
        level => this.playerStats.totalPoints >= level.minPoints && 
                 this.playerStats.totalPoints <= level.maxPoints
      ) || this.playerStats.levelInfo[0]
    },
    nextLevelInfo() {
      const currentLevelIndex = this.playerStats.levelInfo.findIndex(
        level => level.level === this.currentLevelInfo.level
      )
      return this.playerStats.levelInfo[currentLevelIndex + 1] || null
    },
    progressToNextLevel() {
      const currentLevel = this.currentLevelInfo
      const nextLevel = this.nextLevelInfo
      
      if (!nextLevel) return 100 // Max level
      
      const totalLevelRange = nextLevel.minPoints - currentLevel.minPoints
      const currentProgress = this.playerStats.totalPoints - currentLevel.minPoints
      
      return Math.min((currentProgress / totalLevelRange) * 100, 100)
    }
  },
  mounted() {
    this.getIndonesiaTime()
    this.$nextTick(() => {
      this.loadCompletedChallenges()
      this.loadPlayerStats()
      this.loadDailyChallengesStatus()
      this.setTodayChallenges()
      this.toggleMusic()
      this.typeLyrics()
    })
  }
}
</script>

<style scoped>
.music-player {
  margin-bottom: 25px;
  text-align: center;
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #ffdde1, #ffebf0); /* Gradien lembut */
  border: 4px solid #ff69b4;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(255, 105, 180, 0.3); /* Bayangan pink */
}

/* Tombol Musik */
.music-btn {
  background-color: #ff69b4;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.music-btn.playing {
  background-color: #ff1493;
  transform: scale(1.05); /* Efek membesar saat diputar */
}

.music-btn:hover {
  background-color: #ff85c1;
  box-shadow: 0 4px 8px rgba(255, 20, 147, 0.4);
}

/* Kontainer Lirik */
.lyrics-display {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px dashed #ff1493; /* Garis putus-putus romantis */
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(255, 20, 147, 0.2);
}

.typing-lyrics {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #ff1493;
  white-space: pre-wrap;
  border-right: 3px solid #ff69b4; 
  animation: blink 0.75s step-end infinite;
}

.finished {
  border-right: none; 
}

@keyframes blink {
  from, to { border-color: transparent; }
  50% { border-color: #ff69b4; }
}

/* Responsivitas */
@media (max-width: 678px) {
  .music-player {
    padding: 15px;
  }
  
  .typing-lyrics {
    font-size: 14px;
  }
  
  .music-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
}

.challenges-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.challenge-item {
  background-color: #ffdde1;
  border: 4px solid #ff69b4;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.challenge-text {
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.challenge-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.challenge-actions {
  text-align: center;
}

.pixel-button {
  position: relative;
  width: 100%;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 50px;
  background-color: #ff1493;
  color: white;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 20, 147, 0.3);
}

.pixel-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent
  );
  transition: all 0.5s ease;
}

.pixel-button:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 6px 8px rgba(255, 20, 147, 0.4),
    0 2px 4px rgba(255, 20, 147, 0.2);
  background-color: #ff69b4;
}

.pixel-button:hover::before {
  left: 100%;
}

.pixel-button:active {
  transform: translateY(1px);
  box-shadow: 
    0 2px 4px rgba(255, 20, 147, 0.2),
    0 1px 2px rgba(255, 20, 147, 0.1);
}

.pixel-button.completed {
  background-color: green;
  cursor: not-allowed;
}

.challenge-inactive {
  background-color: #ffdde1;
  border: 4px solid #ff69b4;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #ff1493;
}

.challenge-title {
  color: black;
  font-size: 1.3rem;
  margin-bottom: 20px;
  text-align: center;
}

.player-stats-container {
  background-color: #ffdde1;
  border: 4px solid #ff69b4;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  text-align: center;
}

.level-badge {
  background-color: #ff1493;
  color: white;
  padding: 10px;
  border-radius: 20px;
  font-size: 16px;
  margin-bottom: 15px;
  display: inline-block;
}

.points-display {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.level-progress {
  background-color: #ffb6c1;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-bar {
  height: 100%;
  background-color: #ff1493;
  transition: width 0.5s ease;
}

.next-level-info {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
}

.next-level-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 678px) {
  .challenge-wrapper {
    padding: 20px;
  }

  .challenge-text {
    font-size: 14px;
  }

  .challenge-details {
    flex-direction: column;
    align-items: center;
  }

  .challenge-category, .challenge-difficulty {
    margin-bottom: 10px;
  }
}
</style>