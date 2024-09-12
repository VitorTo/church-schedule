<template>
  <div>
    <h1>Escala de Trabalhadores - Igreja</h1>

    <!-- Seleção de Sábado e Domingo com Data -->
    <div v-for="(date, index) in saturdaysAndSundays" :key="index">
      <h2>{{ formatDay(date) }} - {{ formatDate(date) }}</h2>
      <div v-for="sector in sectors" :key="sector.id">
        <label>{{ sector.name }}</label>
        <select v-model="schedule[date][sector.id]">
          <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.name }}</option>
        </select>
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
      workers: [
        { id: 1, name: 'Maria' },
        { id: 2, name: 'Vítor' },
        // Adicione mais trabalhadores conforme necessário
      ],
      sectors: [
        { id: 1, name: 'Sensitivo' },
        { id: 2, name: 'Sustentação' },
        { id: 3, name: 'Recepção' },
        { id: 4, name: 'Sam da Água' },
        { id: 4, name: 'Fluidificação' },
        // Adicione mais setores conforme necessário
      ],
      schedule: {},
      saturdaysAndSundays: []
    };
  },
  methods: {
    // Função para calcular os sábados e domingos do mês atual
    getSaturdaysAndSundays() {
      const days = [];
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      // Começar do primeiro dia do mês
      let date = new Date(year, month, 1);

      while (date.getMonth() === month) {
        if (date.getDay() === 6 || date.getDay() === 0) {
          // Se for sábado (6) ou domingo (0)
          days.push(new Date(date)); // Guardar uma cópia da data
        }
        date.setDate(date.getDate() + 1); // Ir para o próximo dia
      }

      this.saturdaysAndSundays = days;
    },

    // Formatar a data para exibição (DD/MM/YYYY)
    formatDate(date) {
      return date.toLocaleDateString();
    },

    // Formatar o dia da semana para exibição
    formatDay(date) {
      const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      return daysOfWeek[date.getDay()];
    },

    // Função para salvar a escala no localStorage
    saveSchedule() {
      localStorage.setItem('churchSchedule', JSON.stringify(this.schedule));
      alert('Escala salva com sucesso!');
    },

    // Função para limpar a escala
    clearSchedule() {
      localStorage.removeItem('churchSchedule');
      alert('Escala limpa!');
      this.schedule = {};
      this.initializeSchedule();
    },

    // Inicializar a escala para os dias de sábado e domingo do mês
    initializeSchedule() {
      this.saturdaysAndSundays.forEach(date => {
        if (!this.schedule[date]) {
          this.schedule[date] = {};
        }
        this.sectors.forEach(sector => {
          if (!this.schedule[date][sector.id]) {
            this.schedule[date][sector.id] = null;
          }
        });
      });
    }
  },
  mounted() {
    // Carregar os sábados e domingos ao montar o componente
    this.getSaturdaysAndSundays();

    // Tentar carregar a escala salva do localStorage
    const savedSchedule = JSON.parse(localStorage.getItem('churchSchedule'));
    if (savedSchedule) {
      this.schedule = savedSchedule;
    } else {
      this.initializeSchedule();
    }
  }
};
</script>

<style>
/* Estilos básicos */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
h2 {
  font-size: 20px;
  margin-top: 20px;
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
