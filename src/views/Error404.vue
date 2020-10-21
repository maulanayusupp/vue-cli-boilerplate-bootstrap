<template>
<div class="page page-error">
	<h1 class="text-primary text-center jumbo-font mb-0">404</h1>
	<h3 class="text-default text-center">{{$t('Page not found, back to ')}}<router-link to="/" class="navbar-brand">{{$t('Home')}}</router-link></h3>
</div>
</template>

<script>
export default {
	name: 'Error404',
	components: {},
	data() {
		return {};
	},
	sockets: {
	},
	mounted() {},
	created() {},
	destroyed() {},
	beforeDestroy() {
	},
	computed: {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.page-error {
}
</style>
