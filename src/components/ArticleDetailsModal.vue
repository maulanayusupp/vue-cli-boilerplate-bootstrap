<template>
	<modal
		size="large"
		:hide-footer="true"
		@close="close">
		<template slot="header">
			<h3 class="text-white">{{ $t('Details Article') }}</h3>
		</template>
		<template slot="body">
				<!-- Title -->
				<div class="form-group">
					<label class="text-primary">{{ $t('Title') }}</label>
					<div>{{data.title}}</div>
				</div>
				<div class="form-group roles disabled">
					<label class="typo__label text-primary">Category</label>
						<div>{{category && category.name}}</div>
				</div>
				<!-- Content -->
				<div class="form-group">
					<label class="text-primary">{{ $t('Content') }}</label>
						<div v-html="data.content"></div>
				</div>
				<!-- Excerpt -->
				<div class="form-group">
					<label class="text-primary">{{ $t('Excerpt') }}</label>
					<div>{{data.excerpt}}</div>
				</div>
				<!-- Type -->
				<div class="form-group roles disabled">
					<label class="typo__label text-primary">{{ $t('Type') }} </label>
						<div>{{type && type.name}}</div>
				</div>
				<!-- Is Publish -->
				<div>
					<div v-if="isPublish" class="text-primary">{{ $t('Published') }}<md-icon class="icon-green pt-2">check</md-icon></div>
					<div v-else class="text-primary">{{ $t('Published') }}<md-icon class="icon-danger pt-2">close</md-icon></div>
				</div>
			<!-- Close -->
			<button
				@click="close"
				class="btn btn-submit btn-primary mt-3">
				{{ $t('Close') }}
			</button>
		</template>
	</modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import { getAxiosErrorMessage } from '@/lib/helper';
import categoriesApi from '@/api/category';

export default {
	name: 'ArticleDetailsModal',
	props: {
		data: {
			type: Object,
		},
	},
	components: {
		Modal,
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
		close() {
			this.$emit('close');
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
	},
	created() {
		this.fetchCategories();
	},
};
</script>
