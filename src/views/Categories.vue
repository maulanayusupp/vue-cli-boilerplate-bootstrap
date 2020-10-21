<template>
	<div class="page-user mt-2">
		<div class="container">
			<div class="d-flex justify-content-between">
				<div><h2 class="text-primary mb-4">{{ $t('Categories') }}</h2></div>
			</div>
			<!-- Table Menu -->
			<div class="action-container row">
				<div class="col-md-6 mb-2">
					<div class="d-flex justify-content-start">
						<div>
							<button
								class="btn btn-submit btn-default text-white mr-2"
								@click="addItem">
								{{ $t('Add Category') }}
							</button>
						</div>
						<!-- export -->
						<div @click="isExportCategoryVisible = true">
							<label class="btn btn-primary mr-2 mb-0 mw-fc">
								<div>
									<div>{{ $t('Export Category') }}</div>
								</div>
							</label>
						</div>
						<!-- import -->
						<div @click="isImportCategoryVisible = true">
							<label class="btn btn-submit btn-default text-white ml-a mr-2 mb-0 mw-fc">
								<div class="">
									<div>{{ $t('Import Category') }}</div>
								</div>
							</label>
						</div>
					</div>
				</div>
				<div class="col-md-6 mb-2">
					<div class="d-flex justify-content-end">
						<!-- Bulk delete -->
						<div class="mr-3">
							<div @click="isConfirmRemoveBulkVisible = true" :class="{'disabled': selectedBulk.length <= 0}">
								<label :class="{'disabled': selectedBulk.length <= 0}" class="btn btn-default ml-a mr-3 mb-0 mw-fc">
									<div class="text-white">
										<div>{{ $t('Delete Selected') }}</div>
									</div>
								</label>
							</div>
						</div>
						<div class="mr-3">
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
						<div class="mr-3">
							<input
								type="text"
								class="form-control"
								:placeholder="$t('Search')"
								@input="onKeywordChange"
								v-model="keyword"
							/>
						</div>
					</div>
				</div>
			</div>
			<!-- Main Table -->
			<div class="table-responsive">
				<table class="table table-striped mb-4 mt-4">
					<thead>
						<tr>
							<th><input type="checkbox" v-model="selectAll" @click="select"><i class="form-icon"></i></th>
							<th>{{ $t('No') }}</th>
							<th width="50%">{{ $t('Name') }}</th>
							<th>{{ $t('Type') }}</th>
							<th width="20%">{{ $t('Description') }}</th>
							<th width="10%">{{ $t('') }}</th>
						</tr>
					</thead>
					<div class="p-5 text-center absolute" v-if="isFetching">
						<div class="is-loading large"></div>
					</div>
					<draggable v-model="items" tag="tbody" @change="onCategoriesOrderChange">
						<tr
							v-for="(item, index) in items"
							:key="item.id">
							<td>
								<label class="form-checkbox pt-1">
									<input type="checkbox" :value="item.id" v-model="selectedBulk">
									<i class="form-icon"></i>
								</label>
							</td>
							<td class="pt-3 ">{{ numberingList(index) }}</td>
							<td @click.stop="selectedRow(item)" class="pt-3 relative pointer ">{{ item.name }}
								<!-- sub categories -->
								<div v-if="selected && selected.id === item.id && item.subCategories.length > 0" class="mt-3">
									<tr v-for="(itemSub) in item.subCategories"
										:key="itemSub.id">
										<td style="background-color: #E6E6E6; padding-top: 17px; padding-bottom: 17px;" width="100%" class="pt-3">{{ itemSub.name }}</td>
										<td style="background-color: #E6E6E6;">
											<div class="d-flex">
												<button
													class="btn btn-icon-action btn-icon mr-1"
													v-tooltip="$t('Edit')"
													@click.stop="editItemSub(itemSub)">
													<i class="material-icons md-18">edit</i>
												</button>
												<button
													class="btn btn-icon-action btn-icon"
													v-tooltip="$t('Delete')"
													@click.stop="confirmRemoveItemSub(itemSub)">
													<i class="material-icons md-18">delete</i>
												</button>
											</div>
										</td>
									</tr>
								</div>
							</td>
							<td @click="selectedRow(item)" class="pt-3 pointer capitalize">{{ item.type }}</td>
							<td @click="selectedRow(item)" class="pt-3 pointer"><div class="truncate-description-category">{{item.description }}</div></td>
							<td class="">
								<md-menu md-align-trigger :md-offset-x="-40" class="pointer">
									<i class="material-icons" md-menu-trigger>more_vert</i>
									<md-menu-content>
										<md-menu-item @click="editItem(item)"><span class="minw-87">{{ $t('Edit') }}</span></md-menu-item>
										<md-menu-item @click="subCategoryItem(item)"><span class="minw-87">{{ $t('Add Sub Category') }}</span></md-menu-item>
										<md-menu-item @click="confirmRemoveItem(item)"><span class="minw-87">{{ $t('Delete') }}</span></md-menu-item>
									</md-menu-content>
								</md-menu>
							</td>
							<!-- sub categories -->
						</tr>
					</draggable>
				</table>
			</div>
			<!-- no data available -->
			<div class="text-center" v-if="items.length === 0 && !isFetching">{{$t('No Category available')}}</div>
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
			<!-- Category Form -->
			<category-form
				:data="selected"
				:status="addSub"
				:dataSub="dataSub"
				@saved="insertItem"
				@savedSubCategories="insertItemSubCategories"
				@close="closeModalCategory"
				v-if="isFormVisible"
			/>
			<!-- Delete Confirmation -->
			<modal
				@close="isConfirmRemoveVisible = false"
				v-if="isConfirmRemoveVisible && selected">
				<template slot="header">
					<h3 class="text-white">{{ $t('Remove Category') }}</h3>
				</template>
				<template slot="body">
					{{ $t('Are you sure want to delete') }} {{ selected.name }}?
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button
							class="btn btn-primary"
							:class="{ 'is-loading': isRemoving }"
							@click="removeItem(selected)">
							{{ $t('Remove') }}
						</button>
						<button
							class="btn btn-default"
							@click="isConfirmRemoveVisible = false">
							{{ $t('Cancel') }}
						</button>
					</div>
				</template>
			</modal>
			<!-- Delete Sub Category Confirmation -->
			<modal
				@close="isConfirmRemoveVisibleSub = false"
				v-if="isConfirmRemoveVisibleSub && dataSub">
				<template slot="header">
					<h3 class="text-white">{{ $t('Remove Category') }}</h3>
				</template>
				<template slot="body">
					{{ $t('Are you sure want to delete') }} {{ dataSub.name }}?
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button
							class="btn btn-primary"
							:class="{ 'is-loading': isRemoving }"
							@click="removeItem(dataSub)">
							{{ $t('Remove') }}
						</button>
						<button
							class="btn btn-default"
							@click="isConfirmRemoveVisibleSub = false">
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
					<h3 class="text-white">{{ $t('Remove Category') }}</h3>
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
			<!-- import data -->
			<modal
				@close="isImportCategoryVisible = false"
				v-if="isImportCategoryVisible">
				<template slot="header">
					<h3 class="text-white">{{ $t('Import Category') }}</h3>
				</template>
				<template slot="body">
				<div class="modal-import-box">
					<div>
						<div>
							<vue-xlsx :isShowFileXlsx="isImportCategoryVisible" @on-select-file="handleImportBulk" @drop.prevent="handleImportBulk">
									{{ $t('Select File') }}
							</vue-xlsx>
						</div>
					</div>
				</div>
				<div class="mt-4">
				{{ $t('Download Template For Import') }}:
				</div>
				<div>
					<a href="./../../template-xlsx/Template_Categories_Marimoro.xlsx" download>{{ $t('Download') }} Excel Template - {{ $t('Categories') }}</a>
				</div>
				</template>
				<template slot="footer">
					<div class="w-100 flex-center">
						<button
							@click="acceptImport"
							:disabled="!tmpCategories"
							type="submit"
							class="btn btn-submit btn-primary"
							:class="{ 'is-loading': isImporting }">
							<span>{{ $t('Upload') }}</span>
						</button>
						<button
							@click="isImportCategoryVisible = false"
							type="submit"
							class="btn btn-submit btn-default">
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
				@close="isExportCategoryVisible = false"
				v-if="isExportCategoryVisible"
				:hide-footer="true">
				<template slot="header">
					<h3 class="text-white">{{ $t('Export Category') }}</h3>
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
							@click="exportCategories('excel')">
							<img src="/img/xls.png" alt="xls" width="20px;"/>
							<span class="ml-2 text-base item-text-export text-black">{{ $t('Excel File') }}</span>
						</div>
					</div>
					<div class="p-2">
						<div
							class="cursor-pointer"
							:class="{ 'is-loading': isExporting }"
							@click="exportCategories('docx')">
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
import CategoryForm from '@/components/CategoryForm.vue';
import draggable from 'vuedraggable';
import Loading from 'vue-loading-overlay';
import VueXlsx from '@/components/ImportExcel.vue';
import Modal from '@/components/Modal.vue';
import Pagination from '@/components/Pagination.vue';
import {
	getAxiosErrorMessage, delay, duplicateVar, downloadBlob,
} from '@/lib/helper';
import categoriesApi from '@/api/category';

export default {
	name: 'Categories',
	components: {
		CategoryForm,
		Modal,
		Pagination,
		VueXlsx,
		Loading,
		draggable,
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
			tmpCategories: [],
			selected: null,
			// totalPages: 2,
			totalItems: 0,
			lastPage: 1,
			isFormVisible: false,
			isFormSettingVisible: false,
			isConfirmRemoveVisible: false,
			isConfirmRemoveBulkVisible: false,
			isConfirmRemoveVisibleSub: false,
			isRemoving: false,
			isFetching: false,
			isVerified: '',
			roleFilter: '',
			isImportCategoryVisible: false,
			isExportCategoryVisible: false,
			isImporting: false,
			isExporting: false,
			fullPage: true,
			colorOverlay: '#000000',
			colorLoading: '#FFFFFF',
			itemCounting: '',
			selectAll: false,
			selectedBulk: [],
			addSub: false,
			dataSub: null,
		};
	},
	methods: {
		...mapActions({
		}),
		fetch(reset = false, page) {
			this.isFetching = true;
			if (reset) {
				this.page = 1;
				this.items = [];
			}
			if (page) this.page = page;
			const params = this.fetchParams;
			const callback = (response) => {
				const items = response.data;
				if (items.length < this.limit) this.isAll = true;
				this.items = items;
				this.totalItems = response.total;
				this.lastPage = response.lastPage;
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
			categoriesApi.getCategories(params, callback, errorCallback);
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
		insertItemSubCategories() {
			this.fetch();
		},
		addItem() {
			this.selected = null;
			this.isFormVisible = true;
		},
		subCategoryItem(item) {
			this.addSub = true;
			this.selected = item;
			this.isFormVisible = true;
		},
		editItem(item) {
			this.selected = item;
			this.isFormVisible = true;
		},
		editItemSub(item) {
			this.dataSub = item;
			this.isFormVisible = true;
		},
		confirmRemoveItem(item) {
			this.selected = item;
			this.isConfirmRemoveVisible = true;
		},
		confirmRemoveItemSub(item) {
			this.dataSub = item;
			this.isConfirmRemoveVisibleSub = true;
		},
		closeModalCategory() {
			this.addSub = false;
			this.isFormVisible = false;
			this.dataSub = null;
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
					title: this.$t('Remove Category'),
					text: message,
				});
				this.fetch();
				this.closeModalCategory();
			};
			const errorCallback = (e) => {
				this.isRemoving = false;
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Remove Category'),
					text: message,
				});
			};
			categoriesApi.delete(item.id, callback, errorCallback);
		},
		onPageSelected(page) {
			this.fetch(true, page);
		},
		handleImportBulk(excelDataConverted) {
			const excelData = duplicateVar(excelDataConverted.body);
			this.tmpCategories = excelData;
		},
		acceptImport() {
			this.createBulk(this.tmpCategories);
		},
		createBulk() {
			this.isImporting = true;
			const callback = (response) => {
				const data = response.data;
				const message = response.message;
				const newCategories = data;
				newCategories.forEach((item) => {
					this.insertItem(item);
				});
				this.$notify({
					group: 'app',
					type: 'success',
					title: this.$t('Import Category'),
					text: message,
				});
				this.isImportCategoryVisible = false;
				this.isImporting = false;
				this.tmpCategories = [];
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Import Category'),
					text: message,
				});
				this.isImportCategoryVisible = false;
				this.isImporting = false;
			};
			categoriesApi.createBulk((this.tmpCategories), callback, errorCallback);
		},
		exportCategoriess(type) {
			this.isExporting = true;
			const params = {
				page: 1,
				limit: 3000,
			};
			const callback = (response) => {
				const contents = response;
				downloadBlob(contents, { name: `${this.$t('Categoriess')}`, type });
				this.isExporting = false;
			};
			const errorCallback = () => {
				this.isExporting = false;
			};
			categoriesApi.exportList(type, params, callback, errorCallback);
		},
		numberingList(index) {
			if (this.page >= 1) {
				return index + 1 + (this.page * 10 - 10);
			}
			return index + 1;
		},
		selectedRow(item) {
			if (this.selected === item) {
				this.selected = null;
			} else {
				this.selected = item;
			}
		},
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
		// reorder
		onCategoriesOrderChange() {
			const categories = this.items.map(({ id, subCategories }) => ({ id, subCategories }));
			categoriesApi.reorder(categories);
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
					title: this.$t('Remove Category'),
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
					title: this.$t('Remove Category'),
					text: message,
				});
				this.isConfirmRemoveBulkVisible = false;
			};
			categoriesApi.deleteBulk(JSON.stringify(this.selectedBulk), callback, errorCallback);
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
