<template>
	<div id="app">
		<div class="container mt-3">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item link" @click="backToHome()">Início</li>
					<li 
						v-for="(crumb, index) in breadcrumbs" 
						:key="index" 
						:class="{ 'breadcrumb-item': true, 'active': index === breadcrumbs.length - 1 }"
						aria-current="page"
					>
						<span v-if="index === breadcrumbs.length - 1">{{ crumb.text }}</span>
						<span v-else @click="navigateTo(crumb.route)" class="link">{{ crumb.text }}</span>
					</li>
				</ol>
			</nav>
			
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		breadcrumbs() {
			const routes = this.$route.matched; 
			return routes.map(route => {
				return {
					text: route.meta.breadcrumb || route.name,
					route: route.name
				};
			});
		}
	},
	methods: {
		backToHome() {
			this.$router.push({ name: 'Home' });
		},
		navigateTo(route) {
			this.$router.push({ name: route });
		}
	}
};
</script>
