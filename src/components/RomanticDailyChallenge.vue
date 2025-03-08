<template>
  <div class="pixel-challenge-container">
    <div class="challenge-wrapper">
      <div class="pixel-heart-challenge"></div>
      
      <h2 class="challenge-title">Special Period Challenge</h2>
      
      <div v-if="!isValidTime" class="challenge-inactive">
        <p>Challenges are only active between 09:00 - 21:00 WIB</p>
        <p>Current active period: 09-03-2025 to 16-03-2025</p>
      </div>
      
      <div v-else-if="!isValidPeriod" class="challenge-inactive">
        <p>Challenges are only available from 09-03-2025 to 16-03-2025</p>
      </div>
      
      <div v-else class="challenge-content">
        <div class="challenge-text">
          {{ currentChallenge.text }}
        </div>
        
        <div class="challenge-details">
          <div class="challenge-category">
            <span class="pixel-tag">{{ currentChallenge.category }}</span>
          </div>
          
          <div class="challenge-difficulty">
            <span class="pixel-difficulty">
              Difficulty: 
              <span 
                v-for="n in currentChallenge.difficulty" 
                :key="n" 
                class="difficulty-heart"
              >❤️</span>
            </span>
          </div>
        </div>
        
        <div class="challenge-actions">
          <button 
            @click="completeChallenge" 
            class="pixel-button complete-btn"
          >
            Challenge Completed!
          </button>
          
          <button 
            @click="skipChallenge" 
            class="pixel-button skip-btn"
          >
            Skip Today
          </button>
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
        '2025-03-09': { 
          text: "Write a heartfelt love letter to each other today",
          category: "Communication",
          difficulty: 3
        },
        '2025-03-10': { 
          text: "Share your favorite memory together from the past year",
          category: "Connection",
          difficulty: 2
        },
        '2025-03-11': { 
          text: "Cook a meal together without using any electronic devices",
          category: "Quality Time",
          difficulty: 3
        },
        '2025-03-12': { 
          text: "Give each other a 5-minute massage without expecting anything in return",
          category: "Physical Touch",
          difficulty: 2
        },
        '2025-03-13': { 
          text: "Plan a surprise mini-date for your partner",
          category: "Acts of Service",
          difficulty: 4
        },
        '2025-03-14': { 
          text: "Tell each other 3 things you genuinely appreciate about one another",
          category: "Words of Affirmation",
          difficulty: 1
        },
        '2025-03-15': { 
          text: "Create a playlist of songs that remind you of your relationship",
          category: "Emotional Connection",
          difficulty: 2
        },
        '2025-03-16': { 
          text: "Learn something new together (a dance, a recipe, a skill)",
          category: "Growth",
          difficulty: 4
        }
      },
      completedChallenges: [],
      currentChallenge: null
    }
  },
  computed: {
    isValidTime() {
      const now = this.getIndonesiaTime()
      const hours = now.getHours()
      return hours >= 9 && hours < 21
    },
    isValidPeriod() {
      const now = this.getIndonesiaTime()
      const startDate = new Date('2025-03-09')
      const endDate = new Date('2025-03-16')
      return now >= startDate && now <= endDate
    },
    todayKey() {
      const now = this.getIndonesiaTime()
      return now.toISOString().split('T')[0]
    }
  },
  methods: {
    getIndonesiaTime() {
      // Membuat objek Date dengan zona waktu Indonesia Barat (WIB)
      return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    },
    setCurrentChallenge() {
      this.currentChallenge = this.challenges[this.todayKey] || null
    },
    loadCompletedChallenges() {
      const saved = localStorage.getItem('completedChallenges')
      if (saved) {
        this.completedChallenges = JSON.parse(saved)
      }
    },
    completeChallenge() {
      if (!this.currentChallenge) return

      this.completedChallenges.unshift({
        text: this.currentChallenge.text,
        completed: true,
        date: this.getIndonesiaTime().toISOString()
      })
      
      this.saveCompletedChallenges()
    },
    skipChallenge() {
      if (!this.currentChallenge) return

      this.completedChallenges.unshift({
        text: this.currentChallenge.text,
        completed: false,
        date: this.getIndonesiaTime().toISOString()
      })
      
      this.saveCompletedChallenges()
    },
    saveCompletedChallenges() {
      localStorage.setItem('completedChallenges', JSON.stringify(this.completedChallenges))
    }
  },
  mounted() {
    this.loadCompletedChallenges()
    this.setCurrentChallenge()
  }
}
</script>

<style scoped>
/* Styling tetap sama seperti sebelumnya */
.challenge-inactive {
  background-color: #ffdde1;
  border: 4px solid #ff69b4;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  color: #ff1493;
}
</style>