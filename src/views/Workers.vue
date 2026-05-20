<template>
  <div class="pb-5 bg-background-custom min-vh-100 font-public-sans">
    <!-- TopAppBar -->
    <header
      class="fixed-top d-flex align-items-center bg-white border-bottom border-2 border-outline-variant"
      style="height: 64px; padding: 0 2rem; z-index: 1030"
    >
      <h1
        class="font-public-sans font-bold fs-5 tracking-tight text-primary-custom m-0"
      >
        Trabalhadores
      </h1>
    </header>

    <main
      class="mx-auto px-3"
      style="max-width: 600px; padding-top: 5.5rem; padding-bottom: 7rem"
    >
      <!-- Hero Section -->
      <section class="text-center mb-4">
        <h2 class="font-headline-lg text-on-surface mb-2">
          Lista de Trabalhadores
        </h2>
        <p class="font-body-lg text-on-surface-variant">
          Cadastre as pessoas que ajudam nas escalas da igreja.
        </p>
      </section>

      <!-- Add Worker Form -->
      <div
        class="bg-surface-lowest border border-2 border-outline-variant rounded-xl-custom p-4 shadow-sm mb-4"
      >
        <h3 class="font-label-lg text-on-surface mb-3" style="font-size: 16px">
          Novo Nome
        </h3>
        <div class="d-flex gap-2">
          <input
            v-model="newWorkerName"
            type="text"
            placeholder="Escreva o nome da pessoa..."
            class="form-control rounded-lg-custom border-2 border-outline-variant px-3"
            @keyup.enter="addWorker"
          />
          <button
            class="px-4 bg-primary-custom text-white border-0 rounded-lg-custom font-label-lg btn-scale-active"
            @click="addWorker"
            style="white-space: nowrap"
          >
            Adicionar à Lista
          </button>
        </div>
      </div>

      <!-- Workers List -->
      <div
        class="bg-surface-lowest border border-2 border-outline-variant rounded-xl-custom shadow-sm overflow-hidden"
      >
        <div
          class="p-3 bg-surface-low border-bottom border-2 border-outline-variant font-label-lg text-on-surface-variant d-flex justify-content-between align-items-center"
        >
          <span>Nomes Cadastrados</span>
          <span
            class="badge bg-primary-container-custom text-primary-custom rounded-pill"
            style="font-size: 14px"
            >{{ workers.length }}</span
          >
        </div>

        <div class="d-flex flex-column">
          <div
            v-for="worker in sortedWorkers"
            :key="worker.id"
            class="p-3 border-bottom border-outline-variant d-flex align-items-center justify-content-between bg-white last:border-b-0"
          >
            <!-- Normal Mode -->
            <div
              v-if="editingWorkerId !== worker.id"
              class="d-flex align-items-center justify-content-between w-100"
            >
              <span
                class="font-body-lg text-on-surface font-semibold text-uppercase"
                style="font-size: 16px"
                >{{ worker.name }}</span
              >
              <div class="d-flex gap-1">
                <button
                  class="btn btn-link p-1 text-primary-custom border-0 d-flex align-items-center justify-content-center btn-scale-active text-decoration-none"
                  @click="startEdit(worker)"
                  title="Editar"
                >
                  <span
                    class="material-symbols-outlined"
                    style="font-size: 20px"
                    >edit</span
                  >
                </button>
                <button
                  class="btn btn-link p-1 text-danger border-0 d-flex align-items-center justify-content-center btn-scale-active text-decoration-none"
                  @click="removeWorker(worker.id)"
                  title="Remover"
                >
                  <span
                    class="material-symbols-outlined"
                    style="font-size: 20px"
                    >delete</span
                  >
                </button>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="d-flex gap-2 w-100">
              <input
                v-model="editingWorkerName"
                type="text"
                class="form-control rounded-lg-custom border-2 border-primary-custom px-3"
                @keyup.enter="saveEdit"
              />
              <button
                class="px-3 bg-primary-custom text-white border-0 rounded-lg-custom font-label-lg btn-scale-active"
                @click="saveEdit"
                style="font-size: 14px"
              >
                Salvar
              </button>
              <button
                class="px-3 bg-surface-container-custom text-on-surface-variant border-0 rounded-lg-custom font-label-lg btn-scale-active"
                @click="editingWorkerId = null"
                style="font-size: 14px"
              >
                Cancelar
              </button>
            </div>
          </div>

          <div
            v-if="workers.length === 0"
            class="p-4 text-center text-on-surface-variant font-body-md bg-white"
          >
            Nenhum nome cadastrado ainda.
          </div>
        </div>
      </div>
    </main>

    <!-- BottomNavBar -->
    <nav
      class="fixed-bottom bg-white border-t border-2 border-outline-variant d-flex justify-content-around align-items-center px-2 pb-safe"
      style="height: 80px; z-index: 1030"
    >
      <a
        class="d-flex flex-column align-items-center justify-content-center text-muted text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent="goToHome()"
      >
        <span class="material-symbols-outlined fs-2">home</span>
        <span class="font-public-sans font-medium text-xs mt-1">Início</span>
      </a>
      <a
        class="d-flex flex-column align-items-center justify-content-center text-muted text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent="goToDetail()"
      >
        <span class="material-symbols-outlined fs-2">calendar_month</span>
        <span class="font-public-sans font-medium text-xs mt-1">Escalas</span>
      </a>
      <a
        class="d-flex flex-column align-items-center justify-content-center text-primary-custom text-decoration-none px-3 py-1 btn-scale-active"
        href="#"
        @click.prevent
      >
        <span
          class="material-symbols-outlined fs-2"
          style="font-variation-settings: &quot;FILL&quot; 1"
          >group</span
        >
        <span class="font-public-sans font-bold text-xs mt-1"
          >Trabalhadores</span
        >
      </a>
    </nav>
  </div>
</template>

<script>
import { getWorkers, saveWorkers } from "../utils/functions.js";

export default {
  name: "Workers",
  data() {
    return {
      workers: [],
      newWorkerName: "",
      editingWorkerId: null,
      editingWorkerName: "",
      currentMonth: new Date().getMonth(),
    };
  },
  computed: {
    sortedWorkers() {
      return [...this.workers].sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mounted() {
    this.workers = getWorkers();
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "Home" });
    },
    goToDetail() {
      this.$router.push({
        name: "MonthDetail",
        params: { month: this.currentMonth },
      });
    },
    addWorker() {
      const name = this.newWorkerName.trim();
      if (!name) return;

      if (
        this.workers.some((w) => w.name.toLowerCase() === name.toLowerCase())
      ) {
        alert("Esse nome já foi cadastrado.");
        return;
      }

      const maxId = this.workers.reduce(
        (max, w) => (w.id > max ? w.id : max),
        0,
      );
      const newWorker = {
        id: maxId + 1,
        name: name,
      };

      this.workers.push(newWorker);
      saveWorkers(this.workers);
      this.newWorkerName = "";
    },
    startEdit(worker) {
      this.editingWorkerId = worker.id;
      this.editingWorkerName = worker.name;
    },
    saveEdit() {
      const name = this.editingWorkerName.trim();
      if (!name) return;

      const workerIndex = this.workers.findIndex(
        (w) => w.id === this.editingWorkerId,
      );
      if (workerIndex !== -1) {
        if (
          this.workers.some(
            (w) =>
              w.id !== this.editingWorkerId &&
              w.name.toLowerCase() === name.toLowerCase(),
          )
        ) {
          alert("Esse nome já está na lista.");
          return;
        }

        this.workers[workerIndex].name = name;
        saveWorkers(this.workers);
      }
      this.editingWorkerId = null;
    },
    removeWorker(id) {
      if (confirm("Quer mesmo apagar esse nome da lista?")) {
        this.workers = this.workers.filter((w) => w.id !== id);
        saveWorkers(this.workers);
      }
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
