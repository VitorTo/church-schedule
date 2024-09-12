<template>
	<div>
		<h1>Escala de Trabalhadores - {{ months[month].name }}</h1>
		<button @click="$emit('back-month')">Voltar</button>

		<div class="content">
			<!-- Exibe um sábado e um domingo lado a lado -->
			<div class="day-views">
				<!-- Sábado -->
				<div class="day-view">
					<h2>Sábados</h2>
					<button @click="prevSaturday" :disabled="currentSaturdayIndex === 0">Anterior</button>
					<button @click="nextSaturday"
						:disabled="currentSaturdayIndex === saturdays.length - 1">Próximo</button>
					<div v-if="saturdays.length">
						<h3>{{ formatDate(saturdays[currentSaturdayIndex]) }}</h3>
						<div v-for="sector in sectors" :key="sector.id">
							<label>{{ sector.name }}</label>
							<select v-model="schedule[saturdays[currentSaturdayIndex]][sector.id]" multiple>
								<option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.name }}
								</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Domingo -->
				<div class="day-view">
					<h2>Domingos</h2>
					<button @click="prevSunday" :disabled="currentSundayIndex === 0">Anterior</button>
					<button @click="nextSunday" :disabled="currentSundayIndex === sundays.length - 1">Próximo</button>
					<div v-if="sundays.length">
						<h3>{{ formatDate(sundays[currentSundayIndex]) }}</h3>
						<div v-for="sector in sectors" :key="sector.id">
							<label>{{ sector.name }}</label>
							<select v-model="schedule[sundays[currentSundayIndex]][sector.id]" multiple>
								<option v-for="worker in workers" :key="worker.id" :value="worker.id">{{ worker.name }}
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<!-- Botões para Salvar e Limpar -->
			<div class="actions">
				<button @click="saveSchedule">Salvar Escala</button>
				<button @click="clearSchedule">Limpar Escala</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		month: Number
	},
	emits: ['back-month'],
	data() {
		return {
			months: [
				'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
				'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
			],
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
			currentSaturdayIndex: 0,
			currentSundayIndex: 0
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
		},

		prevSaturday() {
			if (this.currentSaturdayIndex > 0) {
				this.currentSaturdayIndex--;
			}
		},

		nextSaturday() {
			if (this.currentSaturdayIndex < this.saturdays.length - 1) {
				this.currentSaturdayIndex++;
			}
		},

		prevSunday() {
			if (this.currentSundayIndex > 0) {
				this.currentSundayIndex--;
			}
		},

		nextSunday() {
			if (this.currentSundayIndex < this.sundays.length - 1) {
				this.currentSundayIndex++;
			}
		}
	},
	mounted() {
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
.content {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.day-views {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.day-view {
  flex: 1;
  margin: 0 10px;
}

.navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.day-container {
  margin-bottom: 20px;
}

select {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.actions button {
  margin: 0 10px;
}
</style>

