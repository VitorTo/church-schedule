<template>
	<div class="scale-workes-detail">
        <div class="page-title mb-2 row">
            <div class="col-4 fs-6">
                <button 
                    class="w-100 btn btn-dark" 
                    @click="backToHome()"
                >
                    <i class="fas fa-arrow-left me-1"></i>
                    Voltar
                </button>
            </div>
            <div class="col-10 mt-2">
                <h1>Escala de {{ months[month] }}</h1> 
            </div>
        </div>
        <hr class="mt-0">
		<div class="row">
			<div class="col-12">
				<button ref="btnShared" @click="captureScreen()" class="btn btn-dark w-100">Enviar escala WhatsApp <i class="fab fa-whatsapp ms-1"></i></button>
			</div>
		</div>
		<hr>
		<div ref="mdScaleContent" v-if="days?.length > 0" class="row pt-2">
			<div class="col-md-4 mb-4" v-for="(day, index) in days" :key="index">
				<div class="card h-100">
					<div class="card-body">
						<h5 class="card-title text-uppercase">{{ day.dayOfWeek }} - {{ formatDateValue(day.date , "DD/MM/YYYY")}}</h5>
						<div v-if="day.sectors.length > 0" class="sector-and-worker">
							<div v-for="(sector, index) in day.sectors" :key="index">
								<div v-if="sector?.workers?.length > 0" class="values">
									<strong class="text-uppercase">{{ sector?.name }}: </strong>
									<span class="text-uppercase ms-1">{{ sector?.workers.join(', ') }}</span>
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
		
        <el-dialog 
			v-model="showDialogSave" 
			title="Escala copiada com sucesso!" 
			width="330"
		>
            <span>
                Para compartilhar, abra o whatsapp e cole a imagem
            </span>
            <template #footer>
            <div class="dialog-footer">
                <div class="row">
                    <div class="col-4">
                        <button class="w-100 btn btn-secondary" @click="showDialogSave = false">Fechar</button>
                    </div>
                    <div class="col">
                        <button class="w-100 btn btn-success" @click="openSharedWhatsApp(currentDayIndex)">
                            Abrir WhatsApp <i class="fab fa-whatsapp ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
            </template>
        </el-dialog>
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
			showDialogSave: false,
			months: [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ],
			days: [], // Dados que serão carregados do localStorage
			detailsOrigin: [],
			month: null
		};
	},
	mounted() {
		this.loadMonthData();	
		this.month = this.$route.params.month;

	},
	methods: {
		backToHome() {
			this.$router.push({ name: 'Home' });
		},
		captureScreen() {
			const element = this.$refs.mdScaleContent;
			html2canvas(element).then(canvas => {
				canvas.toBlob(blob => {
					if (navigator.clipboard) {
						const item = new ClipboardItem({ 'image/png': blob });
						navigator.clipboard.write([item]).then(() => {
							this.showDialogSave = true
						}).catch(err => {
							console.error('Erro ao copiar a imagem: ', err);
						});
					} else {
						alert('A API de Clipboard não é suportada pelo navegador.');
					}
				});
			});
		},
		b64toBlob(b64Data, contentType='', sliceSize=512)  {
			const byteCharacters = atob(b64Data);
			const byteArrays = [];

			for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				const slice = byteCharacters.slice(offset, offset + sliceSize);

				const byteNumbers = new Array(slice.length);
				for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
				}

				const byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}
				
			const blob = new Blob(byteArrays, {type: contentType});
			return blob;
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
		openSharedWhatsApp() {
			const whatsappUrl = `https://wa.me/`;
			window.open(whatsappUrl, '_blank');
		}

	}
};
</script>