<template>
<div class="page page-auth">
	<div class="card auth-box">
		<div class="card-body">
			<h3 class="card-title text-center mb-4">Log in to MariMoro</h3>
			<div class="card-text">
				<form @submit.prevent="login()">
					<div class="form-group">
						<label for="inputEmail">{{ $t('Email address') }}</label>
						<input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" v-model="email">
					</div>

					<div class="form-group">
						<label for="inputPassword">{{ $t('Password') }}</label>
						<router-link to="/reset-password" class="forgot-password-link">{{ $t('Forgot password') }}?</router-link>
						<input type="password" class="form-control" id="inputPassword" autocomplete="true" v-model="password">
					</div>

					<button type="submit" class="btn btn-primary btn-block" :class="{ 'is-loading': isSubmitting}">{{ $t('Sign in') }}</button>

					<div class="text-center mt-2">
						{{ $t("Don't have an account") }}? <router-link to="/register">{{ $t('Create One') }}</router-link>
						<div>
							<router-link to="/magic-link">{{ $t('Magic Link') }}</router-link>
						</div>
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
	name: 'Login',
	components: {},
	data() {
		return {
			email: null,
			password: null,
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
		login() {
			const params = {
				email: this.email,
				password: this.password,
				lang: this.lang,
			};
			this.isSubmitting = true;
			const callback = (response) => {
				const data = response.data;
				this.setToken(data);
				this.$router.push('/').catch(() => {});
				this.isSubmitting = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Login'),
					text: message,
				});
				this.isSubmitting = false;
			};
			authApi.login(params, callback, errorCallback);
		},
	},
};
</script>

<style lang="scss" scoped>
.page-login {
}
</style>
