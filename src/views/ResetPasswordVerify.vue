<template>
<div class="page page-auth">
	<div class="card auth-box">
		<div class="card-body">
			<h3 class="card-title text-center mb-4">{{ $t('Reset Password Verify') }}</h3>
			<div class="card-text">
				<form @submit.prevent="submit()">
					<div class="form-group">
						<label for="inputNewPassword">{{ $t('New Password') }}</label>
						<input type="password" class="form-control" id="inputNewPassword" autocomplete="false" v-model="newPassword">
					</div>

					<div class="form-group">
						<label for="inputNewPassword">{{ $t('New Password Confirmation') }}</label>
						<input type="password" class="form-control" id="inputNewPassword" autocomplete="false" v-model="confirmPassword">
					</div>

					<button type="submit" class="btn btn-primary btn-block" :class="{ 'is-loading': isSubmitting }">{{ $t('Submit') }}</button>

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

import authApi from '@/api/auth';
import { getAxiosErrorMessage } from '@/lib/helper';

export default {
	name: 'ResetPasswordVerify',
	components: {},
	data() {
		return {
			newPassword: null,
			confirmPassword: null,
			lang: 'en',
			isSubmitting: false,
		};
	},
	sockets: {},
	mounted() {},
	created() {},
	destroyed() {},
	beforeDestroy() {},
	computed: {
		email() {
			const { email } = this.$route.query;
			return email;
		},
		token() {
			const { token } = this.$route.query;
			return token;
		},
	},
	methods: {
		reset() {
			this.confirmPassword = null;
			this.newPassword = null;
		},
		submit() {
			const params = {
				new_password: this.newPassword,
				confirm_Password: this.confirmPassword,
				lang: this.lang,
			};
			this.isSubmitting = true;
			const callback = (response) => {
				const message = response.message;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Reset Password Verify'),
					text: message,
				});
				this.reset();
				this.isSubmitting = false;
				this.$router.push('/login').catch(() => {});
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Reset Password Verify'),
					text: message,
				});
				this.isSubmitting = false;
			};
			authApi.resetPassword(this.email, this.token, params, callback, errorCallback);
		},
	},
};
</script>

<style lang="scss" scoped>
.page-login {
}
</style>
