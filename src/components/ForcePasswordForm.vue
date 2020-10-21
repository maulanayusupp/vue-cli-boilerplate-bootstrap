<template>
	<modal
		size="small-medium"
		:hide-footer="true"
		@close="close">
		<template slot="header">
			<h3 class="text-white">{{ $t('Change Password') }}</h3>
		</template>
		<template slot="body">
			<form @submit.prevent="save" style="max-height: 550px; overflow-y: auto" class="pr-3">
				<!-- new Password -->
				<div class="form-group">
					<label>{{ $t('New Password') }}</label>
					<input-password v-model="newPassword" :required="true" />
				</div>
				<!-- Confirm Password -->
				<div class="form-group">
					<label>{{ $t('Confirm Password') }}</label>
					<input-password v-model="confirmPassword" :required="true" :notMatch="confirmPassword !== newPassword" />
				</div>
			</form>
			<!-- Submit -->
			<button
				@click="save"
				:disabled="!isFormValid"
				type="submit"
				class="btn btn-submit btn-primary mt-3"
				:class="{ 'is-loading': isSaving }">
				{{ $t('Update Password') }}
			</button>
		</template>
	</modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import InputPassword from '@/components/InputPassword.vue';
import { getAxiosErrorMessage } from '@/lib/helper';
import user from '@/api/user';

export default {
	name: 'ChangePasswordForm',
	props: {
		data: {
			type: Object,
		},
	},
	components: {
		Modal,
		InputPassword,
	},
	data() {
		return {
			newPassword: '',
			confirmPassword: '',
			isSaving: '',
		};
	},
	methods: {
		save() {
			this.isSaving = true;
			const params = this.params;
			const callback = (response) => {
				const message = response.message;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Change Password'),
					text: message,
				});
				this.isSaving = false;
				this.close();
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Change Password'),
					text: message,
				});
				this.isSaving = false;
			};
				user.forceUpdatePassword(this.data.id, params, callback, errorCallback);
		},
		close() {
			this.$emit('close');
		},
		initData() {
			this.reset();
		},
		reset() {

		},
	},
	computed: {
		params() {
			const params = {
				password: this.newPassword,
			};
			return params;
		},
		isFormValid() {
			return (
				this.newPassword === this.confirmPassword
			);
		},
	},
	created() {
		this.initData();
	},
};
</script>
