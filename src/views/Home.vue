<template>
	<div>
		<!-- Lista de Meses -->
		<div class="scale-workes-home">
			<div class="page-title mb-4">
				<h1>Gerenciador de Escala - RD</h1>
			</div>
			
			<hr>

			<div class="row">
				<div class="info-section">
					<h4 class="text-uppercase">Mês Atual:</h4>
				</div>
				<div :key="currentMonth" class="col-md-3 ">
					<div class="card w-100 mb-4">
						<div class="card-body">
							<h2 class="card-title text-center text-uppercase">{{ months[currentMonth].name }}</h2>
						</div>
						<div class="card-footer">
							<div class="row">
								<div class="col-md-6 mb-2">
									<button class="w-100 btn btn-success" @click="viewMonth(currentMonth)">Visualizar</button>
								</div>
								<div class="col-md-6">
									<button 
										:class="['w-100 btn btn-success', !canEditMonth(currentMonth) ? 'btn-disabled' : '']" 
										@click="editMonth(currentMonth)"
										:disabled="!canEditMonth(currentMonth)"
									>
										Editar
									</button>
								</div>
							</div>							
						</div>
					</div>
				</div>
			</div>

			<hr>
			<div class="col-md-6 actions mb-4">
				<button
					@click="showAllMonths = !showAllMonths"
					class="w-100 btn btn-success"
				>
					{{ !showAllMonths ? 'Visualizar Todos os meses' : 'Esconder meses' }}
				</button>
			</div>
			
			<div
				v-if="showAllMonths" 
				class="row"
			>
				<div v-for="(month, index) in months" :key="index" class="col-md-3 ">
					<div class="card w-100 mb-4">
						<div class="card-body">
							<h2 class="card-title text-center">{{ month.name }}</h2>
						</div>
						<div class="card-footer">
							<div class="row">
								<div class="col-md-6 mb-2">
									<button class="w-100 btn btn-success" @click="viewMonth(index)">Visualizar</button>
								</div>
								<div class="col-md-6">
									<button 
										:class="['w-100 btn btn-success', !canEditMonth(index) ? 'btn-disabled' : '']" 
										@click="editMonth(index)"
										:disabled="!canEditMonth(index)"
									>
										Editar
									</button>
								</div>
							</div>							
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import { isMobile } from '../utils/functions.js'

export default {
	data() {
		return {
			months: [
				{ name: 'Janeiro' }, { name: 'Fevereiro' }, { name: 'Março' }, { name: 'Abril' },
				{ name: 'Maio' }, { name: 'Junho' }, { name: 'Julho' }, { name: 'Agosto' },
				{ name: 'Setembro' }, { name: 'Outubro' }, { name: 'Novembro' }, { name: 'Dezembro' }
			],
			showAllMonths: false,
			currentMonth: new Date().getMonth(), // Mês atual (0-11)
			currentYear: new Date().getFullYear(),
		};
	},
	mounted() {
		this.showAllMonths = !this.isViewMobile
	},
	methods: {
		viewMonth(index) {
			// Lógica para visualizar o mês selecionado
			this.$router.push({ name: 'MonthDetail', params: { month: index } });
		},
		editMonth(index) {
			// Lógica para editar o mês selecionado
			this.$router.push({ name: 'MonthEdit', params: { month: index } });
		},
		canEditMonth(index) {
			// Só permitir edição de meses futuros ou o mês atual
			return index >= this.currentMonth;
		},
	},
	computed: {
		isViewMobile() {
			return isMobile()
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