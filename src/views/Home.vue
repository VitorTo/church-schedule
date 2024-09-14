<template>
	<div>
		<!-- Lista de Meses -->
		<div class="scale-workes-home">
			<div class="page-title mb-4">
				<h1>Escala de Trabalhadores - Igreja</h1>
			</div>

			<div class="row">
				<div v-for="(month, index) in months" :key="index" class="col-md-3 ">
					<div v-if="!canEditMonth(index)" class="flag">

					</div>
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
export default {
	data() {
		return {
			months: [
				{ name: 'Janeiro' }, { name: 'Fevereiro' }, { name: 'Março' }, { name: 'Abril' },
				{ name: 'Maio' }, { name: 'Junho' }, { name: 'Julho' }, { name: 'Agosto' },
				{ name: 'Setembro' }, { name: 'Outubro' }, { name: 'Novembro' }, { name: 'Dezembro' }
			],
			currentMonth: new Date().getMonth(), // Mês atual (0-11)
			currentYear: new Date().getFullYear(),
		};
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