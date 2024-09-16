<template>
    <div class="content-scale">
        <div class="page-title mb-4">
            <!-- <h1>Escala de Trabalhadores - {{ months[month]?.name }}</h1> -->
        </div>

        <div class="scale-content-day">
            <div 
                v-if="!isQuerySunday && !isQuerySaturday"
                class="row mb-4"
            >
                <div class="col-6">
                    <button 
                        @click="tab = 'isSaturday'"
                        class="w-100 btn btn-success"
                        :disabled="tab == 'isSaturday'"
                    >
                        VER SÁBADOS
                    </button>
                </div>
                <div class="col-6">
                    <button 
                        @click="tab = 'isSunday'"
                        class="w-100 btn btn-success"
                        :disabled="tab == 'isSunday'"
                    >
                        VER DOMINGOS
                    </button>
                </div>
            </div>

            <div class="row">
                <!-- Sábado -->
                <div 
                    v-if="tab == 'isSaturday' && !isQuerySunday" 
                    :class="[isQuerySaturday? 'col-md-12 mb-4' : 'col-md-6']"
                >
                    <div :class="['w-100 card p-3 border', isQuerySaturday ? 'border-success':'border-secondary']">
                        <div v-if="saturdays.length">
                            <h3>Sábado - {{ formatDate(saturdays[currentSaturdayIndex]) }}</h3>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="w-100 btn-group btn-group-sm" role="group" aria-label="Default button group">
                                        <button type="button" class="btn btn-success" @click="prevSaturday" :disabled="currentSaturdayIndex === 0">Anterior</button>
                                        <button type="button" class="btn btn-success" @click="nextSaturday" :disabled="currentSaturdayIndex === saturdays.length - 1">Próximo</button>
                                    </div>
                                </div>
                            </div>
                            <hr>
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
                            <div class="col-md-6">
                                <div class="w-100 btn-group" role="group" aria-label="Default button group">
                                    <button class="btn btn-success" @click="saveScheduleIndex(schedule[saturdays[currentSaturdayIndex]], saturdays[currentSaturdayIndex])">Salvar escala</button>
                                    <button class="btn btn-success" @click="clearScheduleIndex(saturdays[currentSaturdayIndex])">Limpar escala</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Domingo -->
                <div 
                    v-if="tab == 'isSunday' && !isQuerySaturday" 
                    :class="[isQuerySunday? 'col-md-12' : 'col-md-6']"
                >            
                    <div :class="['w-100 card p-3 border', isQuerySunday ? 'border-success':'border-secondary']">            
                        <div v-if="sundays.length">
                            <h3>Domingo - {{ formatDate(sundays[currentSundayIndex]) }}</h3>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="w-100 btn-group btn-group-sm" role="group" aria-label="Default button group">
                                        <button class="btn btn-success" @click="prevSunday" :disabled="currentSundayIndex === 0">Anterior</button>
                                        <button class="btn btn-success" @click="nextSunday" :disabled="currentSundayIndex === sundays.length - 1">Próximo</button>
                                    </div>
                                </div>
                            </div>
                            <hr>
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
                            <div class="col-md-6">
                                <div class="w-100 btn-group" role="group" aria-label="Default button group">
                                    <button class="btn btn-success" @click="saveScheduleIndex(schedule[sundays[currentSundayIndex]], sundays[currentSundayIndex])">Salvar</button>
                                    <button class="btn btn-success" @click="clearScheduleIndex(sundays[currentSundayIndex])">Limpar </button>
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
import { ElSelect, ElOption } from 'element-plus'
import { capitalize } from '../utils/functions.js'

export default {
    name: "MonthEdit",
    components: {
        ElSelect,
        ElOption
    },
    data() {
        return {
            tab: "isSaturday",
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
            return date?.toLocaleDateString();
        },

        preFormatDate(date) {
            const dateValue = new Date(date);
            const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
            const formatter = new Intl.DateTimeFormat('pt-BR', options);
            const parts = formatter.formatToParts(dateValue);
            const dayOfWeek = parts.find(part => part.type === 'weekday').value;

            return { dayOfWeek, formattedDate: dateValue };

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

        saveScheduleIndex(value, index) {
            this.schedule[index] = value;
            this.saveSchedule()
        },
        clearScheduleIndex(index) {
            this.schedule[index] = {};
            this.saveSchedule()
        },

        saveSchedule() {
            this.saveDetail()

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
                this.currentSundayIndex = 1+ this.currentSundayIndex;
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

        this.$nextTick(() => {
            if(this.isQuerySaturday || this.isQuerySunday) {
                console.log('else', this.$route.query )
                const currentDay = this.isQuerySaturday ? 'saturday' : 'sunday';
                this.tab = `is${capitalize(currentDay)}`;

                const dateIndex = new Date(this.$route.query[currentDay]).getTime();
                const currentIndex = this[`${currentDay}s`].findIndex(day => day.getTime() === dateIndex);
                const indexOf = `current${capitalize(currentDay)}Index`;
                this[indexOf] = currentIndex > 0 ? currentIndex : 0
            }
        })
    },
    computed: {
        isMonth() {
            return this.month
        },
        isQuerySaturday() {
            return this.$route.query.saturday != null 
        },
        isQuerySunday() {
            return this.$route.query.sunday != null
        }
    }
};
</script>
