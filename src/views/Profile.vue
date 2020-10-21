<template>
<div class="page page-profile">
	<div class="col-md-4" style="margin-left: auto; margin-right: auto; margin-top: 5%; overflow-y: auto;">
		<div><h2 class="text-primary mb-2">{{ $t('Profile') }}</h2></div>
		<div class="card profile-card-2">
			<div class="card-img-block">
				<img class="card-img-block" src="https://images.pexels.com/photos/946351/pexels-photo-946351.jpeg?w=500&h=650&auto=compress&cs=tinysrgb" alt="Card image cap">
			</div>
			<div class="card-body pt-5">
				<span v-if="user && user.profile.picture">
					<img src="https://randomuser.me/api/portraits/men/64.jpg" alt="profile-image" class="profile"/>
				</span>
				<span v-else class="thumbnail-profile">
					<div class="initial-profile">{{ generateInitial(user && user.profile.name) }}</div>
				</span>
				<div class="ml-3">
					<!-- biodata -->
					<h5 class="card-title mb-0">{{ user && user.profile.name }}</h5>
					<p class="card-text">{{user && user.email}}</p>
					<!-- job -->
					<p class="text-primary mb-0">{{ $t('Job') }}</p>
					<p class="card-text">{{user && user.profile.job_title}}, {{user && user.profile.company}}
					<!-- address -->
					<p class="text-primary mb-0">{{ $t('Address') }}</p>
					<p class="card-text">{{user && user.profile.address}}, {{user && user.profile.city}}, {{user && user.profile.state}}, {{user && user.profile.country}}, {{user && user.profile.postal_code}}</p>
					<div class="icon-block mb-3">
						<i v-tooltip="$t('Edit')" @click="updateProfile" class="material-icons md-18 pointer ml-0">edit</i>
						<i v-tooltip="$t('Change Password')" @click="updatePassword" class="material-icons md-18 pointer">lock</i>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Modals -->
		<div class="modals">
			<!-- profile Form -->
			<profile-form
				:data="user"
				@saved="saved"
				@close="isFormVisible = false"
				v-if="isFormVisible"
			/>
			<!-- change password Form -->
			<change-password-form
				@close="isFormPasswordVisible = false"
				v-if="isFormPasswordVisible"
			/>
		</div>
</div>
</template>

<script>
import authApi from '@/api/auth';
import { getAxiosErrorMessage, duplicateVar } from '@/lib/helper';
import ProfileForm from '@/components/ProfileForm.vue';
import ChangePasswordForm from '@/components/ChangePasswordForm.vue';

export default {
	name: 'Template',
	components: {
		ProfileForm,
		ChangePasswordForm,
	},
	data() {
		return {
			user: null,
			isFormVisible: false,
			isFormPasswordVisible: false,
			selectedItem: null,
		};
	},
	computed: {},
	methods: {
		fetch() {
			this.isFetching = true;
			const callback = (response) => {
				this.user = response.data;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Profile'),
					text: message,
				});
				this.isFetching = false;
			};
			authApi.getProfile(callback, errorCallback);
		},
		updateProfile() {
			this.selectedItem = duplicateVar(this.user);
			this.isFormVisible = true;
		},
		updatePassword() {
			this.selectedItem = duplicateVar(this.user);
			this.isFormPasswordVisible = true;
		},
		generateInitial(dataName) {
			const words = dataName ? dataName.split(' ') : 'AN';
			let initial = words[0][0] !== undefined ? words[0][0] : 'AN';
			if (words.length > 1) {
				const firstCharacter = words[0][0] !== undefined ? words[0][0] : '';
				const secondCharacter = words[1][0] !== undefined ? words[1][0] : '';
				initial = `${firstCharacter}${secondCharacter}`;
			}
			return initial;
		},
		saved() {
			this.fetch();
		},
	},
	watch: {},
	mounted() {},
	created() {
		this.fetch();
	},
	destroyed() {},
	beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
</style>
