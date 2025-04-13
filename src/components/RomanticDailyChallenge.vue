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
      
      <h2 class="challenge-title">Goal: Agar Makin Asik Jeu mwehehehe</h2>
      
      <div v-if="!isValidPeriod" class="challenge-inactive">
        <p>Challenges are only available from 07-04-2025 to 13-04-2025</p>
      </div>
      
      <div v-else class="challenges-content">
        <div 
          v-for="(challenge, index) in weeklyChallenges" 
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
  name: 'RomanticWeeklyChallenge',
  data() {
    return {
      challenges: {
        '14-04-2025': [
          { 
            text: "Bikin JJ berdua terus up di story ig kamu",
            category: "Fun",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Buat video 30 detik ngomong, -I Love You- berulang kali",
            category: "Bonding",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Coba spill salah satu rahasia yang belum pernah kamu kasih tau(mayan poin no tipu-tipu)",
            category: "Trust",
            difficulty: 5,
            completed: false
          },
          { 
            text: "Bagikan 3 momen berkesan yang kamu ingat bebas, lewat line yaa",
            category: "Memory Lane",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Berikan keluh kesah kamu 1 minggu ini (pasti terakhir ini complete nyaa)",
            category: "Future Planning",
            difficulty: 3,
            completed: false
          }
        ]
      },
      completedChallenges: [],
      weeklyChallenges: [],
      currentIndonesiaTime: null,
      playerStats: {
        totalPoints: 26,
        currentLevel: 2,
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
            name: "CINTA MATI TAHAP 1", 
            minPoints: 51, 
            maxPoints: 75,
            reward: "AYCE Kali Yaaa",
            physicalReward: "Apaa yaa masih bingung mwehe"
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
      weeklyChallengesStatus: {},
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
        this.typeLyrics();
      } else {
        audio.pause();
        this.displayedLyrics = this.fullLyrics;
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
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      this.currentIndonesiaTime = now;
      return now;
    },
    setWeeklyChallenges() {
      const weekKey = this.weekKey;
      this.weeklyChallenges = this.challenges[weekKey] || [];
    },
    loadCompletedChallenges() {
      const saved = localStorage.getItem('completedChallenges');
      if (saved) {
        this.completedChallenges = JSON.parse(saved);
      }
    },
    loadPlayerStats() {
      const savedStats = localStorage.getItem('playerStats');
      if (savedStats) {
        this.playerStats = JSON.parse(savedStats);
      }
    },
    savePlayerStats() {
      localStorage.setItem('playerStats', JSON.stringify(this.playerStats));
    },
    updatePlayerPoints(difficulty) {
      this.playerStats.totalPoints += difficulty;
      this.updatePlayerLevel();
      this.savePlayerStats();
    },
    updatePlayerLevel() {
      const currentLevel = this.playerStats.levelInfo.find(
        level => this.playerStats.totalPoints >= level.minPoints && 
                 this.playerStats.totalPoints <= level.maxPoints
      );
      if (currentLevel) {
        this.playerStats.currentLevel = currentLevel.level;
      }
    },
    completeChallenge(index) {
      if (!this.weeklyChallenges[index]) return;
      const challenge = this.weeklyChallenges[index];
      challenge.completed = true;
      const weekKey = this.weekKey;
      if (!this.weeklyChallengesStatus[weekKey]) {
        this.weeklyChallengesStatus[weekKey] = {};
      }
      if (!this.weeklyChallengesStatus[weekKey][challenge.text]) {
        this.updatePlayerPoints(challenge.difficulty);
        this.weeklyChallengesStatus[weekKey][challenge.text] = true;
      }
      this.completedChallenges.unshift({
        text: challenge.text,
        completed: true,
        points: challenge.difficulty,
        date: this.getIndonesiaTime().toISOString()
      });
      this.saveWeeklyChallengesStatus();
      this.saveCompletedChallenges();
    },
    saveCompletedChallenges() {
      localStorage.setItem('completedChallenges', JSON.stringify(this.completedChallenges));
    },
    loadWeeklyChallengesStatus() {
      const saved = localStorage.getItem('weeklyChallengesStatus');
      if (saved) {
        this.weeklyChallengesStatus = JSON.parse(saved);
      }
    },
    saveWeeklyChallengesStatus() {
      localStorage.setItem('weeklyChallengesStatus', JSON.stringify(this.weeklyChallengesStatus));
    },
    setWeeklyChallenges() {
      const weekKey = this.weekKey;
      let weeklyChallenges = this.challenges[weekKey] || [];
      const savedWeekStatus = this.weeklyChallengesStatus[weekKey];
      if (savedWeekStatus) {
        weeklyChallenges = weeklyChallenges.map(challenge => ({
          ...challenge,
          completed: savedWeekStatus[challenge.text] || false
        }));
      }
      this.weeklyChallenges = weeklyChallenges;
    }
  },
  computed: {
    isValidPeriod() {
      if (!this.currentIndonesiaTime) return false;
      const currentYear = this.currentIndonesiaTime.getFullYear();
      const currentMonth = this.currentIndonesiaTime.getMonth() + 1;
      const currentDate = this.currentIndonesiaTime.getDate();
      return (currentYear === 2025) && 
             (currentMonth === 4) && 
             (currentDate >= 7 && currentDate <= 13);
    },
    weekKey() {
      if (!this.currentIndonesiaTime) return '';
      const date = new Date(this.currentIndonesiaTime);
      // Set to Monday of the current week
      const dayOfWeek = date.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      date.setDate(date.getDate() + diff);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    currentLevelInfo() {
      return this.playerStats.levelInfo.find(
        level => this.playerStats.totalPoints >= level.minPoints && 
                 this.playerStats.totalPoints <= level.maxPoints
      ) || this.playerStats.levelInfo[0];
    },
    nextLevelInfo() {
      const currentLevelIndex = this.playerStats.levelInfo.findIndex(
        level => level.level === this.currentLevelInfo.level
      );
      return this.playerStats.levelInfo[currentLevelIndex + 1] || null;
    },
    progressToNextLevel() {
      const currentLevel = this.currentLevelInfo;
      const nextLevel = this.nextLevelInfo;
      if (!nextLevel) return 100;
      const totalLevelRange = nextLevel.minPoints - currentLevel.minPoints;
      const currentProgress = this.playerStats.totalPoints - currentLevel.minPoints;
      return Math.min((currentProgress / totalLevelRange) * 100, 100);
    }
  },
  mounted() {
    this.getIndonesiaTime();
    this.$nextTick(() => {
      this.loadCompletedChallenges();
      this.loadPlayerStats();
      this.loadWeeklyChallengesStatus();
      this.setWeeklyChallenges();
      this.toggleMusic();
      this.typeLyrics();
    });
  }
}
</script>

<style scoped>
/* Same styles as original */
.music-player {
  margin-bottom: 25px;
  text-align: center;
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #ffdde1, #ffebf0);
  border: 4px solid #ff69b4;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(255, 105, 180, 0.3);
}

.music-btn {
  background-color: #ff69b4;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.music-btn.playing {
  background-color: #ff1493;
  transform: scale(1.05);
}

.music-btn:hover {
  background-color: #ff85c1;
  box-shadow: 0 4px 8px rgba(255, 20, 147, 0.4);
}

.lyrics-display {
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px dashed #ff1493;
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