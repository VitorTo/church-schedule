<template>
	<div class="container mt-5">

		<div class="row">
			<div class="col-6">
				<button @click="orderDate()" class="btn btn-success w-100">Organizar por data</button>
			</div>
			<div class="col-6">
				<button @click="revertOrderDate()" class="btn btn-success w-100">Organizar por dias</button>
			</div>
		</div>
		<hr>

		<div v-if="days?.length > 0" class="row">
			<div class="col-md-4 mb-4" v-for="(day, index) in days" :key="index">
				<div class="card h-100">
					<div class="card-body">
						<h5 class="card-title">{{ day.dayOfWeek }} - {{ formatDateValue(day.date , "DD/MM/YYYY")}}</h5>
						<div v-if="day.sectors.length > 0" class="sector-and-worker">
							<div v-for="(sector, index) in day.sectors" :key="index">
								<div v-if="sector?.workers?.length > 0" class="values">
									<strong>{{ sector?.name }}:</strong>
									<span>{{ sector?.workers.join(', ') }}</span>
								</div>
							</div>
						</div>
						<div v-else class="not-values">
							Escala ainda não foi feita, click <a class="link link-item" @click="editMonth(day, index)">aqui</a>
							para fazer.
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<p>Nenhum trabalhador encontrado para este mês.</p>
		</div>
	</div>
</template>

<script>
import { formatDateValue } from '../utils/functions.js'

export default {
	name: 'MonthDetail',
	setup() {
		return {
			formatDateValue
		}
	},
	data() {
		return {
			days: [], // Dados que serão carregados do localStorage
			detailsOrigin: []
		};
	},
	mounted() {
		this.loadMonthData();
	},
	methods: {
		editMonth(day, index) {
			const dayType = day?.dayOfWeek === 'Sábado' ? 'saturday' : 'sunday';

			this.$router.push({
				name: 'MonthEdit',
				params: { month: this.$route.params.month },
				query: { [dayType]: day.date }
			});
		},
		loadMonthData() {
			const month = parseInt(this.$route.params.month);
			const monthData = localStorage.getItem(`month-${month}`);

			if (monthData) {
				this.days = JSON.parse(monthData);
				this.detailsOrigin = [...this.days];
			} else {
				this.days = [];
			}
		},
		orderDate() {
			this.days = [...this.days.sort((a, b) => {
				const dateA = new Date(a.date.split('/').reverse().join('-'));
				const dateB = new Date(b.date.split('/').reverse().join('-'));
				return dateA - dateB;
			})];
		},
		revertOrderDate() {
			this.days = [...this.detailsOrigin];
		}

	}
};
</script>