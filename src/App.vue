<template>
  <div id="app-wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbs() {
      const routes = this.$route.matched;
      return routes.map((route) => {
        return {
          text: route.meta.breadcrumb || route.name,
          route: route.name,
        };
      });
    },
  },
  methods: {
    backToHome() {
      this.$router.push({ name: "Home" });
    },
    navigateTo(route) {
      this.$router.push({ name: route });
    },
  },
};
</script>

<style>
/* CSS Variables */
:root {
  /* PRIMARY (Azul Religião de Deus) */
  --color-primary: #004B87;
  --color-on-primary: #ffffff;
  --color-primary-container: #D2E4FF;
  --color-on-primary-container: #001C38;
  
  /* SECONDARY (Dourado / Amarelo) */
  --color-secondary: #E5A823;
  --color-on-secondary: #3D2900;
  --color-secondary-container: #FFE094;
  --color-on-secondary-container: #261900;
  
  /* TERTIARY */
  --color-tertiary: #0077C8;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #C9E6FF;
  --color-on-tertiary-container: #001E33;

  /* ERROR */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #410002;

  /* SURFACE & BACKGROUND */
  --color-background: #F8FAFD;
  --color-on-background: #1A1C1E;
  --color-surface: #F8FAFD;
  --color-on-surface: #1A1C1E;
  --color-surface-variant: #DFE2E6;
  --color-on-surface-variant: #43474E;
  --color-outline: #73777F;
  --color-outline-variant: #C3C6CF;

  /* Custom utility classes derived from surface */
  --color-surface-container-lowest: #FFFFFF;
  --color-surface-container-low: #F1F4F9;
  --color-surface-container: #ECEEF4;
  --color-surface-container-high: #E6E8EE;
  --color-surface-container-highest: #E0E2E8;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-on-surface);
  font-family: "Public Sans", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

/* Forçar altura de 40px em inputs e botões padrão */
input[type="text"],
button.btn-scale-active:not(.btn-link) {
  height: 50px !important;
  box-sizing: border-box;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 15px !important;
}

.h-50px-important {
  height: 50px !important;
}

/* Material Symbols Outlined Custom Configuration */
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
  vertical-align: middle;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Custom CSS Helpers for layout */
.bg-background-custom {
  background-color: var(--color-background);
}
.bg-surface-lowest {
  background-color: var(--color-surface-container-lowest);
}
.bg-surface-low {
  background-color: var(--color-surface-container-low);
}
.bg-surface-container-custom {
  background-color: var(--color-surface-container);
}
.bg-surface-high {
  background-color: var(--color-surface-container-high);
}
.bg-surface-highest {
  background-color: var(--color-surface-container-highest);
}
.bg-primary-custom {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}
.bg-primary-container-custom {
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}
.bg-secondary-container-custom {
  background-color: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
}

.text-primary-custom {
  color: var(--color-primary);
}
.text-secondary-custom {
  color: var(--color-secondary);
}
.text-on-surface {
  color: var(--color-on-surface);
}
.text-on-surface-variant {
  color: var(--color-on-surface-variant);
}

.border-outline-variant {
  border-color: var(--color-outline-variant) !important;
}
.border-primary-custom {
  border-color: var(--color-primary) !important;
}

/* Custom Typography */
.font-public-sans {
  font-family: "Public Sans", sans-serif;
}
.font-headline-lg {
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}
.font-headline-md {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
}
.font-body-lg {
  font-size: 20px;
  line-height: 30px;
  font-weight: 400;
}
.font-body-md {
  font-size: 18px;
  line-height: 28px;
  font-weight: 400;
}
.font-label-lg {
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.02em;
  font-weight: 600;
}
.font-button-text {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
}

.rounded-xl-custom {
  border-radius: 0.75rem !important; /* 12px */
}
.rounded-lg-custom {
  border-radius: 0.5rem !important; /* 8px */
}

/* Micro-animations and transitions */
.transition-colors-custom {
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.btn-scale-active:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
</style>
