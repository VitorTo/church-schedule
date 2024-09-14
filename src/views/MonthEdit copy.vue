<template>
    <div class="content-scale">
        <div class="page-title mb-4">
            <h1>Escala de Trabalhadores - {{ months[month]?.name }}</h1>
        </div>

        <div class="scale-content-day">

            <div class="row">
                <!-- Sábado -->
                <div class="col-md-6">
                    {{ currentSaturdayIndex }}
                    <div v-if="saturdays.length">
                        <h3>Sábado - {{ formatDate(saturdays[currentSaturdayIndex]) }}</h3>
                        <div v-for="sector in sectors" :key="sector.id" class="mb-2">
                            <label>{{ sector.name }}</label>
                            <el-select v-model="schedule[saturdays[currentSaturdayIndex]][sector.id]" multiple
                                placeholder="Selecione os trabalhadores">
                                <el-option v-for="worker in workers" :key="worker.id" :label="worker.name"
                                    :value="worker.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-6">
                            <button :class="['btn btn-success w-100', currentSaturdayIndex === 0 ?? 'btn-disabled' ]" @click="prevSaturday" :disabled="currentSaturdayIndex === 0">Anterior</button>
                        </div>
                        <div class="col-6">
                            <button :class="['btn btn-success w-100', currentSaturdayIndex === saturdays.length - 1 ?? 'btn-disabled']" @click="nextSaturday" :disabled="currentSaturdayIndex === saturdays.length - 1">Próximo</button>
                        </div>
                    </div>
                </div>

                <!-- Domingo -->
                <div class="col-md-6">
                    {{ currentSundayIndex }}
                    <div v-if="sundays.length">
                        <h3>Domingo - {{ formatDate(sundays[currentSundayIndex]) }}</h3>
                        <div v-for="sector in sectors" :key="sector.id" class="mb-2">
                            <label>{{ sector.name }}</label>
                            <el-select v-model="schedule[sundays[currentSundayIndex]][sector.id]" multiple
                                placeholder="Selecione os trabalhadores">
                                <el-option v-for="worker in workers" :key="worker.id" :label="worker.name"
                                    :value="worker.id"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-6">
                            <button :class="['btn btn-success w-100', currentSundayIndex === 0 ?? 'btn-disabled' ]" @click="prevSunday" :disabled="currentSundayIndex === 0">Anterior</button>
                        </div>
                        <div class="col-6">
                            <button :class="['btn btn-success w-100', currentSundayIndex === sundays.length - 1 ?? 'btn-disabled']" @click="nextSunday" :disabled="currentSundayIndex === sundays.length - 1">Próximo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Botões para Salvar e Limpar -->
        <div class="actions">
            <button @click="saveSchedule">Salvar Escala do Mês</button>
            <button @click="clearSchedule">Limpar Escala Mês</button>
        </div>
    </div>
</template>

<script>
import { ElSelect, ElOption } from 'element-plus'
import { formatDateValue, capitalize } from '../utils/functions.js'

export default {
    name: "MonthEdit",
    components: {
        ElSelect,
        ElOption
    },
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
            currentView: 'saturday',
            currentSaturdayIndex: 0,
            currentSundayIndex: 0,
            month:null
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

        preFormatDate(date) {
            const dateValue = new Date(date);
            const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
            const formatter = new Intl.DateTimeFormat('pt-BR', options);
            const parts = formatter.formatToParts(dateValue);
            const dayOfWeek = parts.find(part => part.type === 'weekday').value;

            return { dayOfWeek, formattedDate: formatDateValue(dateValue, "DD/MM/YYYY") };

        },

        saveDetail() {
            const details = Object.keys(this.schedule).map(date => {
                const { dayOfWeek, formattedDate } = this.preFormatDate(date);
                const scale = this.schedule[date];

                const sectors = this.sectors.map(sector => {
                    const sectorId = sector?.id;
                    const sectorName = sector?.name;

                    const sectorWorkers = this.workers
                        .filter(worker => scale[sectorId]?.includes(worker.id))
                        .map(worker => capitalize(worker.name));

                    if (sectorWorkers?.length > 0) {
                        return {
                            name: sectorName,
                            workers: sectorWorkers
                        };
                    } else {
                        return
                    }
                });

                return {
                    dayOfWeek: capitalize(dayOfWeek),
                    date: formattedDate,
                    sectors: sectors.filter(value => value)
                };
            });

            localStorage.setItem(`month-${this.month}`, JSON.stringify(details));
        },

        saveSchedule() {
            this.saveDetail();

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
        this.month = parseInt(this.$route.params.month);

        // Carregar sábados e domingos
        this.getSaturdaysAndSundays();

        // Tentar carregar a escala salva do localStorage
        const savedSchedule = JSON.parse(localStorage.getItem(`churchSchedule_${this.month}`));
        if (savedSchedule) {
            this.schedule = savedSchedule;
        } else {
            this.initializeSchedule();
        }
    },
    computed: {
        isMonth() {
            return this.month
        }
    }
};
</script>

<style lang="scss">
.content-scale {
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
}
</style>