<template>
<div class="page page-auth">
	<div class="card auth-box">
		<div class="card-body">
			<h3 class="card-title text-center mb-4">{{ $t('User Verification') }}</h3>
			<div class="card-text">
				<div class="is-loading large dark p-5" v-if="isValidating"></div>

				<div class="text-center mt-4" v-if="isExpired">
					<h5>
						{{ $t('You session is expired') }}
					</h5>
					<div class="mt-3">
						<router-link to="/login">{{ $t('Back to login') }}</router-link>
					</div>
				</div>

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
			lang: 'en',
			isValidating: false,
			isExpired: false,
		};
	},
	sockets: {},
	mounted() {
		this.validating();
	},
	created() {},
	destroyed() {},
	beforeDestroy() {},
	computed: {
		token() {
			const { token } = this.$route.query;
			return token;
		},
	},
	methods: {
		validating() {
			const params = {
				token: this.token,
				lang: this.lang,
			};
			this.isValidating = true;
			const callback = (response) => {
				const message = response.message;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('User Verification'),
					text: message,
				});
				this.isValidating = false;
				this.$router.push('/login').catch(() => {});
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('User Verification'),
					text: message,
				});
				this.isValidating = false;
				this.isExpired = true;
			};
			authApi.autoLogin(params, callback, errorCallback);
		},
	},
};
</script>

<style lang="scss" scoped>
.page-login {
}
</style>
