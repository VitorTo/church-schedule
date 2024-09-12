<template>
    <div>
      <h1>Escala de Trabalhadores - {{ months[month].name }}</h1>
      
      <div class="navigation">
        <button @click="currentView = 'saturday'" :disabled="currentView === 'saturday'">Sábados</button>
        <button @click="currentView = 'sunday'" :disabled="currentView === 'sunday'">Domingos</button>
      </div>
      
      <!-- Exibe Sábados ou Domingos -->
      <div v-if="currentView === 'saturday'">
        <h2>Sábados</h2>
        <div v-for="(date, index) in saturdays" :key="index" class="day-container">
          <h3>{{ formatDate(date) }}</h3>
          <div v-for="sector in sectors" :key="sector.id">
            <label>{{ sector.name }}</label>
            <select v-model="schedule[date][sector.id]" multiple>
              <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.name }}</option>
            </select>
          </div>
        </div>
      </div>
  
      <div v-else>
        <h2>Domingos</h2>
        <div v-for="(date, index) in sundays" :key="index" class="day-container">
          <h3>{{ formatDate(date) }}</h3>
          <div v-for="sector in sectors" :key="sector.id">
            <label>{{ sector.name }}</label>
            <select v-model="schedule[date][sector.id]" multiple>
              <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.name }}</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Botão para Salvar -->
      <button @click="saveSchedule">Salvar Escala</button>
  
      <!-- Botão para Limpar o Mês -->
      <button @click="clearSchedule">Limpar Escala</button>
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
        month: null, // O mês selecionado passado pela rota
        workers: [
          { id: 1, name: 'Maria' },
          { id: 2, name: 'Vítor' },
          // Adicione mais trabalhadores conforme necessário
        ],
        sectors: [
          { id: 1, name: 'Sensit' },
          { id: 2, name: 'Sustentação' },
          { id: 3, name: 'Recepção' },
          { id: 4, name: 'Sam da Água' },
          // Adicione mais setores conforme necessário
        ],
        schedule: {},
        saturdays: [],
        sundays: [],
        currentView: 'saturday' // Inicialmente, exibir sábados
      };
    },
    methods: {
      getSaturdaysAndSundays() {
        const saturdays = [];
        const sundays = [];
        const now = new Date();
        const year = now.getFullYear();
  
        let date = new Date(year, this.month, 1);
  
        while (date.getMonth() === this.month) {
          if (date.getDay() === 6) {
            saturdays.push(new Date(date));
          }
          if (date.getDay() === 0) {
            sundays.push(new Date(date));
          }
          date.setDate(date.getDate() + 1);
        }
  
        this.saturdays = saturdays;
        this.sundays = sundays;
      },
  
      formatDate(date) {
        return date.toLocaleDateString();
      },
  
      saveSchedule() {
        localStorage.setItem(`churchSchedule_${this.month}`, JSON.stringify(this.schedule));
        alert('Escala salva com sucesso!');
      },
  
      clearSchedule() {
        localStorage.removeItem(`churchSchedule_${this.month}`);
        alert('Escala limpa!');
        this.schedule = {};
        this.initializeSchedule();
      },
  
      initializeSchedule() {
        [...this.saturdays, ...this.sundays].forEach(date => {
          if (!this.schedule[date]) {
            this.schedule[date] = {};
          }
          this.sectors.forEach(sector => {
            if (!this.schedule[date][sector.id]) {
              this.schedule[date][sector.id] = [];
            }
          });
        });
      }
    },
    mounted() {
      // Obtém o mês atual selecionado
      this.month = this.$route.params.month;
  
      // Carregar sábados e domingos
      this.getSaturdaysAndSundays();
  
      // Tentar carregar a escala salva do localStorage
      const savedSchedule = JSON.parse(localStorage.getItem(`churchSchedule_${this.month}`));
      if (savedSchedule) {
        this.schedule = savedSchedule;
      } else {
        this.initializeSchedule();
      }
    }
  };
  </script>
  
  <style>
  .navigation {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  .day-container {
    margin-bottom: 20px;
  }
  select {
    margin-bottom: 10px;
  }
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #218838;
  }
  </style>
  