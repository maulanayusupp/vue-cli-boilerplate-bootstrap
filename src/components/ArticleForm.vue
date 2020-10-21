<template>
	<modal
		size="large"
		:hide-footer="true"
		@close="close">
		<template slot="header">
			<h3 class="text-white" v-if="!data">{{ $t('Add Article') }}</h3>
			<h3 class="text-white" v-else>{{ $t('Edit Article') }}</h3>
		</template>
		<template slot="body">
			<form @submit.prevent="save" style="max-height: 550px; overflow-y: auto" class="pr-2">
				<!-- Title -->
				<div class="form-group">
					<label>{{ $t('Title') }}</label>
					<input type="text" name="title" class="form-control" v-model="title" :class="{'error-input': !title}">
				</div>
				<div class="form-group roles">
					<label class="typo__label">Category</label>
						<div class="mh-40px">
							<multiselect class="roles-input" :class="{'error': !category}" v-model="category" tag-placeholder="Add Category"
							placeholder="Search or add a category" label="name" track-by="name"
							:options="categories" :searchable="false" :allow-empty="false" :show-labels="false"></multiselect>
						</div>
				</div>
				<!-- Content -->
				<div class="form-group">
					<label>{{ $t('Content') }}</label>
					<quill-editor id="editor-container" :content="content" v-model="content">
					</quill-editor>
				</div>
				<!-- Excerpt -->
				<div class="form-group mt-7">
					<label>{{ $t('Excerpt') }}</label>
					<input type="text" class="form-control" v-model="excerpt"/>
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
				<!-- checkbox -->
				<div class="d-flex justify-content-between mt-2">
					<!-- Is Publish -->
					<label class="custom-control custom-checkbox mb-3">
						<input type="checkbox" class="custom-control-input" v-model="isPublish">
						<span class="custom-control-label pt-1">{{ $t('Published') }}</span>
					</label>
				</div>
			</form>
			<!-- Submit -->
			<button v-if="!data"
				@click="save"
				type="submit"
				class="btn btn-submit btn-primary mt-3"
				:disabled="isFormValid"
				:class="{ 'is-loading': isSaving }">
				{{ $t('Create Article') }}
			</button>
			<button v-else
				@click="save"
				type="submit"
				:disabled="isFormValid"
				class="btn btn-submit btn-primary mt-3"
				:class="{ 'is-loading': isSaving }">
				{{ $t('Update Article') }}
			</button>
		</template>
	</modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import { getAxiosErrorMessage } from '@/lib/helper';
import Multiselect from 'vue-multiselect';
import articlesApi from '@/api/article';
import categoriesApi from '@/api/category';

export default {
	name: 'ArticleForm',
	props: {
		data: {
			type: Object,
		},
	},
	components: {
		Modal,
		Multiselect,
	},
	data() {
		return {
			title: '',
			type: '',
			excerpt: '',
			content: '',
			isPublish: 'false',
			category: null,
			isSaving: false,
			categories: [],
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
					this.$emit('saved', category);
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Article'),
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
					title: this.$t('Article'),
					text: message,
				});
				this.isSaving = false;
			};
			if (this.data) {
				articlesApi.update(this.data.id, params, callback, errorCallback);
			} else {
				articlesApi.create(params, callback, errorCallback);
			}
		},
		close() {
			this.$emit('close');
		},
		initData() {
			this.reset();
		},
		reset() {
			this.title = '';
			this.type = { key: 'article', name: 'Article' };
			this.excerpt = '';
			this.content = '';
			this.isPublish = 'false';
			this.category = null;
		},
		setData(data) {
			this.title = data.title;
			const indexType = this.typeOptions.findIndex(({ key }) => key === data.type);
			this.type = this.typeOptions[indexType];
			this.excerpt = data.excerpt;
			this.content = data.content;
			this.isPublish = data.is_published;
			const index = this.categories.findIndex(({ id }) => id === data.category_id);
			this.category = this.categories[index];
		},
		fetchCategories() {
			const paramsCategories = {
				page: 1,
				limit: 1000,
			};
			const callback = (response) => {
				const items = response.data;
				this.categories = items;
				// adding subCategories to list
				for (let index = 0; index < this.categories.length; index++) {
					// console.log(this.categories[index].subCategories.length > 0);
					if (this.categories[index] && this.categories[index].subCategories.length > 0) {
						for (let indexSub = 0; indexSub < this.categories[index].subCategories.length; indexSub++) {
							const elementSub = this.categories[index].subCategories[indexSub];
							this.categories.push(elementSub);
						}
					}
				}
				if (this.data) {
					this.setData(this.data);
				}
				this.isFetching = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Categories'),
					text: message,
				});
				this.isFetching = false;
			};
			categoriesApi.getCategories(paramsCategories, callback, errorCallback);
		},
	},
	computed: {
		params() {
			const category = this.category ? this.category : '';
			const params = {
				title: this.title,
				type: this.type.key,
				excerpt: this.excerpt,
				content: this.content,
				is_published: this.isPublish,
				category_id: category && category.id ? category.id : '',
			};
			if (this.status) params.parent_id = this.data.id;
			return params;
		},
		isFormValid() {
			return (
				!this.title || !this.category
			);
		},
	},
	created() {
		this.initData();
		this.fetchCategories();
	},
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
