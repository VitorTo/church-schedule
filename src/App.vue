<template>
    <div>
        <!-- Lista de Meses -->
        <div v-if="!monthEdit" class="view-month">
            <h1>Escala de Trabalhadores - Igreja</h1>
            
            <div class="months-container">
                <div v-for="(month, index) in months" :key="index" class="month-card">
                    <h2>{{ month.name }}</h2>
                    <button @click="viewMonth(index)">Visualizar</button>
                    <button :class="[!canEditMonth(index) ? 'btn-disabled' :'']" @click="editMonth(index)" :disabled="!canEditMonth(index)">Editar</button>
                </div>
            </div>
        </div>

        <div class="month-edit">
            <month-edit 
                v-if="monthEdit" 
                :month="monthEdit"
                @back-month="monthEdit = null"
            ></month-edit>
        </div>

        <!-- <div v-if="!monthEdit" class="saved-schedules">
            <hr>
            <saved-schedules 
            ></saved-schedules>
        </div> -->

    </div>
</template>
  
  <script>
import MonthEdit from './MonthEdit.vue';
import SavedSchedules from './SavedSchedules.vue';

  export default {
    components: { MonthEdit, SavedSchedules },
    data() {
      return {
        monthEdit: null,
        months: [
          { name: 'Janeiro' }, { name: 'Fevereiro' }, { name: 'Março' }, { name: 'Abril' },
          { name: 'Maio' }, { name: 'Junho' }, { name: 'Julho' }, { name: 'Agosto' },
          { name: 'Setembro' }, { name: 'Outubro' }, { name: 'Novembro' }, { name: 'Dezembro' }
        ],
        currentMonth: new Date().getMonth(), // Mês atual (0-11)
      };
    },
    methods: {
      viewMonth(index) {
        // Lógica para visualizar o mês selecionado
        this.$router.push({ name: 'MonthDetail', params: { month: index } });
      },
      editMonth(index) {
        // Lógica para editar o mês selecionado
        // this.$router.push({ name: 'MonthEdit', params: { month: index } });
        this.monthEdit = index
      },
      canEditMonth(index) {
        // Só permitir edição de meses futuros ou o mês atual
        return index >= this.currentMonth;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .months-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .month-card {
      width: 150px;
      padding: 20px;
      margin: 10px;
      border: 1px solid #ccc;
      text-align: center;
    }
    button.btn-disabled {
		background-color: #a3ccad;
	}
	button.btn-disabled:hover {
		background-color: #a3ccad;
	}
  }
  </style>
  