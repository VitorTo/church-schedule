<template>
	<div>
		<!-- Lista de Meses -->
		<div class="scale-workes-home">
			<div class="page-title mb-4">
				<h1 class="text-uppercase">Gerenciador de Escala</h1>
			</div>
			
			<hr>

			<div class="row">
				<div class="info-section">
					<span class="">Mês atual:</span>
				</div>
				<div :key="currentMonth" class="col-md-4 ">
					<div class="card w-100 mb-4">
						<div class="card-body">
							<div class="card-content">
								<div class="row">
									<div class="col-3 d-flex align-items-center">
										<div class="d-flex align-items-center">
											<i class="d-flex justify-content-center w-100 rounded-circle p-3 bg-primary text-white fas fa-user-friends"></i>
										</div>
									</div>
									<div class="col-9"> 
										<span>
											Escala de: 
										</span>
										<h2 class="text-uppercase">{{ months[currentMonth].name }}</h2>
									</div>
								</div>
							</div>
						</div>
						<div class="card-footer">
							<div class="row">
								<div class="col-6 mb-2">
									<button class="w-100 btn btn-dark" @click="viewMonth(currentMonth)">
										<i class="fas fa-eye"></i>
										Visualizar
									</button>
								</div>
								<div class="col-6">
									<button 
										:class="['w-100 btn btn-dark', !canEditMonth(currentMonth) ? 'btn-disabled' : '']" 
										@click="editMonth(currentMonth)"
										:disabled="!canEditMonth(currentMonth)"
									>
										<i class="fas fa-edit"></i>
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
					class="w-100 btn btn-dark"
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
							<div class="card-content">
								<div class="row">
									<div class="col-3 d-flex align-items-center">
										<div class="d-flex align-items-center">
											<i class="d-flex justify-content-center w-100 rounded-circle p-3 bg-primary text-white fas fa-user-friends"></i>
										</div>
									</div>
									<div class="col-9"> 
										<span>
											Escala de: 
										</span>
										<h2 class="text-uppercase">{{ month.name }}</h2>
									</div>
								</div>
							</div>
						</div>
						<div class="card-footer">
							<div class="row">
								<div class="col-6 mb-2">
									<button class="w-100 btn btn-dark" @click="viewMonth(index)">
										<i class="fas fa-eye"></i>
										Visualizar
									</button>
								</div>
								<div class="col-6">
									<button 
										:class="['w-100 btn btn-dark', !canEditMonth(index) ? 'btn-disabled' : '']" 
										@click="editMonth(index)"
										:disabled="!canEditMonth(index)"
									>
										<i class="fas fa-edit"></i>
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