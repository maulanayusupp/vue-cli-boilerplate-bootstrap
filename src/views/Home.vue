<template>
	<div class="home">
		<div class="text-center mt-5">
			<img alt="Vue logo" src="@/assets/logo.png">
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'Home',
	components: {},
	data() {
		return {
			isGreetingsVisible: false,
		};
	},
	methods: {
		...mapActions({
			fetchUser: 'fetchUser',
		}),
	},
	computed: {
		...mapGetters({
			user: 'user',
			isTokenExist: 'isTokenExist',
		}),
	},
	created() {
		if (this.isTokenExist) this.fetchUser();
	},
};
</script>
