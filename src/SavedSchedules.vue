<template>
    <div>
      <h1>Escalas Salvas</h1>
      <div v-if="savedSchedules.length === 0">
        <p>Nenhuma escala salva.</p>
      </div>
      <div v-else>
        <div v-for="(schedule, index) in savedSchedules" :key="index" class="schedule-card">
          <h2>{{ months[schedule.month] }}</h2>
          <div class="card">
          </div>
          <button @click="viewSchedule(schedule.month)">Visualizar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        months: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        savedSchedules: []
      };
    },
    methods: {
      loadSavedSchedules() {
        this.savedSchedules = [];
        for (let i = 0; i < 12; i++) {
          const schedule = localStorage.getItem(`churchSchedule_${i}`);
          console.log('schedule', schedule)
          if (schedule) {
            this.savedSchedules.push({ month: i });
          }
        }
      },
    },
    mounted() {
      this.loadSavedSchedules();
    }
  };
  </script>
  
  <style>
  .schedule-card {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  