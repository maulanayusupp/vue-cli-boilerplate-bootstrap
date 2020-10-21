<template>
	<modal
		size="medium-large"
		:hide-footer="true"
		@close="close">
		<template slot="header">
			<h3 class="text-white" v-if="!data">{{ $t('Add User') }}</h3>
			<h3 class="text-white" v-else>{{ $t('Edit User') }}</h3>
		</template>
		<template slot="body">
			<form @submit.prevent="save" style="max-height: 550px; overflow-y: auto" class="pr-3">
				<div class="row">
					<div class="col-md-6">
						<!-- Role -->
						<div class="form-group roles">
							<label class="typo__label">Roles</label>
								<div class="mh-40px">
									<multiselect class="roles-input" v-model="role" tag-placeholder="Add Roles"
									placeholder="Search or add a roles" label="label" track-by="key"
									:options="roles" :multiple="true" :searchable="false" :taggable="true" :allow-empty="false" @tag="addTag" :show-labels="false"></multiselect>
								</div>
							</div>
						<!-- Email -->
						<div class="form-group">
							<label>{{ $t('Email') }}</label>
							<input type="email" name="email" class="form-control" v-model="email" :class="{'error-input': !validEmail(email)}">
							<span class="text-error" v-if="!validEmail(email)">{{ $t('Email is Invalid') }}</span>
						</div>
						<!-- Fullname -->
						<div class="form-group">
							<label>{{ $t('Fullname') }}</label>
							<input type="text" name="name" class="form-control" v-model="fullname" :class="{'error-input': !fullname}">
						</div>

						<div class="row">
							<div class="col-md-6">
								<!-- Gender -->
								<div class="form-group">
									<label class="typo__label">{{ $t('Gender') }} </label>
									<div class="mh-40px">
										<multiselect class="roles-input" v-model="gender" deselect-label="Can't remove this value" track-by="name" label="name"
											placeholder=" " :options="genderOptions" :searchable="false" :allow-empty="false" :show-labels="false">
										</multiselect>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<!-- Birth Date -->
								<div class="form-group">
									<label>{{ $t('Birth Date') }}</label>
									<flat-pickr
										class="date-event form-control"
										:config="configDateTimePicker"
										v-model="birthDate"
									/>
								</div>
							</div>
						</div>
						<!-- Language -->
						<div class="form-group roles">
							<label class="typo__label">{{ $t('Language') }} </label>
								<div class="mh-40px">
									<multiselect class="roles-input" v-model="language" deselect-label="Can't remove this value" track-by="name" label="name"
										placeholder=" " :options="langOptions" :searchable="false" :allow-empty="false" :show-labels="false">
									</multiselect>
								</div>
						</div>
						<!-- Phone -->
						<div class="form-group">
							<label>{{ $t('Phone') }} (<span class="text-small">{{ $t('Example: 6281234567890') }}</span>)</label>
							<!-- <div class="pos-r">
								<div class="absolute ml-3 pt-2 disabled" style="max-width: 20px">62</div>
								<input type="number" @keyup="removeZero(phone)" name="phone" class="form-control input-phone" v-model="phone" :class="{'error-input': !validPhone(phone)}">
							</div> -->
							<VuePhoneNumberInput
								:translations="phoneTranslations"
								class="input-number"
								:class="{'error-phone': !validPhone(phone)}"
								:default-country-code="'ID'"
								:preferred-countries="['ID', 'US', 'GB']"
								@update="onUpdatePhone"
								no-example
								v-model="phone"
							/>
							<span v-if="!validPhone(phone)" class="text-error">{{ $t('Phone number is invalid') }}</span>
						</div>
						<div class="d-flex hidden">
							<!-- Password -->
							<div class="form-group pr-2">
								<label>{{ $t('Password') }}</label>
								<input-password v-model="password"/>
							</div>
							<!-- Confirm Password -->
							<div class="form-group pl-2">
								<label>{{ $t('Confirm Password') }}</label>
								<input-password v-model="confirmPassword"/>
							</div>
						</div>
					</div>
					<div class="col-md-6">
						<div class="row">
							<div class="col-md-6">
								<!-- Job Title -->
								<div class="form-group">
									<label>{{ $t('Job Title') }}</label>
									<input type="text" name="job" class="form-control" v-model="jobTitle"/>
								</div>
							</div>
							<div class="col-md-6">
								<!-- Company -->
								<div class="form-group">
									<label>{{ $t('Company') }}</label>
									<input type="text" name="company" class="form-control" v-model="company"/>
								</div>
							</div>
						</div>
						<!-- Address -->
						<div class="form-group">
							<label>{{ $t('Address') }}</label>
							<input type="text" name="address" class="form-control" v-model="address"/>
						</div>
						<div class="row">
							<div class="col-md-6">
								<!-- City -->
								<div class="form-group">
									<label>{{ $t('City') }}</label>
									<input type="text" name="state" class="form-control" v-model="city"/>
								</div>
							</div>
							<div class="col-md-6">
								<!-- State -->
								<div class="form-group">
									<label>{{ $t('State') }}</label>
									<input type="text" name="state" class="form-control" v-model="state"/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<!-- country -->
								<div class="form-group">
									<label>{{ $t('Country') }}</label>
									<input type="text" name="country" class="form-control" v-model="country"/>
								</div>
							</div>
							<div class="col-md-6">
								<!-- Postal Code -->
								<div class="form-group">
									<label>{{ $t('Postal Code') }}</label>
									<input type="text" name="postalCode" class="form-control" v-model="postalCode"/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- checkbox -->
				<div class="d-flex justify-content-between mt-2 hidden">
					<!-- Is Verified -->
					<label class="custom-control custom-checkbox mb-3">
						<input type="checkbox" class="custom-control-input" v-model="isVerified">
						<span class="custom-control-label pt-1">{{ $t('Verified') }}</span>
					</label>
					<!-- Is Banned -->
					<label v-if="data" @change="banningUser" class="custom-control custom-checkbox mb-3">
						<input type="checkbox" class="custom-control-input" v-model="isBanned">
						<span class="custom-control-label pt-1">{{ $t('Banned') }}</span>
					</label>
				</div>
			</form>
			<!-- Submit -->
			<button v-if="!data"
					@click="save"
					:disabled="!isValid"
					type="submit"
					class="btn btn-submit btn-primary mt-3"
					:class="{ 'is-loading': isSaving }">
					{{ $t('Create User') }}
				</button>
				<button v-else
					@click="save"
					:disabled="!isValid"
					type="submit"
					class="btn btn-submit btn-primary mt-3"
					:class="{ 'is-loading': isSaving }">
					{{ $t('Update User') }}
			</button>
		</template>
	</modal>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Multiselect from 'vue-multiselect';
import Modal from '@/components/Modal.vue';
import InputPassword from '@/components/InputPassword.vue';
import { getAxiosErrorMessage, isValidEmail, phoneValidator } from '@/lib/helper';
import user from '@/api/user';

export default {
	name: 'UserForm',
	props: {
		data: {
			type: Object,
		},
	},
	components: {
		Modal,
		InputPassword,
		Multiselect,
		flatPickr,
		VuePhoneNumberInput,
	},
	data() {
		return {
			email: '',
			password: '',
			confirmPassword: '',
			typePassword: 'password',
			fullname: '',
			phone: '',
			isVerified: false,
			isBanned: false,
			lang: 'en',
			picture: '',
			role: [],
			roles: [
				{ key: 'client', label: 'Client' },
				{ key: 'super_admin', label: 'Super Admin' },
			],
			isSaving: false,
			isBanning: false,
			gender: 'Male',
			birthDate: '',
			company: '',
			jobTitle: '',
			postalCode: '',
			country: '',
			state: '',
			city: '',
			address: '',
			configDateTimePicker: {
				enableTime: false,
				dateFormat: 'Y-m-d',
			},
			language: 'en',
			langOptions: [
				{ key: 'en', name: 'English' },
				{ key: 'id', name: 'Indonesia' },
			],
			genderOptions: [
				{ key: 'male', name: 'Male' },
				{ key: 'female', name: 'Female' },
			],
			phoneTranslations: {
				countrySelectorLabel: this.$t('Code Country'),
				countrySelectorError: this.$t('Choose one country'),
				phoneNumberLabel: this.$t('Phone Number'),
				example: this.$t('Example:'),
			},
			resultsPhone: {},
		};
	},
	methods: {
		onUpdatePhone(payload) {
			this.resultsPhone = payload;
		},
		addTag() {
			this.roles.push();
			this.role.push();
		},
		save() {
			this.isSaving = true;
			const params = this.params;
			const callback = (response) => {
				const user = response.data;
				const message = response.message;
				this.$emit('saved', user);
				this.$notify({
					group: 'app',
					type: 'success',
					title: 'Add User',
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
					title: 'Add User',
					text: message,
				});
				this.isSaving = false;
			};
			if (this.data) {
				user.update(this.data.id, params, callback, errorCallback);
			} else {
				user.create(params, callback, errorCallback);
			}
		},
		close() {
			if (this.data) {
				const roles = this.role.map(a => a.key);
				this.data.roles = roles;
			}
			this.$emit('close');
		},
		initData() {
			this.reset();
			if (this.data) {
				this.setData(this.data);
			}
		},
		reset() {
			this.email = '';
			this.fullname = '';
			this.phone = '';
			this.isVerified = false;
			this.isBanned = false;
			this.role = [{ key: 'client', label: 'Client' }];
			this.picture = '';
			this.lang = 'en';
			this.gender = 'Male';
			this.birthDate = '';
			this.company = '';
			this.jobTitle = '';
			this.postalCode = '';
			this.country = '';
			this.state = '';
			this.city = '';
			this.address = '';
			this.language = { key: 'en', name: 'English' };
		},
		setData(data) {
			for (let index = 0; index < data.roles.length; index++) {
				const role = data.roles[index];
				data.roles[index] = this.searchRoles(role, this.roles); // eslint-disable-line no-param-reassign
			}
			this.email = data.email;
			this.fullname = data.profile.name;
			this.phone = data.mobile_phone;
			// to remove 62
			this.phone = this.phone.replace('62', '');
			this.isVerified = data.is_verified;
			this.isBanned = data.is_banned;
			this.role = data.roles;
			this.picture = data.picture;
			this.lang = data.language;
			const indexGender = this.genderOptions.findIndex(({ key }) => key === data.profile.gender);
			this.gender = this.genderOptions[indexGender];
			this.birthDate = data.profile.birth_date;
			this.company = data.profile.company;
			this.jobTitle = data.profile.job_title;
			this.postalCode = data.profile.postal_code;
			this.country = data.profile.country;
			this.state = data.profile.state;
			this.city = data.profile.city;
			this.address = data.profile.address;
			const indexLang = this.langOptions.findIndex(({ key }) => key === data.language);
			this.language = this.langOptions[indexLang];
		},
		showPassword() {
			if (this.typePassword === 'password') {
				this.typePassword = 'text';
			} else {
				this.typePassword = 'password';
			}
		},
		searchRoles(nameKey, roles) {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].key === nameKey) {
					return roles[i];
				}
			}
			return roles;
		},
		banningUser() {
			this.isBanning = true;
			const callback = (response) => {
				const user = response.data;
				this.$emit('saved', user);
				this.isBanning = false;
			};
			const errorCallback = () => {
				this.isBanning = false;
			};
			user.updateBanned(this.data.id, callback, errorCallback);
		},
		validEmail(email) {
			return isValidEmail(email);
		},
		validPhone(phone) {
			return phoneValidator(phone);
		},
		removeZero(phone) {
			if (/^0/.test(phone)) {
				this.phone = phone.replace(/^0/, '');
			}
		},
	},
	computed: {
		params() {
			const roles = this.role.map(a => a.key);
			const roleResult = JSON.stringify(roles);
			const email = this.email.trim();
			const fullname = this.fullname.trim();
			const password = this.password;
			const params = {
				email,
				name: fullname,
				is_verified: this.isVerified,
				is_banned: this.isBanned,
				picture: this.picture,
				roles: roleResult,
				birth_date: this.birthDate,
				company: this.company,
				job_title: this.jobTitle,
				postal_code: this.postalCode,
				country: this.country,
				state: this.state,
				city: this.city,
				address: this.address,
				language: this.language.key,
			};
			if (this.phone) {
				// to bringing back 62
				params.mobile_phone = this.resultsPhone.countryCallingCode + this.resultsPhone.nationalNumber;
			}
			if (password && password !== '') {
				params.password = this.password;
			}
			if (this.gender) {
				params.gender = this.gender.key;
			}
			return params;
		},
		isValid() {
			return (
				this.fullname
				&& this.validEmail(this.email)
				&& this.validPhone(this.phone)
			);
		},
	},
	created() {
		this.initData();
	},
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
