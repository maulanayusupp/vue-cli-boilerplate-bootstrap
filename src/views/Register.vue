<template>
<div class="page page-auth">
	<div class="card auth-box">
		<div class="card-body">
			<h3 class="card-title text-center mb-4">{{ $t('Register') }}</h3>
			<div class="card-text">
				<form @submit.prevent="submit()">
					<div class="form-group">
						<label for="inputEmail">{{ $t('Email address') }}</label>
						<input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" v-model="user.email">
					</div>

					<div class="form-group">
						<label for="inputPassword">{{ $t('Password') }}</label>
						<input type="password" class="form-control" id="inputPassword" autocomplete="false" v-model="user.password">
					</div>

					<div class="form-group">
						<label for="inputName">{{ $t('Name') }}</label>
						<input type="text" class="form-control" id="inputName" v-model="user.name">
					</div>

					<div class="form-group">
						<label for="inputUsername">{{ $t('Username') }}</label>
						<input type="text" class="form-control" id="inputUsername" v-model="user.username">
					</div>

					<div class="form-group">
						<label for="inputPhoneNumber">{{ $t('Phone Number') }}</label>
						<input type="text" class="form-control" id="inputPhoneNumber" v-model="user.mobile_phone">
					</div>

					<button type="submit" class="btn btn-primary btn-block" :class="{ 'is-loading': isSubmitting}">{{ $t('Register') }}</button>

					<div class="mt-2">
						{{ $t("Already have an account") }}? <router-link to="/login">{{ $t('Sign in') }}</router-link>
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
import { getAxiosErrorMessage, duplicateVar } from '@/lib/helper';

const USER_DEFAULT = {
	email: null,
	password: null,
	name: null,
	username: null,
	mobile_phone: null,
	lang: 'en',
	verification_method: 'email',
};

export default {
	name: 'ResetPassword',
	components: {},
	data() {
		return {
			user: duplicateVar(USER_DEFAULT),
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
			this.user = duplicateVar(USER_DEFAULT);
		},
		submit() {
			const params = duplicateVar(this.user);
			this.isSubmitting = true;
			const callback = (response) => {
				const message = response.message;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Reset Password'),
					text: message,
				});
				this.reset();
				this.isSubmitting = false;
				this.$router.push('/login');
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Reset Password'),
					text: message,
				});
				this.isSubmitting = false;
			};
			authApi.register(params, callback, errorCallback);
		},
	},
};
</script>

<style lang="scss" scoped>
.page-login {
}
</style>
