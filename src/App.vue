<template>
	<div id="app">
		<div class="container mt-3">
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

<style>
/* Background styles */
body {
	color:#fff;
	font-family: "Inria Sans", sans-serif;
	font-weight: 400;
	font-style: normal;
    background-color: #0043b6;
    background-image: 
	radial-gradient(at 47% 33%, hsl(241.88, 96%, 31%) 0, transparent 59%), 
	radial-gradient(at 82% 65%, hsl(218.18, 84%, 45%) 0, transparent 55%);
}

.card {
	color: #111928;
	
	box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
}


/* 
.inria-sans-light {
  font-family: "Inria Sans", sans-serif;
  font-weight: 300;
  font-style: normal;
}

.inria-sans-regular {
  font-family: "Inria Sans", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.inria-sans-bold {
  font-family: "Inria Sans", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.inria-sans-light-italic {
  font-family: "Inria Sans", sans-serif;
  font-weight: 300;
  font-style: italic;
}

.inria-sans-regular-italic {
  font-family: "Inria Sans", sans-serif;
  font-weight: 400;
  font-style: italic;
}

.inria-sans-bold-italic {
  font-family: "Inria Sans", sans-serif;
  font-weight: 700;
  font-style: italic;
} */


/* .card {
	color:#fff;
    backdrop-filter: blur(25px) saturate(50%);
    -webkit-backdrop-filter: blur(25px) saturate(50%);
    background-color: rgba(0, 0, 0, 0.44);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
} */

</style>