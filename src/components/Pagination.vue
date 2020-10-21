<template>
	<div
		class="text-right"
		v-if="totalPages > 1">
		<nav class="d-inline-block">
			<ul class="pagination">
				<li
					v-if="currentPage > 1"
					class="page-item">
					<div
						class="page-link cur-p"
						aria-label="Previous"
						@click="pageChange(currentPage - 1)">
						<span aria-hidden="true">&laquo;</span>
						<span class="sr-only">{{ $t('Previous') }}</span>
					</div>
				</li>
				<li
					v-for="(item, index) in visiblePaginationPages"
					:key="index"
					:class="{'active' : currentPage === item }"
					class="page-item">
					<span
						v-if="item === '...'"
						class="page-link">
						{{ item }}
					</span>
					<div
						v-else
						class="page-link cur-p"
						@click="pageChange(item)">
						{{ item }}
					</div>
				</li>
				<li
					v-if="currentPage < parseInt(totalPages)"
					class="page-item">
					<div
						class="page-link cur-p"
						aria-label="Next"
						@click="pageChange(currentPage + 1)">
						<span aria-hidden="true">&raquo;</span>
						<span class="sr-only">{{ $t('Next') }}</span>
					</div>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
export default {
	name: 'Pagination',
	props: {
		totalPages: {
			type: Number,
			default: 0,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		lastPage: {
			type: Number,
			default: 1,
		},
	},
	computed: {
		visiblePaginationPages() {
			const pages = [];
			const paginationLength = 7;
			const pageStep = 3;
			let minPage = this.currentPage - pageStep;

			if (minPage < 1) minPage = 1;
			let maxPage = this.currentPage + pageStep;
			if (maxPage < paginationLength) {
				maxPage = Number(paginationLength);
			}

			if (maxPage > this.totalPages) {
				maxPage = Number(this.totalPages);
			}
			for (let index = minPage; index <= maxPage; index++) {
				pages.push(index);
			}
			if (maxPage > paginationLength) {
				pages.unshift('...');
				pages.unshift(1);
			}
			if (this.currentPage < (this.totalPages - paginationLength)) {
				pages.push('...');
				pages.push(this.totalPages);
			}
			return pages;
		},
	},
	methods: {
		// page change
		pageChange(val) {
			window.scrollTo(0, 0);
			this.$emit('select', val);
		},
	},
};
</script>
