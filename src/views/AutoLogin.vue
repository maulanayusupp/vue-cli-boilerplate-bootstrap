<template>
<div class="page page-auth">
	<div class="card auth-box">
		<div class="card-body">
			<h3 class="card-title text-center mb-4">{{ $t('Magic Link') }}</h3>
			<div class="card-text">
				<form @submit.prevent="submit()">
					<div class="form-group">
						<label for="inputEmail">{{ $t('Email address') }}</label>
						<input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" v-model="email">
					</div>
					<button type="submit" class="btn btn-primary btn-block" :class="{ 'is-loading': isSubmitting}">{{ $t('Give me a magic') }}</button>

					<div class="mt-2">
						<router-link to="/login">{{ $t('Back to login') }}</router-link>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
</template>

<script>

import { mapActions } from 'vuex';
import authApi from '@/api/auth';
import { getAxiosErrorMessage } from '@/lib/helper';

export default {
	name: 'AutoLogin',
	components: {},
	data() {
		return {
			email: null,
			lang: 'en',
			isSubmitting: false,
		};
	},
	sockets: {},
	mounted() {},
	created() {},
	destroyed() {},
	beforeDestroy() {},
	computed: {},
	methods: {
		...mapActions({
			setToken: 'setToken',
		}),
		reset() {
			this.email = null;
		},
		submit() {
			if (!this.email) {
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Magic Link'),
					text: this.$t('Enter you email'),
				});
				return;
			}
			const params = {
				email: this.email,
				lang: this.lang,
			};
			this.isSubmitting = true;
			const callback = (response) => {
				const message = response.message;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Magic Link'),
					text: message,
				});
				this.reset();
				this.isSubmitting = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Magic Link'),
					text: message,
				});
				this.isSubmitting = false;
			};
			authApi.generate(params, callback, errorCallback);
		},
	},
};
</script>

<style lang="scss" scoped>
.page-login {
}
</style>
