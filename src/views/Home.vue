<template>
  <div class="pb-5 bg-background-custom min-vh-100">
    <!-- TopAppBar Shell -->
    <header
      class="fixed-top d-flex align-items-center bg-white border-bottom border-2 border-outline-variant"
      style="height: 64px; padding: 0 2rem; z-index: 1030"
    >
      <h1
        class="font-public-sans font-bold fs-5 tracking-tight text-primary-custom m-0"
      >
        Escalas da Igreja
      </h1>
    </header>

    <main
      class="mx-auto px-3"
      style="max-width: 600px; padding-top: 5.5rem; padding-bottom: 7rem"
    >
      <!-- Hero Section / Title -->
      <section class="text-center mb-5">
        <h2 class="font-headline-lg text-on-surface mb-2">Painel de Escalas</h2>
        <p class="font-body-lg text-on-surface-variant">
          Monte ou veja as escalas de trabalho de forma simples e rápida.
        </p>
      </section>

      <!-- Mês Atual Card -->
      <div class="mb-4">
        <div
          class="bg-surface-lowest border border-2 border-outline-variant rounded-xl-custom p-4 shadow-sm"
        >
          <div class="d-flex align-items-center gap-3 mb-4">
            <div
              class="d-flex align-items-center justify-content-center bg-primary-custom rounded-circle"
              style="width: 52px; height: 52px"
            >
              <span class="material-symbols-outlined text-white fs-2"
                >calendar_month</span
              >
            </div>
            <div>
              <span
                class="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                >Este Mês</span
              >
              <h3 class="font-headline-md text-on-surface m-0 text-uppercase">
                {{ months[currentMonth].name }}
              </h3>
            </div>
          </div>

          <div class="d-flex gap-3">
            <button
              class="w-100 py-3 bg-secondary-container-custom text-on-secondary-container rounded-lg-custom font-label-lg border-0 btn-scale-active"
              @click="viewMonth(currentMonth)"
            >
              <span class="material-symbols-outlined me-1">visibility</span>
              Ver Escalas
            </button>
            <button
              :class="[
                'w-100 py-3 bg-primary-custom text-white rounded-lg-custom font-label-lg border-0 btn-scale-active',
                !canEditMonth(currentMonth) ? 'opacity-50' : '',
              ]"
              @click="editMonth(currentMonth)"
              :disabled="!canEditMonth(currentMonth)"
            >
              <span class="material-symbols-outlined me-1">edit</span>
              Montar Escala
            </button>
          </div>
        </div>
      </div>

      <!-- Divider and Toggle -->
      <div class="text-center mb-4">
        <button
          @click="showAllMonths = !showAllMonths"
          class="w-100 py-3 bg-surface-highest text-on-surface border border-2 border-outline-variant rounded-xl-custom font-label-lg border-0 btn-scale-active d-flex align-items-center justify-content-center gap-2"
        >
          <span class="material-symbols-outlined">
            {{ showAllMonths ? "expand_less" : "expand_more" }}
          </span>
          <span>{{
            !showAllMonths ? "Ver outros meses" : "Recolher lista"
          }}</span>
        </button>
      </div>

      <!-- Grid of Months -->
      <div v-if="showAllMonths" class="row g-3">
        <div v-for="(month, index) in months" :key="index" class="col-6">
          <div
            class="bg-surface-lowest border border-2 border-outline-variant rounded-xl-custom p-3 shadow-sm h-100 d-flex flex-column justify-content-between"
          >
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary-custom"
                >calendar_today</span
              >
              <span
                class="font-label-lg text-on-surface"
                style="font-size: 16px"
                >{{ month.name }}</span
              >
            </div>

            <div class="d-flex gap-2">
              <button
                class="w-100 py-2 bg-surface-container-custom text-on-surface rounded-lg-custom font-body-md border-0 btn-scale-active"
                @click="viewMonth(index)"
                style="font-size: 14px"
              >
                Ver
              </button>
              <button
                :class="[
                  'w-100 py-2 rounded-lg-custom font-body-md border-0 btn-scale-active',
                  canEditMonth(index)
                    ? 'bg-primary-custom text-white'
                    : 'bg-surface-highest text-on-surface opacity-50',
                ]"
                @click="editMonth(index)"
                :disabled="!canEditMonth(index)"
                style="font-size: 14px"
              >
                Montar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- BottomNavBar Shell -->
    <nav
      class="fixed-bottom bg-white border-t border-2 border-outline-variant d-flex justify-content-around align-items-center px-2 pb-safe"
      style="height: 80px; z-index: 1030"
    >
      <a
        class="d-flex flex-column align-items-center justify-content-center text-primary-custom text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent="backToHome()"
      >
        <span
          class="material-symbols-outlined fs-2"
          style="font-variation-settings: &quot;FILL&quot; 1"
          >home</span
        >
        <span class="font-public-sans font-bold text-xs mt-1">Início</span>
      </a>
      <a
        class="d-flex flex-column align-items-center justify-content-center text-muted text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent="viewMonth(currentMonth)"
      >
        <span class="material-symbols-outlined fs-2">calendar_month</span>
        <span class="font-public-sans font-medium text-xs mt-1">Escalas</span>
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
import { isMobile } from "../utils/functions.js";

export default {
  data() {
    return {
      months: [
        { name: "Janeiro" },
        { name: "Fevereiro" },
        { name: "Março" },
        { name: "Abril" },
        { name: "Maio" },
        { name: "Junho" },
        { name: "Julho" },
        { name: "Agosto" },
        { name: "Setembro" },
        { name: "Outubro" },
        { name: "Novembro" },
        { name: "Dezembro" },
      ],
      showAllMonths: false,
      currentMonth: new Date().getMonth(), // Mês atual (0-11)
      currentYear: new Date().getFullYear(),
    };
  },
  mounted() {
    this.showAllMonths = !this.isViewMobile;
  },
  methods: {
    viewMonth(index) {
      this.$router.push({ name: "MonthDetail", params: { month: index } });
    },
    editMonth(index) {
      this.$router.push({ name: "MonthEdit", params: { month: index } });
    },
    canEditMonth(index) {
      return index >= this.currentMonth;
    },
    goToWorkers() {
      this.$router.push({ name: "Workers" });
    },
  },
  computed: {
    isViewMobile() {
      return isMobile();
    },
  },
};
</script>
