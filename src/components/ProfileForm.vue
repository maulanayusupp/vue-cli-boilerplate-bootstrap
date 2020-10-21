<template>
	<modal
		size="medium-large"
		:hide-footer="true"
		@close="close">
		<template slot="header">
			<h3 class="text-white">{{ $t('Edit Profile') }}</h3>
		</template>
		<template slot="body">
			<form @submit.prevent="save" style="max-height: 550px; overflow-y: auto" class="pr-3">
				<!-- Role -->
				<!-- <div class="form-group roles">
					<label class="typo__label">Roles</label>
						<div class="mh-40px">
							<multiselect class="roles-input" v-model="role" tag-placeholder="Add Roles"
							placeholder="Search or add a roles" label="label" track-by="key"
							:options="roles" :multiple="true" :searchable="false" :taggable="true" @tag="addTag" :show-labels="false"></multiselect>
						</div>
					</div> -->
				<div class="row">
					<div class="col-md-6">
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
								v-model="phone"
							/>
							<span v-if="!validPhone(phone)" class="text-error">{{ $t('Phone number is invalid') }}</span>
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
						<div class="d-flex">
							<!-- Gender -->
							<div class="form-group roles col-md-6 pl-0 mr-2">
								<label class="typo__label">{{ $t('Gender') }} </label>
									<div class="mh-40px">
										<multiselect class="roles-input" v-model="gender" deselect-label="Can't remove this value" track-by="name" label="name"
											placeholder=" " :options="genderOptions" :searchable="false" :allow-empty="false" :show-labels="false">
										</multiselect>
									</div>
							</div>
							<!-- Birth Date -->
							<div class="form-group pr-0">
								<label>{{ $t('Birth Date') }}</label>
								<flat-pickr
									class="date-event form-control"
									:config="configDateTimePicker"
									v-model="birthDate"
								/>
							</div>
						</div>
					</div>
					<div class="col-md-6">
						<div class="row">
							<div class="col-md-6">
								<!-- Job Title -->
								<div class="form-group">
									<label>{{ $t('Job Title') }}</label>
									<input type="text" name="job" class="form-control" v-model="jobTitle" :required="false" />
								</div>
							</div>
							<!-- Company -->
							<div class="col-md-6">
								<div class="form-group">
									<label>{{ $t('Company') }}</label>
									<input type="text" name="company" class="form-control" v-model="company" :required="false" />
								</div>
							</div>
						</div>
						<!-- Address -->
						<div class="form-group">
							<label>{{ $t('Address') }}</label>
							<input type="text" name="address" class="form-control" v-model="address" :required="false" />
						</div>
						<div class="row">
							<div class="col-md-6">
								<!-- City -->
								<div class="form-group">
									<label>{{ $t('City') }}</label>
									<input type="text" name="state" class="form-control" v-model="city" :required="false" />
								</div>
							</div>
							<div class="col-md-6">
								<!-- State -->
								<div class="form-group">
									<label>{{ $t('State') }}</label>
									<input type="text" name="state" class="form-control" v-model="state" :required="false" />
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<!-- country -->
								<div class="form-group">
									<label>{{ $t('Country') }}</label>
									<input type="text" name="country" class="form-control" v-model="country" :required="false" />
								</div>
							</div>
							<div class="col-md-6">
								<!-- Postal Code -->
								<div class="form-group">
									<label>{{ $t('Postal Code') }}</label>
									<input type="text" name="postalCode" class="form-control" v-model="postalCode" :required="false" />
								</div>
							</div>
						</div>
					</div>
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
import { getAxiosErrorMessage, isValidEmail, phoneValidator } from '@/lib/helper';
import user from '@/api/user';

export default {
	name: 'ProfileForm',
	props: {
		data: {
			type: Object,
		},
	},
	components: {
		Modal,
		Multiselect,
		flatPickr,
		VuePhoneNumberInput,
	},
	data() {
		return {
			email: '',
			fullname: '',
			phone: '',
			lang: 'en',
			picture: '',
			// role: [],
			// roles: [
			// 	{ key: 'client', label: 'Client' },
			// 	{ key: 'super_admin', label: 'Super Admin' },
			// ],
			isSaving: false,
			isBanning: false,
			gender: 'male',
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
			genderOptions: [
				{ key: 'male', name: 'Male' },
				{ key: 'female', name: 'Female' },
			],
			language: 'en',
			langOptions: [
				{ key: 'en', name: 'English' },
				{ key: 'id', name: 'Indonesia' },
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
		// addTag() {
		// 	this.roles.push();
		// 	this.role.push();
		// },
		onUpdatePhone(payload) {
			this.resultsPhone = payload;
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
					title: 'Update Profile',
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
					title: 'Update Profile',
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
			// this.role = [];
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
		},
		setData(data) {
			this.email = data.email;
			this.fullname = data.profile.name;
			this.phone = data.mobile_phone;
			this.phone = this.phone.replace('62', '');
			this.isVerified = data.is_verified;
			this.isBanned = data.is_banned;
			this.picture = data.picture;
			this.lang = data.language;
			this.gender = data.profile.gender;
			this.birthDate = data.profile.birth_date;
			this.company = data.profile.company;
			this.jobTitle = data.profile.job_title;
			this.postalCode = data.profile.postal_code;
			this.country = data.profile.country;
			this.state = data.profile.state;
			this.city = data.profile.city;
			this.address = data.profile.address;
			const indexGender = this.genderOptions.findIndex(({ key }) => key === data.profile.gender);
			this.gender = this.genderOptions[indexGender];
			const indexLang = this.langOptions.findIndex(({ key }) => key === data.language);
			this.language = this.langOptions[indexLang];
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
			const email = this.email.trim();
			const fullname = this.fullname.trim();
			const params = {
				email,
				name: fullname,
				picture: this.picture,
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
