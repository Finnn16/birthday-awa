<template>
  <div class="pixel-challenge-container">
    <div class="challenge-wrapper">
      <div class="pixel-heart-challenge"></div>
      
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
            text: "Share your top 3 personal growth moments from the past year",
            category: "Reflection",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Create a collaborative playlist representing your relationship journey",
            category: "Emotional Connection",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Write and exchange future dream scenarios for your relationship",
            category: "Future Planning",
            difficulty: 4,
            completed: false
          }
        ],
        '11-03-2025': [
          { 
            text: "Make a video compilation of your most cherished moments together",
            category: "Memory Celebration",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Exchange handwritten love notes with hidden meaningful symbols",
            category: "Intimacy",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Create a joint bucket list for the next year of your relationship",
            category: "Future Goals",
            difficulty: 4,
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
            text: "Write a comprehensive love story about your relationship",
            category: "Communication",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Create a digital time capsule of your current feelings and dreams",
            category: "Future Memories",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Design a personalized relationship growth challenge for each other",
            category: "Personal Development",
            difficulty: 4,
            completed: false
          }
        ],
        '14-03-2025': [
          { 
            text: "Craft a mutual appreciation letter highlighting each other's strengths",
            category: "Words of Affirmation",
            difficulty: 3,
            completed: false
          },
          { 
            text: "Create a visual representation of your emotional connection",
            category: "Emotional Intimacy",
            difficulty: 2,
            completed: false
          },
          { 
            text: "Plan a comprehensive relationship review and future strategy",
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
      currentIndonesiaTime: null
    }
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
    }
  },
  methods: {
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
    completeChallenge(index) {
      if (!this.todayChallenges[index]) return

      this.todayChallenges[index].completed = true

      this.completedChallenges.unshift({
        text: this.todayChallenges[index].text,
        completed: true,
        date: this.getIndonesiaTime().toISOString()
      })
      
      this.saveCompletedChallenges()
    },
    saveCompletedChallenges() {
      localStorage.setItem('completedChallenges', JSON.stringify(this.completedChallenges))
    }
  },
  mounted() {
    this.getIndonesiaTime()
    this.$nextTick(() => {
      this.loadCompletedChallenges()
      this.setTodayChallenges()
    })
  }
}
</script>

<style scoped>
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