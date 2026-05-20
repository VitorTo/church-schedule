<template>
  <div class="pb-5 bg-background-custom min-vh-100 font-public-sans">
    <!-- ================= EDIT VIEW ================= -->
    <div v-if="!isReviewing">
      <!-- TopAppBar -->
      <header
        class="fixed-top d-flex align-items-center bg-white border-bottom border-2 border-outline-variant"
        style="height: 64px; padding: 0 2rem; z-index: 1030"
      >
        <button
          class="btn btn-link p-2 text-primary-custom btn-scale-active border-0 d-flex align-items-center justify-content-center me-2 text-decoration-none"
          @click="backToDetail()"
        >
          <span class="material-symbols-outlined fs-2">arrow_back</span>
        </button>
        <h1
          class="font-public-sans font-bold fs-5 tracking-tight text-primary-custom m-0"
        >
          Montar Escalas
        </h1>
      </header>

      <main
        class="mx-auto px-3"
        style="max-width: 600px; padding-top: 5.5rem; padding-bottom: 9rem"
      >
        <!-- Empty State if no editable days -->
        <div v-if="allDays.length === 0" class="text-center py-5">
          <span
            class="material-symbols-outlined text-outline mb-3"
            style="font-size: 64px"
            >event_busy</span
          >
          <h2 class="font-headline-md text-on-surface mb-2">
            Nenhum dia disponível
          </h2>
          <p class="font-body-md text-on-surface-variant">
            Todos os dias de escala deste mês já passaram.
          </p>
        </div>

        <div v-else>
          <!-- Date Headline -->
          <header class="mb-4 text-center">
            <h2 class="font-headline-lg text-primary-custom mb-2">
              {{ formatLongDate(currentDate) }}
            </h2>
            <div
              class="bg-primary-container-custom mx-auto rounded-pill"
              style="height: 4px; width: 80px"
            ></div>
          </header>

          <!-- Pagination Bar (if editing the whole month) -->
          <div
            v-if="isEditCurrentDay"
            class="d-flex justify-content-between align-items-center mb-4 bg-surface-lowest p-3 border border-2 border-outline-variant rounded-xl-custom shadow-sm"
            style="height: 56px"
          >
            <button
              @click="prevDay"
              :disabled="currentDayIndex === 0"
              class="btn btn-link border-0 text-on-surface d-flex align-items-center justify-content-center text-decoration-none btn-scale-active py-2 px-3"
              :class="{ 'opacity-50': currentDayIndex === 0 }"
            >
              <span class="material-symbols-outlined me-1">chevron_left</span>
              <span class="font-label-lg" style="font-size: 15px"
                >Voltar Dia</span
              >
            </button>

            <span
              class="font-label-lg text-on-surface-variant"
              style="font-size: 15px"
            >
              Dia {{ currentDayIndex + 1 }} de {{ allDays.length }}
            </span>

            <button
              @click="nextDay"
              :disabled="currentDayIndex === allDays.length - 1"
              class="btn btn-link border-0 text-on-surface d-flex align-items-center justify-content-center text-decoration-none btn-scale-active py-2 px-3"
              :class="{ 'opacity-50': currentDayIndex === allDays.length - 1 }"
            >
              <span class="font-label-lg" style="font-size: 15px"
                >Próximo Dia</span
              >
              <span class="material-symbols-outlined ms-1">chevron_right</span>
            </button>
          </div>

          <!-- Vertical Stack of Selection Fields -->
          <div class="d-flex flex-column gap-3 mb-4">
            <div
              v-for="sector in sectors"
              :key="sector.id"
              class="d-flex flex-column gap-2 position-relative custom-dropdown-container"
            >
              <label
                class="font-label-lg text-on-surface-variant ml-1"
                style="font-size: 15px; margin-left: 4px; margin-bottom: -2px"
                >{{ sector.name }}</label
              >

              <button
                @click="toggleDropdown(sector.id)"
                class="w-100 px-4 d-flex align-items-center justify-content-between bg-white border border-2 border-outline-variant rounded-xl-custom btn-scale-active text-start transition-colors-custom"
                :class="{
                  'border-primary-custom': activeDropdownSectorId === sector.id,
                }"
                type="button"
              >
                <span
                  class="font-body-lg text-on-surface text-truncate pe-2"
                  style="font-size: 16px"
                >
                  {{
                    getSelectedWorkersNames(sector.id) ||
                    "Toque para escolher..."
                  }}
                </span>
                <span
                  class="material-symbols-outlined text-primary-custom"
                  style="transition: transform 0.2s"
                  :style="
                    activeDropdownSectorId === sector.id
                      ? 'transform: rotate(180deg);'
                      : ''
                  "
                >
                  expand_more
                </span>
              </button>

              <!-- Custom Dropdown Panel -->
              <div
                v-if="activeDropdownSectorId === sector.id"
                class="custom-dropdown-panel animate-dropdown"
              >
                <!-- Search Input -->
                <div class="position-relative mb-3">
                  <span
                    class="material-symbols-outlined position-absolute text-on-surface-variant"
                    style="left: 12px; top: 10px; font-size: 20px"
                    >search</span
                  >
                  <input
                    v-model="workerSearchQuery"
                    type="text"
                    placeholder="Procurar por nome..."
                    class="w-100 border rounded-lg-custom text-on-surface font-body-md"
                    style="
                      padding-left: 40px;
                      padding-right: 16px;
                      border-color: var(--color-outline-variant);
                    "
                  />
                </div>

                <!-- Workers Checklist -->
                <div
                  class="d-flex flex-column gap-1 overflow-y-auto pr-1"
                  style="max-height: 180px"
                >
                  <label
                    v-for="worker in filteredWorkers"
                    :key="worker.id"
                    class="custom-dropdown-item"
                    :class="{
                      selected: isWorkerSelected(sector.id, worker.id),
                    }"
                  >
                    <span class="font-body-md" style="font-size: 16px">{{
                      worker.name
                    }}</span>
                    <input
                      type="checkbox"
                      :checked="isWorkerSelected(sector.id, worker.id)"
                      @change="toggleWorkerSelection(sector.id, worker.id)"
                      class="form-check-input"
                      style="
                        width: 20px;
                        height: 20px;
                        border-color: var(--color-outline-variant);
                      "
                    />
                  </label>
                </div>

                <!-- Dropdown Footer -->
                <div
                  class="d-flex justify-content-between align-items-center border-t border-outline-variant pt-2 mt-2"
                >
                  <span
                    class="text-xs text-on-surface-variant font-label-lg"
                    style="font-size: 13px"
                  >
                    {{ getSelectedWorkersCount(sector.id) }} escolhido(s)
                  </span>
                  <button
                    @click="activeDropdownSectorId = null"
                    class="px-3 py-1 bg-primary-custom text-white border-0 font-label-lg rounded-lg-custom btn-scale-active d-flex align-items-center justify-content-center"
                    style="font-size: 14px; height: 32px !important"
                    type="button"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>

            <!-- Clear Day Schedule Button -->
            <button
              class="w-100 border border-2 border-danger text-danger rounded-xl-custom font-label-lg bg-transparent btn-scale-active mt-3 d-flex align-items-center justify-content-center gap-2"
              @click="clearCurrentDaySchedule()"
            >
              <span class="material-symbols-outlined">delete</span>
              <span>Apagar Nomes Deste Dia</span>
            </button>
          </div>
        </div>
      </main>

      <!-- Fixed Action Bottom Bar -->
      <div
        class="fixed-bottom bg-white border-t border-2 border-outline-variant p-3"
        style="z-index: 1020"
      >
        <div class="mx-auto d-flex flex-column gap-2" style="max-width: 600px">
          <button
            v-if="allDays.length > 0"
            class="w-100 bg-primary-custom text-white border-0 font-button-text rounded-xl-custom shadow btn-scale-active d-flex align-items-center justify-content-center gap-2 h-50px-important"
            @click="goToReview()"
          >
            <span class="material-symbols-outlined">check_circle</span>
            <span>Salvar Escala</span>
          </button>
          <button
            class="w-100 bg-surface-highest text-on-surface border border-2 border-outline-variant font-button-text rounded-xl-custom btn-scale-active d-flex align-items-center justify-content-center gap-2 h-50px-important"
            @click="backToDetail()"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Voltar</span>
          </button>
        </div>
        <div class="pb-safe"></div>
      </div>
    </div>

    <!-- ================= REVIEW VIEW ================= -->
    <div v-else>
      <!-- TopAppBar -->
      <header
        class="fixed-top d-flex align-items-center bg-white border-bottom border-2 border-outline-variant"
        style="height: 64px; padding: 0 2rem; z-index: 1030"
      >
        <button
          class="btn btn-link p-2 text-primary-custom btn-scale-active border-0 d-flex align-items-center justify-content-center me-2 text-decoration-none"
          @click="isReviewing = false"
        >
          <span class="material-symbols-outlined fs-2">arrow_back</span>
        </button>
        <h1
          class="font-public-sans font-bold fs-5 tracking-tight text-primary-custom m-0"
        >
          Montar Escalas
        </h1>
      </header>

      <main
        class="mx-auto px-3"
        style="max-width: 600px; padding-top: 5.5rem; padding-bottom: 9rem"
      >
        <!-- Context Header -->
        <section class="text-center mb-4">
          <h2 class="font-headline-lg text-on-surface mb-2">
            Revisar Nomes Escala
          </h2>
          <p class="font-body-lg text-on-surface-variant">
            Veja se os nomes estão corretos antes de salvar
          </p>
        </section>

        <!-- Revision "Receipt" Card -->
        <div
          class="bg-white border border-2 border-outline-variant rounded-xl-custom overflow-hidden shadow-sm d-flex flex-column mb-4"
        >
          <!-- Date Header -->
          <div
            class="bg-surface-low p-4 border-bottom border-2 border-outline-variant text-center"
          >
            <span
              class="material-symbols-outlined text-primary-custom mb-2 text-4xl"
              style="
                font-variation-settings: &quot;FILL&quot; 1;
                font-size: 36px;
              "
              >calendar_today</span
            >
            <h3
              class="font-headline-md text-on-surface m-0"
              style="font-size: 20px"
            >
              {{ formatLongDate(currentDate) }}
            </h3>
          </div>

          <!-- Roles List -->
          <div class="p-4 d-flex flex-column gap-4 bg-white">
            <!-- Display only filled roles -->
            <div v-for="sector in sectors" :key="sector.id">
              <div
                v-if="getSelectedWorkersCount(sector.id) > 0"
                class="d-flex flex-column gap-1 border-bottom border-dashed border-outline-variant pb-3 last:border-b-0 last:pb-0"
              >
                <span
                  class="font-label-lg text-on-surface-variant text-uppercase tracking-widest"
                  style="font-size: 12px"
                  >{{ sector.name }}</span
                >
                <span
                  class="font-headline-md text-on-surface m-0 text-uppercase"
                  style="font-size: 18px; font-weight: 600"
                  >{{ getSelectedWorkersNames(sector.id) }}</span
                >
              </div>
            </div>

            <!-- Fallback if no roles filled -->
            <div
              v-if="filledSectorsCount === 0"
              class="text-center py-4 text-on-surface-variant font-body-md"
            >
              Nenhum nome preenchido para este dia.
            </div>
          </div>

          <!-- Footer/Total indicator -->
          <div
            class="bg-surface-highest p-3 d-flex justify-content-between align-items-center px-4"
            style="height: 56px"
          >
            <span
              class="font-label-lg text-on-surface-variant"
              style="font-size: 15px"
              >Trabalhadores Escalados</span
            >
            <span
              class="font-headline-md text-primary-custom m-0"
              style="font-size: 18px"
              >{{ filledSectorsCount }} preenchido(s)</span
            >
          </div>
        </div>

        <!-- Action Area -->
        <div class="d-flex flex-column gap-3">
          <button
            class="w-100 bg-primary-custom text-white border-0 font-button-text rounded-xl-custom shadow btn-scale-active d-flex align-items-center justify-content-center gap-2"
            @click="saveCurrentDaySchedule()"
          >
            <span class="material-symbols-outlined">check_circle</span>
            <span>Tudo Certo, Salvar!</span>
          </button>
          <button
            class="w-100 bg-surface-container-custom text-on-surface-variant border border-2 border-outline-variant font-button-text rounded-xl-custom btn-scale-active d-flex align-items-center justify-content-center gap-2"
            @click="isReviewing = false"
          >
            <span class="material-symbols-outlined">edit</span>
            <span>Corrigir Nomes</span>
          </button>
        </div>
      </main>
    </div>

    <!-- Success Modal Overlay -->
    <div
      v-if="showDialogSave"
      class="fixed-top min-vh-100 w-100 d-flex align-items-center justify-content-center p-3"
      style="
        background-color: rgba(26, 27, 34, 0.6);
        backdrop-filter: blur(4px);
        z-index: 1060;
      "
    >
      <div
        class="bg-white rounded-xl-custom w-100 shadow-lg p-4"
        style="max-width: 360px"
      >
        <div class="text-center d-flex flex-column align-items-center gap-3">
          <div
            class="rounded-circle bg-primary-container-custom d-flex align-items-center justify-content-center"
            style="width: 80px; height: 80px"
          >
            <span
              class="material-symbols-outlined text-success text-primary-custom"
              style="
                font-size: 48px;
                font-variation-settings: &quot;FILL&quot; 1;
              "
              >check_circle</span
            >
          </div>
          <h2
            class="font-headline-md text-on-surface m-0"
            style="font-size: 22px"
          >
            Escala Salva com Sucesso!
          </h2>
          <p
            class="font-body-md text-on-surface-variant m-0"
            style="font-size: 16px"
          >
            Quer enviar essa escala agora pelo WhatsApp?
          </p>

          <div class="d-flex flex-column w-100 gap-2 mt-3">
            <button
              class="w-100 py-3 border-0 text-white rounded-xl-custom font-button-text d-flex align-items-center justify-content-center gap-2 btn-scale-active"
              style="background-color: #25d366; font-size: 18px"
              @click="sharedToWhatsApp()"
            >
              <span class="material-symbols-outlined">share</span>
              <span>Sim, enviar no WhatsApp</span>
            </button>
            <button
              class="w-100 py-3 border-0 bg-surface-container-custom text-on-surface-variant rounded-xl-custom font-button-text btn-scale-active"
              style="font-size: 18px"
              @click="closeSuccessModal()"
            >
              Não, voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { capitalize, getWorkers } from "../utils/functions.js";

export default {
  name: "MonthEdit",
  data() {
    return {
      showDialogSave: false,
      isReviewing: false,
      activeDropdownSectorId: null,
      workerSearchQuery: "",
      months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      workers: [], // Carregado dinamicamente
      sectors: [
        { id: 1, name: "Sensitivo" },
        { id: 2, name: "Sustentação" },
        { id: 3, name: "Fluidificação das Águas" },
        { id: 4, name: "Ave Maria" },
        { id: 5, name: "Samaritana" },
        { id: 6, name: "Samaritana da Água" },
        { id: 7, name: "Recepção" },
        { id: 8, name: "Fila" },
        { id: 9, name: "Segurança" },
        { id: 10, name: "Coordenadora" },
        { id: 11, name: "Sonoplastia" },
      ],
      schedule: {},
      saturdays: [],
      sundays: [],
      allDays: [],
      currentDayIndex: 0,
      month: null,
    };
  },
  computed: {
    isEditCurrentDay() {
      return !this.$route.query.sunday && !this.$route.query.saturday;
    },
    currentDate() {
      return this.allDays[this.currentDayIndex];
    },
    filteredWorkers() {
      if (!this.workerSearchQuery) return this.workers;
      const query = this.workerSearchQuery.toLowerCase();
      return this.workers.filter((w) => w.name.toLowerCase().includes(query));
    },
    filledSectorsCount() {
      const date = this.currentDate;
      if (!date || !this.schedule[date]) return 0;
      let count = 0;
      this.sectors.forEach((sector) => {
        if (this.schedule[date][sector.id]?.length > 0) {
          count++;
        }
      });
      return count;
    },
  },
  mounted() {
    this.month = parseInt(this.$route.params.month);
    this.workers = getWorkers(); // Carrega os trabalhadores cadastrados dinamicamente

    // Carregar sábados e domingos
    this.getSaturdaysAndSundays();

    // Tentar carregar a escala salva do localStorage
    const savedSchedule = JSON.parse(
      localStorage.getItem(`churchSchedule_${this.month}`),
    );
    if (savedSchedule) {
      this.schedule = savedSchedule;
    } else {
      this.initializeSchedule();
    }

    // Definir índice ativo baseado no query params ou iniciar no primeiro dia
    this.$nextTick(() => {
      const saturdayQuery = this.$route.query.saturday;
      const sundayQuery = this.$route.query.sunday;
      if (saturdayQuery || sundayQuery) {
        const queryDate = saturdayQuery || sundayQuery;
        const dateVal = new Date(queryDate);
        const targetTime = dateVal.getTime();

        const idx = this.allDays.findIndex(
          (day) => day.getTime() === targetTime,
        );
        if (idx !== -1) {
          this.currentDayIndex = idx;
        } else {
          const targetStr = dateVal.toLocaleDateString();
          const idxStr = this.allDays.findIndex(
            (day) => day.toLocaleDateString() === targetStr,
          );
          this.currentDayIndex = idxStr !== -1 ? idxStr : 0;
        }
      } else {
        this.currentDayIndex = 0;
      }
    });

    // Registrar clique fora para fechar dropdown
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  methods: {
    backToDetail() {
      this.$router.push({ name: "MonthDetail", params: { month: this.month } });
    },
    getSaturdaysAndSundays() {
      const saturdays = [];
      const sundays = [];
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const year = now.getFullYear();
      let date = new Date(year, this.month, 1);

      while (date.getMonth() === this.month) {
        const dateCompare = new Date(date);
        dateCompare.setHours(0, 0, 0, 0);

        // Only add to array if date is NOT in the past
        if (dateCompare >= now) {
          if (date.getDay() === 6) {
            saturdays.push(new Date(date));
          }
          if (date.getDay() === 0) {
            sundays.push(new Date(date));
          }
        }
        date.setDate(date.getDate() + 1);
      }

      this.saturdays = saturdays;
      this.sundays = sundays;
      this.allDays = [...saturdays, ...sundays].sort((a, b) => a - b);
    },
    initializeSchedule() {
      this.allDays.forEach((date) => {
        if (!this.schedule[date]) {
          this.schedule[date] = {};
        }
        this.sectors.forEach((sector) => {
          if (!this.schedule[date][sector.id]) {
            this.schedule[date][sector.id] = [];
          }
        });
      });
    },
    formatLongDate(date) {
      if (!date) return "";
      const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
      const day = String(date.getDate()).padStart(2, "0");
      const monthName = date.toLocaleDateString("pt-BR", { month: "long" });

      const capitalizedWeekday =
        weekday.charAt(0).toUpperCase() + weekday.slice(1);
      const capitalizedMonth =
        monthName.charAt(0).toUpperCase() + monthName.slice(1);

      return `${capitalizedWeekday}, ${day} de ${capitalizedMonth}`;
    },
    preFormatDate(date) {
      const dateValue = new Date(date);
      const options = {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("pt-BR", options);
      const parts = formatter.formatToParts(dateValue);
      const dayOfWeek = parts.find((part) => part.type === "weekday").value;

      return { dayOfWeek, formattedDate: dateValue };
    },
    prevDay() {
      if (this.currentDayIndex > 0) {
        this.currentDayIndex--;
      }
    },
    nextDay() {
      if (this.currentDayIndex < this.allDays.length - 1) {
        this.saveDetail();
        localStorage.setItem(
          `churchSchedule_${this.month}`,
          JSON.stringify(this.schedule),
        );
        this.currentDayIndex++;
      }
    },
    toggleDropdown(sectorId) {
      if (this.activeDropdownSectorId === sectorId) {
        this.activeDropdownSectorId = null;
      } else {
        this.activeDropdownSectorId = sectorId;
        this.workerSearchQuery = "";
      }
    },
    isWorkerSelected(sectorId, workerId) {
      const date = this.currentDate;
      if (!date || !this.schedule[date]) return false;
      return this.schedule[date][sectorId]?.includes(workerId);
    },
    toggleWorkerSelection(sectorId, workerId) {
      const date = this.currentDate;
      if (!date || !this.schedule[date]) return;

      if (!this.schedule[date][sectorId]) {
        this.schedule[date][sectorId] = [];
      }

      const index = this.schedule[date][sectorId].indexOf(workerId);
      if (index === -1) {
        this.schedule[date][sectorId].push(workerId);
      } else {
        this.schedule[date][sectorId].splice(index, 1);
      }
    },
    getSelectedWorkersNames(sectorId) {
      const date = this.currentDate;
      if (!date || !this.schedule[date] || !this.schedule[date][sectorId])
        return "";
      const ids = this.schedule[date][sectorId];
      return this.workers
        .filter((w) => ids.includes(w.id))
        .map((w) => w.name)
        .join(", ");
    },
    getSelectedWorkersCount(sectorId) {
      const date = this.currentDate;
      if (!date || !this.schedule[date] || !this.schedule[date][sectorId])
        return 0;
      return this.schedule[date][sectorId].length;
    },
    clearCurrentDaySchedule() {
      if (confirm("Quer mesmo apagar todos os nomes deste dia?")) {
        const date = this.currentDate;
        if (date && this.schedule[date]) {
          this.sectors.forEach((sector) => {
            this.schedule[date][sector.id] = [];
          });
          this.saveDetail();
          localStorage.setItem(
            `churchSchedule_${this.month}`,
            JSON.stringify(this.schedule),
          );
        }
      }
    },
    saveDetail() {
      const details = Object.keys(this.schedule).map((date) => {
        const { dayOfWeek, formattedDate } = this.preFormatDate(date);
        const scale = this.schedule[date];

        const sectors = this.sectors.map((sector) => {
          const sectorId = sector?.id;
          const sectorName = sector?.name;

          const sectorWorkers = this.workers
            .filter((worker) => scale[sectorId]?.includes(worker.id))
            .map((worker) => capitalize(worker.name));

          if (sectorWorkers?.length > 0) {
            return {
              name: sectorName,
              workers: sectorWorkers,
            };
          }
          return null;
        });

        return {
          dayOfWeek: capitalize(dayOfWeek),
          date: formattedDate,
          sectors: sectors.filter((v) => v),
        };
      });

      localStorage.setItem(`month-${this.month}`, JSON.stringify(details));
    },
    goToReview() {
      this.activeDropdownSectorId = null;
      this.isReviewing = true;
    },
    saveCurrentDaySchedule() {
      this.saveDetail();
      localStorage.setItem(
        `churchSchedule_${this.month}`,
        JSON.stringify(this.schedule),
      );
      this.showDialogSave = true;
    },
    sharedToWhatsApp() {
      const details = this.getDetailsDayText();
      const message = encodeURIComponent(
        `Escala do dia ${this.formatLongDate(this.currentDate)}:\n\n${details.trim()}`,
      );
      const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
      window.open(whatsappUrl, "_blank");
    },
    getDetailsDayText() {
      const date = this.currentDate;
      if (!date || !this.schedule[date]) return "";

      return this.sectors
        .map((sector) => {
          const sectorId = sector.id;
          const sectorName = sector.name;
          const sectorWorkers = this.workers
            .filter((worker) =>
              this.schedule[date][sectorId]?.includes(worker.id),
            )
            .map((worker) => worker.name);

          if (sectorWorkers.length > 0) {
            return `${sectorName.toUpperCase()}: *${sectorWorkers.map((name) => name.toUpperCase()).join(", ")}*`;
          }
          return null;
        })
        .filter((v) => v)
        .join("\n");
    },
    closeSuccessModal() {
      this.showDialogSave = false;
      this.$router.push({ name: "MonthDetail", params: { month: this.month } });
    },
    handleOutsideClick(e) {
      if (this.activeDropdownSectorId !== null) {
        const closestDropdown = e.target.closest(".custom-dropdown-container");
        if (!closestDropdown) {
          this.activeDropdownSectorId = null;
        }
      }
    },
  },
};
</script>

<style scoped>
.custom-dropdown-panel {
  position: absolute;
  top: 3.1rem;
  left: 0;
  width: 100%;
  z-index: 1040;
  background-color: var(--color-surface-container-lowest);
  border: 2px solid var(--color-outline-variant);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.custom-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.custom-dropdown-item:hover {
  background-color: var(--color-surface-container);
}

.custom-dropdown-item.selected {
  background-color: rgba(0, 107, 44, 0.08);
  color: var(--color-primary);
  font-weight: 600;
}

.btn-scale-active {
  transition: transform 0.15s ease;
}

.btn-scale-active:active {
  transform: scale(0.96);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-dropdown {
  animation: slideDown 0.15s ease-out forwards;
}
</style>
