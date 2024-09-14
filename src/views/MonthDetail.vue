<template>
	<div class="container mt-5">

		<!-- <div class="row">
			<div class="col-6">
				<button @click="orderDate()" class="btn btn-success w-100">Organizar por data</button>
			</div>
			<div class="col-6">
				<button @click="revertOrderDate()" class="btn btn-success w-100">Organizar por dias</button>
			</div>
		</div> -->
		<div class="row">
			<div class="col-12">
				<button @click="captureScreen()" class="btn btn-success w-100">Enviar escala WhatsApp</button>
			</div>
		</div>
		<hr>

		<div id="md-scale-content" v-if="days?.length > 0" class="row">
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
import html2canvas from 'html2canvas';

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
		captureScreen() {
			const element = document.getElementById('md-scale-content'); // ou outro elemento da tela
			html2canvas(element).then(canvas => {
				const image = canvas.toDataURL('image/png');
				this.sendToWhatsApp(image);
			});
		},
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
		},
		sendToWhatsApp(imageBase64) {
      		// Aqui você cria um link para enviar pelo WhatsApp Web
			const message = encodeURIComponent('Confira a captura de tela');
			const imageEncoded = encodeURIComponent(imageBase64);
			
			// Abre o WhatsApp Web com a mensagem e o link da imagem (base64 não funciona diretamente no WhatsApp)
			const whatsappUrl = `https://wa.me/?text=${message} - ${imageEncoded}`;
			window.open(whatsappUrl, '_blank');
		}

	}
};
</script>