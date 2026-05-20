<template>
  <div class="pb-5 bg-background-custom min-vh-100">
    <!-- TopAppBar Shell -->
    <header
      class="fixed-top d-flex align-items-center bg-white border-bottom border-2 border-outline-variant"
      style="height: 64px; padding: 0 2rem; z-index: 1030"
    >
      <button
        aria-label="Voltar"
        class="btn btn-link p-2 text-primary-custom btn-scale-active border-0 d-flex align-items-center justify-content-center me-2 text-decoration-none"
        @click="backToHome()"
      >
        <span class="material-symbols-outlined fs-2">arrow_back</span>
      </button>
      <h1
        class="font-public-sans font-bold fs-5 tracking-tight text-primary-custom m-0"
      >
        Escalas de {{ months[month] }}
      </h1>
    </header>

    <main
      class="mx-auto px-3"
      style="max-width: 600px; padding-top: 5.5rem; padding-bottom: 7rem"
    >
      <!-- Hero Section / Title -->
      <section class="text-center mb-4">
        <h2 class="font-headline-lg text-on-surface mb-2">Escala do Mês</h2>
        <p class="font-body-lg text-on-surface-variant">
          Confira quem está escalado para trabalhar em {{ months[month] }}.
        </p>
      </section>

      <!-- Primary Action -->
      <div class="mb-4">
        <button
          class="w-100 bg-primary-custom text-white border-0 rounded-xl-custom font-button-text shadow-sm btn-scale-active d-flex align-items-center justify-content-center gap-3 h-50px-important"
          @click="captureScreen()"
        >
          <span class="material-symbols-outlined">share</span>
          <span>Copiar Foto da Escala (Mês Inteiro)</span>
        </button>
      </div>

      <!-- Vertical Stack of Scale Cards -->
      <div
        ref="mdScaleContent"
        class="d-flex flex-column gap-4 bg-background-custom p-2 rounded-3"
      >
        <div v-for="(day, index) in days" :key="index">
          <!-- Filled Scale Card -->
          <div
            v-if="day.sectors && day.sectors.length > 0"
            class="bg-surface-lowest border border-2 border-outline-variant rounded-xl-custom p-4 shadow-sm"
          >
            <div
              class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-outline-variant"
            >
              <span class="font-label-lg text-primary-custom text-uppercase"
                >{{ day.dayOfWeek }} -
                {{ formatDateValue(day.date, "DD/MM/YYYY") }}</span
              >
              <span
                class="material-symbols-outlined text-primary-custom"
                style="font-variation-settings: &quot;FILL&quot; 1"
                >check_circle</span
              >
            </div>

            <div class="d-flex flex-column gap-3 mb-4">
              <div
                v-for="sector in day.sectors"
                :key="sector.name"
                class="d-flex flex-column"
              >
                <span
                  class="text-xs font-bold text-on-surface-variant text-uppercase tracking-wider"
                  style="font-size: 11px"
                  >{{ sector.name }}</span
                >
                <span
                  class="font-body-lg font-semibold text-uppercase text-on-surface"
                  style="font-size: 18px"
                  >{{ sector.workers.join(", ") }}</span
                >
              </div>
            </div>

            <div class="d-flex flex-column gap-2">
              <button
                v-if="!isPastDate(day.date)"
                class="w-100 border border-2 border-outline text-on-surface font-label-lg rounded-lg-custom bg-transparent btn-scale-active"
                @click="editMonth(day, index)"
              >
                Mudar Trabalhadores
              </button>
              <button
                v-else
                class="w-100 border border-2 border-outline-variant text-on-surface-variant font-label-lg rounded-lg-custom bg-transparent"
                disabled
                style="opacity: 0.5"
              >
                Mudar Trabalhadores (Expirado)
              </button>
              <button
                class="w-100 bg-secondary-container-custom text-on-secondary-container rounded-lg-custom font-label-lg border-0 btn-scale-active d-flex align-items-center justify-content-center gap-2"
                @click="shareDayScale(day)"
              >
                <span class="material-symbols-outlined" style="font-size: 20px"
                  >share</span
                >
                <span>Enviar este dia por WhatsApp</span>
              </button>
            </div>
          </div>

          <!-- Empty Scale Card -->
          <div
            v-else
            class="bg-surface-lowest border border-2 border-dashed border-outline-variant rounded-xl-custom p-4 d-flex flex-column align-items-center text-center shadow-sm"
          >
            <div
              class="d-flex align-items-center justify-content-between w-100 mb-4 pb-2 border-bottom border-outline-variant"
            >
              <span class="font-label-lg text-on-surface-variant text-uppercase"
                >{{ day.dayOfWeek }} -
                {{ formatDateValue(day.date, "DD/MM/YYYY") }}</span
              >
            </div>
            <div class="py-4 w-100">
              <span
                class="material-symbols-outlined text-outline mb-3"
                style="font-size: 48px"
                >calendar_add_on</span
              >
              <p
                class="font-body-lg text-on-surface-variant mb-4"
                style="font-size: 18px"
              >
                {{
                  isPastDate(day.date)
                    ? "Esta data já passou e nenhuma escala foi criada."
                    : "A escala deste dia ainda não foi montada."
                }}
              </p>
              <button
                v-if="!isPastDate(day.date)"
                class="w-100 bg-secondary-container-custom text-on-secondary-container border-0 rounded-lg-custom font-button-text d-flex align-items-center justify-content-center gap-2 btn-scale-active"
                @click="editMonth(day, index)"
              >
                <span class="material-symbols-outlined">add</span>
                <span>Montar Escala deste Dia</span>
              </button>
              <button
                v-else
                class="w-100 bg-surface-container-custom text-on-surface-variant border-0 rounded-lg-custom font-button-text d-flex align-items-center justify-content-center gap-2"
                disabled
                style="opacity: 0.5"
              >
                <span class="material-symbols-outlined">lock_clock</span>
                <span>Data já passou</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

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
            Foto Copiada!
          </h2>
          <p
            class="font-body-md text-on-surface-variant m-0"
            style="font-size: 16px"
          >
            Agora abra o seu WhatsApp, escolha a conversa do grupo da igreja e
            cole a imagem!
          </p>

          <div class="d-flex flex-column w-100 gap-2 mt-3">
            <button
              class="w-100 py-3 border-0 text-white rounded-xl-custom font-button-text d-flex align-items-center justify-content-center gap-2 btn-scale-active"
              style="background-color: #25d366; font-size: 18px"
              @click="openSharedWhatsApp()"
            >
              <span class="material-symbols-outlined">share</span>
              <span>Ir para o WhatsApp</span>
            </button>
            <button
              class="w-100 py-3 border-0 bg-surface-container-custom text-on-surface-variant rounded-xl-custom font-button-text btn-scale-active"
              style="font-size: 18px"
              @click="showDialogSave = false"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BottomNavBar Shell -->
    <nav
      class="fixed-bottom bg-white border-t border-2 border-outline-variant d-flex justify-content-around align-items-center px-2 pb-safe"
      style="height: 80px; z-index: 1030"
    >
      <a
        class="d-flex flex-column align-items-center justify-content-center text-muted text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent="backToHome()"
      >
        <span class="material-symbols-outlined fs-2">home</span>
        <span class="font-public-sans font-medium text-xs mt-1">Início</span>
      </a>
      <a
        class="d-flex flex-column align-items-center justify-content-center text-primary-custom text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent
      >
        <span
          class="material-symbols-outlined fs-2"
          style="font-variation-settings: &quot;FILL&quot; 1"
          >calendar_month</span
        >
        <span class="font-public-sans font-bold text-xs mt-1">Escalas</span>
      </a>
      <a
        class="d-flex flex-column align-items-center justify-content-center text-muted text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent="goToWorkers()"
      >
        <span class="material-symbols-outlined fs-2">group</span>
        <span class="font-public-sans font-medium text-xs mt-1"
          >Trabalhadores</span
        >
      </a>
    </nav>
  </div>
</template>

<script>
import { formatDateValue } from "../utils/functions.js";
import html2canvas from "html2canvas";

export default {
  name: "MonthDetail",
  setup() {
    return {
      formatDateValue,
    };
  },
  data() {
    return {
      showDialogSave: false,
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
      days: [], // Carregado do localStorage
      detailsOrigin: [],
      month: null,
    };
  },
  mounted() {
    this.month = parseInt(this.$route.params.month);
    this.loadMonthData();
  },
  methods: {
    backToHome() {
      this.$router.push({ name: "Home" });
    },
    goToWorkers() {
      this.$router.push({ name: "Workers" });
    },
    isPastDate(dateStr) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateVal = new Date(dateStr);
      dateVal.setHours(0, 0, 0, 0);
      return dateVal < today;
    },
    captureScreen() {
      const element = this.$refs.mdScaleContent;
      element.style.padding = "16px";
      element.style.backgroundColor = "var(--color-background)";

      html2canvas(element, {
        backgroundColor: "#fbf8ff",
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        element.style.padding = "";
        element.style.backgroundColor = "";

        canvas.toBlob((blob) => {
          if (navigator.clipboard) {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard
              .write([item])
              .then(() => {
                this.showDialogSave = true;
              })
              .catch((err) => {
                console.error("Erro ao copiar a imagem: ", err);
                alert("Erro ao copiar imagem para área de transferência.");
              });
          } else {
            alert("A API de Clipboard não é suportada por este navegador.");
          }
        });
      });
    },
    shareDayScale(day) {
      const dateStr = formatDateValue(day.date, "DD/MM/YYYY");
      const detailsText = day.sectors
        .map((sector) => {
          return `${sector.name.toUpperCase()}: *${sector.workers.join(", ").toUpperCase()}*`;
        })
        .join("\n");
      const message = encodeURIComponent(
        `*ESCALA ${day.dayOfWeek.toUpperCase()} - ${dateStr}*\n\n${detailsText}`,
      );
      const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
      window.open(whatsappUrl, "_blank");
    },
    editMonth(day, index) {
      const dayType = day?.dayOfWeek === "Sábado" ? "saturday" : "sunday";

      this.$router.push({
        name: "MonthEdit",
        params: { month: this.month },
        query: { [dayType]: day.date },
      });
    },
    loadMonthData() {
      const monthData = localStorage.getItem(`month-${this.month}`);

      if (monthData) {
        this.days = JSON.parse(monthData);
        this.detailsOrigin = [...this.days];
      } else {
        const daysList = [];
        const now = new Date();
        const year = now.getFullYear();
        let date = new Date(year, this.month, 1);

        while (date.getMonth() === this.month) {
          if (date.getDay() === 6 || date.getDay() === 0) {
            const dayOfWeek = date.getDay() === 6 ? "Sábado" : "Domingo";
            daysList.push({
              dayOfWeek: dayOfWeek,
              date: new Date(date).toISOString(),
              sectors: [],
            });
          }
          date.setDate(date.getDate() + 1);
        }
        this.days = daysList;
        this.detailsOrigin = [...this.days];
      }
    },
    openSharedWhatsApp() {
      const whatsappUrl = `https://web.whatsapp.com/`;
      window.open(whatsappUrl, "_blank");
    },
  },
};
</script>

<style scoped>
.btn-scale-active {
  transition: transform 0.15s ease;
}
.btn-scale-active:active {
  transform: scale(0.96);
}
</style>
