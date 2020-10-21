<template>
    <div id="app">
		<!-- Navbar -->
        <navbar v-if="user"></navbar>

		<!-- Main Content -->
        <router-view/>

		<!-- Notifications -->
		<notifications group="app" :ignoreDuplicates="true" position="bottom right" :max="3" :duration="4000" style="z-index: 99989!important;">
			<template slot="body" slot-scope="props">
				<div class="vue-notification" :class="props.item.type">
					<div class="d-flex justify-space-between">
						<div v-if="props.item.type === 'warning'" class="material-icons mr-2 mtb-a">error_outline</div>
						<div v-if="props.item.type === 'success'" class="material-icons mr-2 mtb-a">check</div>
						<div v-if="props.item.type === 'error'" class="material-icons mr-2 mtb-a">clear</div>
						<div class="title pt-1"> {{ props.item.text }}</div>
					</div>
				</div>
			</template>
		</notifications>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Navbar from '@/components/Navbar.vue';

export default {
	name: 'App',
	components: {
        Navbar,
    },
	data() {
		return {};
	},
	sockets: {
	},
	mounted() {},
	created() {
		if (this.isTokenExist) this.fetchUser();
	},
	destroyed() {},
	beforeDestroy() {},
	watch: {},
	computed: {
		...mapGetters({
			user: 'user',
			isTokenExist: 'isTokenExist',
		}),
	},
	methods: {
		...mapActions({
			fetchUser: 'fetchUser',
		}),
	},
};
</script>

<style lang="scss">
    @import '@/assets/scss/main.scss';
	[v-cloak] {
		display: none;
	}
</style>
