<template>
	<modal
		size="small-medium"
		:hide-footer="true"
		@close="close">
		<template slot="header">
			<h3 class="text-white" v-if="!data">{{ $t('Add Category') }}</h3>
			<h3 class="text-white" v-else-if="data && !status">{{ $t('Edit Category') }}</h3>
			<h3 class="text-white" v-else-if="status">{{ $t('Add Sub Category') }}</h3>
		</template>
		<template slot="body">
			<form @submit.prevent="save" style="max-height: 550px; overflow-y: auto">
				<!-- Name -->
				<div class="form-group">
					<label>{{ $t('Name') }}</label>
					<input type="text" name="name" class="form-control" v-model="name" :class="{'error-input': !name}">
				</div>
				<!-- Type -->
				<div class="form-group roles">
					<label class="typo__label">{{ $t('Type') }} </label>
						<div class="mh-40px">
							<multiselect class="roles-input" v-model="type" deselect-label="Can't remove this value" track-by="name" label="name"
								placeholder=" " :options="typeOptions" :searchable="false" :allow-empty="false" :show-labels="false">
							</multiselect>
						</div>
				</div>
				<!-- Description -->
				<div class="form-group">
					<label>{{ $t('Description') }}</label>
					<input type="text" class="form-control" v-model="description"/>
				</div>
				<!-- Background Color -->
				<div class="form-group">
					<label>{{ $t('Color') }}</label>
					<div>
						<!-- color -->
						<div class="col-md-6 pl-0">
							<!-- Color -->
							<custom-input
								class="mb-3"
								type="color"
								align="left"
								pickerPosition="top"
								v-model="backgroundColor"
							/>
						</div>
					</div>
				</div>
			</form>
			<!-- Submit -->
			<button v-if="!data"
				@click="save"
				type="submit"
				class="btn btn-submit btn-primary mt-3"
				:disabled="isFormValid"
				:class="{ 'is-loading': isSaving }">
				{{ $t('Create Category') }}
			</button>
			<button v-else-if="data && !status"
				@click="save"
				type="submit"
				:disabled="isFormValid"
				class="btn btn-submit btn-primary mt-3"
				:class="{ 'is-loading': isSaving }">
				{{ $t('Update Category') }}
			</button>
			<button v-else-if="status"
				@click="save"
				type="submit"
				:disabled="isFormValid"
				class="btn btn-submit btn-primary mt-3"
				:class="{ 'is-loading': isSaving }">
				{{ $t('Create Sub Category') }}
			</button>
		</template>
	</modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import Multiselect from 'vue-multiselect';
import { getAxiosErrorMessage } from '@/lib/helper';
import categoriesApi from '@/api/category';
import CustomInput from '@/components/CustomInput.vue';

export default {
	name: 'CategoryForm',
	props: {
		data: {
			type: Object,
		},
		status: {
			type: Boolean,
		},
		dataSub: {
			type: Object,
		},
	},
	components: {
		Modal,
		CustomInput,
		Multiselect,
	},
	data() {
		return {
			name: '',
			type: '',
			description: '',
			backgroundColor: 'password',
			isSaving: false,
			typeOptions: [
				{ key: 'article', name: 'Article' },
				{ key: 'event', name: 'Event' },
			],
		};
	},
	methods: {
		save() {
			this.isSaving = true;
			const params = this.params;
			const callback = (response) => {
				const category = response.data;
				const message = response.message;
				if (!this.status && !this.dataSub) {
					this.$emit('saved', category);
				} else {
					this.$emit('savedSubCategories', category);
				}
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Category'),
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
					title: this.$t('Category'),
					text: message,
				});
				this.isSaving = false;
			};
			if (this.data && !this.status && !this.dataSub) {
				categoriesApi.update(this.data.id, params, callback, errorCallback);
			} else if (this.dataSub) {
				categoriesApi.update(this.dataSub.id, params, callback, errorCallback);
			} else {
				categoriesApi.create(params, callback, errorCallback);
			}
		},
		close() {
			this.$emit('close');
		},
		initData() {
			this.reset();
			if (this.data && !this.status && !this.dataSub) {
				this.setData(this.data);
			} else if (this.dataSub) {
				this.setData(this.dataSub);
			}
		},
		reset() {
			this.name = '';
			this.type = { key: 'article', name: 'Article' };
			this.description = '';
			this.backgroundColor = '#FF0000';
		},
		setData(data) {
			this.name = data.name;
			const indexType = this.typeOptions.findIndex(({ key }) => key === data.type);
			this.type = this.typeOptions[indexType];
			this.description = data.description;
			this.backgroundColor = data.background_color;
		},
	},
	computed: {
		params() {
			const params = {
				name: this.name,
				type: this.type.key,
				description: this.description,
				background_color: this.backgroundColor,
			};
			if (this.status) params.parent_id = this.data.id;
			return params;
		},
		isFormValid() {
			return (
				!this.name
			);
		},
	},
	created() {
		this.initData();
	},
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
