<template>
	<div class="page-article mt-2">
		<div class="container">
			<div class="d-flex justify-content-between">
				<div><h2 class="text-primary mb-4">{{ $t('Articles') }}</h2></div>
			</div>
			<!-- Table Menu -->
			<div class="action-container row">
				<div class="col-md-6 mb-2">
					<div class="d-flex justify-content-start">
						<div>
							<button class="btn btn-submit btn-default text-white mr-2" @click="addItem">{{ $t('Add Article') }}</button>
						</div>
						<!-- export -->
						<div @click="isExportArticleVisible = true" class="hidden">
							<label class="btn btn-primary mr-2 mb-0 mw-fc">
								<div>
									<div>{{ $t('Export Article') }}</div>
								</div>
							</label>
						</div>
						<!-- import -->
						<div @click="isImportArticleVisible = true">
							<label class="btn btn-submit btn-default text-white ml-a mr-2 mb-0 mw-fc">
								<div class="">
									<div>{{ $t('Export Article') }}</div>
								</div>
							</label>
						</div>
					</div>
				</div>
				<div class="col-md-6 mb-2">
					<div class="d-flex justify-content-start">
						<!-- counting -->
						<div class="mr-3 ml-a d-flex">
							<!-- Bulk delete -->
							<div @click="isConfirmRemoveBulkVisible = true" :class="{'disabled': selectedBulk.length <= 0}">
								<label :class="{'disabled': selectedBulk.length <= 0}" class="btn btn-default ml-a mr-3 mb-0 mw-fc">
									<div class="text-white">
										<div>{{ $t('Delete Selected') }}</div>
									</div>
								</label>
							</div>
							<md-menu md-align-trigger md :md-offset-x=2>
								<button class="btn-icon btn p-0 m-0 w-100 btn-limit" md-menu-trigger>
									{{ page * limit - (limit - 1) }} - {{ items.length > 0 ? page * limit : items.length }} of {{ totalItems }}
								</button>
								<!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
								<md-menu-content class="mt-2">
									<md-menu-item @click="changeLimit(10)"><span class="text-center minw-50">10</span></md-menu-item>
									<md-menu-item @click="changeLimit(25)"><span class="text-center minw-50">25</span></md-menu-item>
									<md-menu-item @click="changeLimit(50)"><span class="text-center minw-50">50</span></md-menu-item>
									<md-menu-item @click="changeLimit(100)"><span class="text-center minw-50">100</span></md-menu-item>
									<md-menu-item @click="changeLimit(200)"><span class="text-center minw-50">200</span></md-menu-item>
								</md-menu-content>
							</md-menu>
						</div>
						<div>
							<input type="text" class="form-control" :placeholder="$t('Search')" @input="onKeywordChange" v-model="keyword"/>
						</div>
					</div>
				</div>
			</div>

			<!-- Table -->
			<div class="table-responsive">
				<table class="table table-striped mb-4 mt-4">
					<thead>
						<tr>
							<th><input type="checkbox" v-model="selectAll" @click="select"><i class="form-icon"></i></th>
							<th>{{ $t('No') }}</th>
							<th>{{ $t('Title') }}</th>
							<th>{{ $t('Category') }}</th>
							<th class="text-center">{{ $t('Published') }}</th>
							<th width="5%">{{ $t('') }}</th>
						</tr>
					</thead>
					<div class="p-5 text-center absolute" v-if="isFetching">
						<div class="is-loading large"></div>
					</div>
					<draggable v-model="items" tag="tbody" @change="onArticlesOrderChange">
						<tr v-for="(item,index) in items" :key="item.id">
							<td>
								<label class="form-checkbox pt-1">
									<input type="checkbox" :value="item.id" v-model="selectedBulk">
									<i class="form-icon"></i>
								</label>
							</td>
							<td class="align-middle">{{ numberingList(index) }}</td>
							<td class="align-middle">{{ item.title }}</td>
							<td class="align-middle"><div>{{ item && item.category ? item.category.name : '-' }}</div></td>
							<td class="align-middle text-center"><i class="material-icons" v-if="item.is_published">done</i></td>
							<td class="align-middle">
								<md-menu md-align-trigger :md-offset-x="-40" class="pointer">
									<i class="material-icons" md-menu-trigger>more_vert</i>
									<md-menu-content>
										<md-menu-item @click="detailsItem(item)"><span class="minw-87">{{ $t('Details') }}</span></md-menu-item>
										<md-menu-item @click="editItem(item)"><span class="minw-87">{{ $t('Edit') }}</span></md-menu-item>
										<md-menu-item v-if="item.is_published === 0" @click="openPublishModal(item)"><span class="minw-87">{{ $t('Publish') }}</span></md-menu-item>
										<md-menu-item v-if="item.is_published === 1" @click="openUnpublishModal(item)"><span class="minw-87">{{ $t('Unpublish') }}</span></md-menu-item>
										<md-menu-item @click="confirmRemoveItem(item)"><span class="minw-87">{{ $t('Delete') }}</span></md-menu-item>
									</md-menu-content>
								</md-menu>
							</td>
						</tr>
					</draggable>
				</table>
			</div>
			<!-- No data available -->
			<div class="text-center" v-if="items.length === 0 && !isFetching">{{$t('No Article available')}}</div>

			<!-- Table Pagination -->
			<pagination
				:total-pages="totalPages"
				:current-page="page"
				:last-page="lastPage"
				@select="onPageSelected">
			</pagination>
		</div>

		<!-- Modals -->
		<div class="modals">
			<!-- Article Form -->
			<article-form
				:data="selected"
				@saved="insertItem"
				@close="isFormVisible = false"
				v-if="isFormVisible"
			/>
			<!-- Article details modal -->
			<article-details-modal
				:data="selected"
				@close="isFormDetailsVisible = false"
				v-if="isFormDetailsVisible"
			/>
			<!-- Delete Confirmation -->
			<modal
				@close="isConfirmRemoveVisible = false"
				v-if="isConfirmRemoveVisible && selected">
				<template slot="header">
					<h3 class="text-white">{{ $t('Remove Article') }}</h3>
				</template>
				<template slot="body">
					{{ $t('Are you sure want to delete') }} {{ selected.name }}?
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button class="btn btn-primary" :class="{ 'is-loading': isRemoving }" @click="removeItem(selected)">
							{{ $t('Remove') }}
						</button>
						<button class="btn btn-default" @click="isConfirmRemoveVisible = false">
							{{ $t('Cancel') }}
						</button>
					</div>
				</template>
			</modal>
			<!-- Delete bulk Confirmation -->
			<modal
				@close="isConfirmRemoveBulkVisible = false"
				v-if="isConfirmRemoveBulkVisible && selectedBulk">
				<template slot="header">
					<h3 class="text-white">{{ $t('Remove Article') }}</h3>
				</template>
				<template slot="body">
					{{ $t('Are you sure want to delete') }} {{ selectedBulk.length }} {{ $t('item')}}?
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button
							class="btn btn-primary"
							:class="{ 'is-loading': isRemoving }"
							@click="removeBulk(selected)">
							{{ $t('Remove') }}
						</button>
						<button
							class="btn btn-default"
							@click="isConfirmRemoveBulkVisible = false">
							{{ $t('Cancel') }}
						</button>
					</div>
				</template>
			</modal>
			<!-- Publish confirmation -->
			<modal
				@close="isConfirmPublishVisible = false"
				v-if="isConfirmPublishVisible">
				<template slot="header">
					<h3 class="text-white">{{ $t('Publish Article') }}</h3>
				</template>
				<template slot="body">
					<span v-if="selected.is_published === 0">{{ $t('Are you sure want to Publish') }} {{ selected.title }}?</span>
					<span v-if="selected.is_published === 1">{{ $t('Are you sure want to Unpublish') }} {{ selected.title }}?</span>
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button v-if="selected.is_published === 0" class="btn btn-primary" :class="{ 'is-loading': isPublising }" @click="publishingArticle(selected)">
							{{ $t('Publish') }}
						</button>
						<button v-if="selected.is_published === 1" class="btn btn-primary" :class="{ 'is-loading': isPublising }" @click="publishingArticle(selected)">
							{{ $t('Unpublish') }}
						</button>
						<button class="btn btn-default" @click="isConfirmPublishVisible = false">
							{{ $t('Cancel') }}
						</button>
					</div>
				</template>
			</modal>
			<!-- import data -->
			<modal
				@close="isImportArticleVisible = false"
				v-if="isImportArticleVisible">
				<template slot="header">
					<h3 class="text-white">{{ $t('Import Article') }}</h3>
				</template>
				<template slot="body">
				<div class="modal-import-box">
					<div>
						<vue-xlsx :isShowFileXlsx="isImportArticleVisible" @on-select-file="handleImportBulk" @drop.prevent="handleImportBulk">
							{{ $t('Select File') }}
						</vue-xlsx>
					</div>
				</div>
				<div class="mt-4">
					{{ $t('Download Template For Import') }}:
				</div>
				<div>
					<a href="./../../template-xlsx/Template_Articles_Marimoro.xlsx" download>{{ $t('Download') }} Excel Template - {{ $t('Articles') }}</a>
				</div>
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button @click="acceptImport" :disabled="!tmpArticles" type="submit" class="btn btn-submit btn-primary" :class="{ 'is-loading': isImporting }">
							<span>{{ $t('Upload') }}</span>
						</button>
						<button @click="isImportArticleVisible = false" type="submit" class="btn btn-submit btn-default">
							<span>{{ $t('Cancel') }}</span>
						</button>
					</div>
				</template>
			</modal>
			<loading :active.sync="isExporting" :is-full-page="fullPage" :background-color="colorOverlay" :color="colorLoading">
				<template slot="after">
					<div class="absolute text-center">{{ $t('Exporting') }}...</div>
				</template>
			</loading>
			<!-- export data -->
			<modal
				@close="isExportArticleVisible = false"
				v-if="isExportArticleVisible"
				:hide-footer="true">
				<template slot="header">
					<h3 class="text-white">{{ $t('Export Article') }}</h3>
				</template>
				<template slot="body">
				<div>
					<p class="text-base text-black mb-3">
						{{ $t('Please select file format for data export') }}:
					</p>
					<div class="p-2">
						<div
							class="cursor-pointer"
							:class="{ 'is-loading': isExporting }"
							@click="exportArticles('excel')">
							<img src="/img/xls.png" alt="xls" width="20px;"/>
							<span class="ml-2 text-base item-text-export text-black">{{ $t('Excel File') }}</span>
						</div>
					</div>
					<div class="p-2">
						<div
							class="cursor-pointer"
							:class="{ 'is-loading': isExporting }"
							@click="exportArticles('docx')">
							<img src="/img/doc.png" alt="xls" width="20px;"/>
							<span class="ml-2 text-base item-text-export text-black">{{ $t('Document File') }}</span>
						</div>
					</div>
				</div>
				</template>
			</modal>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from 'vue-loading-overlay';
import draggable from 'vuedraggable';
import VueXlsx from '@/components/ImportExcel.vue';
import Modal from '@/components/Modal.vue';
import ArticleForm from '@/components/ArticleForm.vue';
import ArticleDetailsModal from '@/components/ArticleDetailsModal.vue';
import Pagination from '@/components/Pagination.vue';
import {
	getAxiosErrorMessage, delay, duplicateVar, downloadBlob,
} from '@/lib/helper';
import articlesApi from '@/api/article';

export default {
	name: 'Articles',
	components: {
		Modal,
		ArticleForm,
		Pagination,
		VueXlsx,
		Loading,
		draggable,
		ArticleDetailsModal,
	},
	data() {
		return {
			page: 1,
			limit: 10,
			orderBy: 'id',
			sortBy: 'asc',
			keyword: '',
			isAll: false,
			items: [],
			tmpArticles: [],
			selected: null,
			// totalPages: 2,
			totalItems: 0,
			lastPage: 1,
			isFormVisible: false,
			isConfirmRemoveVisible: false,
			isRemoving: false,
			isFetching: false,
			hover: false,
			hoverItem: null,
			isImportArticleVisible: false,
			isExportArticleVisible: false,
			isImporting: false,
			isExporting: false,
			fullPage: true,
			colorOverlay: '#000000',
			colorLoading: '#FFFFFF',
			itemCounting: '',
			selectAll: false,
			isConfirmRemoveBulkVisible: false,
			isConfirmPublishVisible: false,
			selectedBulk: [],
			isPublising: false,
			isPublish: false,
			isFormDetailsVisible: false,
		};
	},
	methods: {
		...mapActions({
		}),
		select() {
			if (this.items && !this.isFetching) {
				this.selectedBulk = [];
				if (!this.selectAll) {
					// eslint-disable-next-line
					for (const item in this.items) {
						this.selectedBulk.push(this.items[item].id);
					}
				}
			}
		},
		fetch(reset = false, page) {
			this.isFetching = true;
			if (reset) {
				this.page = 1;
				this.items = [];
			}
			if (page) this.page = page;
			const params = this.fetchParams;
			const callback = (response) => {
				const items = response.data.data;
				if (items.length < this.limit) this.isAll = true;
				this.items = items;
				this.totalItems = response.data.total;
				this.lastPage = response.lastPage;
				this.isFetching = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Articles'),
					text: message,
				});
				this.isFetching = false;
			};
			articlesApi.getArticles(params, callback, errorCallback);
		},
		changeLimit(value) {
			this.limit = value;
			this.fetch(true);
		},
		onKeywordChange() {
			delay(() => {
				this.fetch(true);
			}, 500);
		},
		insertItem(item) {
			const index = this.items.findIndex(({ id }) => id === item.id);
			if (index === -1) {
				this.items.push(item);
			} else {
				this.$set(this.items, index, item);
			}
		},
		addItem() {
			this.selected = null;
			this.isFormVisible = true;
		},
		detailsItem(item) {
			this.selected = duplicateVar(item);
			this.isFormDetailsVisible = true;
		},
		editItem(item) {
			this.selected = duplicateVar(item);
			this.isFormVisible = true;
		},
		confirmRemoveItem(item) {
			this.selected = duplicateVar(item);
			this.isConfirmRemoveVisible = true;
		},
		removeItem(item) {
			this.isRemoving = true;
			const callback = (response) => {
				const message = response.message;
				const index = this.items.findIndex(({ id }) => id === item.id);
				if (index !== -1) {
					this.items.splice(index, 1);
				}
				this.isRemoving = false;
				this.isConfirmRemoveVisible = false;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Remove Article'),
					text: message,
				});
			};
			const errorCallback = (e) => {
				this.isRemoving = false;
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Remove Article'),
					text: message,
				});
			};
			articlesApi.delete(item.id, callback, errorCallback);
		},
		removeBulk() {
			this.isRemovingBulk = true;
			const callback = (response) => {
				const message = response.message;
				for (let index = 0; index < this.selectedBulk.length; index++) {
					const index = this.items.findIndex(({ id }) => id === this.selectedBulk[index]);
					if (index !== -1) {
						this.items.splice(index, 1);
					}
				}
				this.isRemovingBulk = false;
				this.isConfirmRemoveBulkVisible = false;
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Remove Article'),
					text: message,
				});
				this.selectAll = false;
				this.selectedBulk = [];
			};
			const errorCallback = (e) => {
				this.isRemovingBulk = false;
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Remove Article'),
					text: message,
				});
				this.isConfirmRemoveBulkVisible = false;
			};
			articlesApi.deleteBulk(JSON.stringify(this.selectedBulk), callback, errorCallback);
		},
		onPageSelected(page) {
			this.fetch(true, page);
		},
		handleImportBulk(excelDataConverted) {
			const excelData = duplicateVar(excelDataConverted.body);
			this.tmpArticles = excelData;
		},
		acceptImport() {
			this.createBulk(this.tmpArticles);
		},
		createBulk() {
			this.isImporting = true;
			const callback = (response) => {
				const data = response.data;
				const message = response.message;
				const newArticles = data;
				newArticles.forEach((item) => {
					this.insertItem(item);
				});
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Import Article'),
					text: message,
				});
				this.isImportArticleVisible = false;
				this.isImporting = false;
				this.tmpArticles = [];
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Import Article'),
					text: message,
				});
				this.isImportArticleVisible = false;
				this.isImporting = false;
			};
			articlesApi.createBulk((this.tmpArticles), callback, errorCallback);
		},
		exportArticles(type) {
			this.isExporting = true;
			const params = {
				page: 1,
				limit: 3000,
			};
			const callback = (response) => {
				const contents = response;
				downloadBlob(contents, { name: `${this.$t('Articles')}`, type });
				this.isExporting = false;
			};
			const errorCallback = () => {
				this.isExporting = false;
			};
			articlesApi.exportList(type, params, callback, errorCallback);
		},
		numberingList(index) {
			if (this.page >= 1) {
				return index + 1 + (this.page * 10 - 10);
			}
			return index + 1;
		},
		onArticlesOrderChange() {
			const ids = this.items.map(({ id }) => id);
			articlesApi.reorder(ids);
		},
		openPublishModal(user) {
			this.isPublish = true;
			this.isConfirmPublishVisible = true;
			this.selected = user;
		},
		openUnpublishModal(user) {
			this.isPublish = false;
			this.isConfirmPublishVisible = true;
			this.selected = user;
		},
		publishingArticle(article) {
			this.isPublising = true;
			const params = {
				is_published: this.isPublish,
			};
			const callback = (response) => {
				const article = response.data;
				const message = response.message;
				this.insertItem(article);
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Article'),
					text: message,
				});
				this.isPublising = false;
				this.isConfirmPublishVisible = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Article'),
					text: message,
				});
				this.isConfirmPublishVisible = false;
				this.isPublising = false;
			};
			articlesApi.update(article.id, params, callback, errorCallback);
		},
	},
	computed: {
		...mapGetters({
			user: 'user',
		}),
		fetchParams() {
			const params = {
				page: this.page,
				limit: this.limit,
				order_by: 'order',
				sort_by: this.sortBy,
			};
			const keyword = this.keyword.trim();
			if (keyword !== '') params.keyword = keyword;
			return params;
		},
		totalPages() {
			const total = Math.ceil(this.totalItems / this.limit);
			return total;
		},
	},
	watch: {
		isVerified() {
			this.fetch(true);
		},
		roleFilter() {
			this.fetch(true);
		},
	},
	created() {
		this.fetch();
	},
};
</script>
