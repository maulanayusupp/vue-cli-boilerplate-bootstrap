<template>
	<div>
		<loading :active.sync="importingUser" :is-full-page="fullPage" :background-color="colorOverlay" :color="colorLoading">
			<template slot="after">
				<div class="absolute text-center">{{ $t('loading') }}...</div>
			</template>
		</loading>
		<div class="vue-xlsx-container mr-1" @drop.prevent="addFileXlsx" @dragover.prevent>
			<button type="button" class="btn btn-primary pr-0 pl-0" @click="handleUploadBtnClick">
				<slot></slot>
			</button>
			<input :id="uploadInputId" type="file" :accept="accept" class="c-hide" @change="handkeFileChange">
		</div>
		<span v-if="checkIsImport()">
			<mdChip class="pr-1 pl-1 pt-0" color="green" text-color="white">
				{{ rawFile.name }}
			</mdChip>
		</span>
	</div>
</template>

<script>
/* eslint-disable */
import XLSX from 'xlsx';
import Loading from 'vue-loading-overlay';

export default {
	components: {
		Loading,
	},
	name: 'vue-xlsx',
		data() {
			return {
				rawFile: null,
				workbook: null,
				tableData: {
					header: [],
					body: []
				},
				uploadInputId: (new Date().getUTCMilliseconds()),
				fullPage: true,
				colorOverlay: '#000000',
				colorLoading: '#FFFFFF',
				importingUser: false,
			}
		},
		props: {
			accept: {
				type: String,
				default: '.xlsx, .xls',
			},
			isShowFileXlsx: {
				type: Boolean,
			}
		},
		computed: {
			rABS() {
				return window.xlsxEventBus.XLSX_EVENTS_DATA.options.rABS
			}
		},
		methods: {
			checkIsImport() {
				if (!this.isShowFileXlsx) {
					this.rawFile = null;
				}
				return this.rawFile && this.isShowFileXlsx
			},
			// eslint no-empty: "error"
			addFileXlsx(e) {
				const droppedFiles = e.dataTransfer.files;
				this.rawFile = droppedFiles[0];
				this.fileConvertToWorkbook(this.rawFile)
					.then((workbook) => {
						let xlsxArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
						this.workbook = workbook
						this.initTable(
							this.xlsxArrToTableArr(xlsxArr)
						)
					})
					.catch((err) => {
						// empty
					})
			},
			handkeFileChange(e) {
				if (this.rawFile !== null) {
					return
				}
				this.importingUser = true;
				this.rawFile = e.target.files[0]
				this.fileConvertToWorkbook(this.rawFile)
					.then((workbook) => {
						let xlsxArr = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
						this.workbook = workbook
						this.initTable(
							this.xlsxArrToTableArr(xlsxArr),
						)
					this.importingUser = false;
					})
					.catch((err) => {
						console.error(err);
						this.importingUser = false;
					})
			},
			fileConvertToWorkbook(file) {
				let reader = new FileReader()
				let fixdata = (data) => {
					let o = "",
						l = 0,
						w = 10240
					for (; l < data.byteLength / w; ++l) {
						o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
					}
					o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
					return o
				}
				return new Promise((resolve, reject) => {
					try {
						reader.onload = (renderEvent) => {
							let data = renderEvent.target.result
							if (this.rABS) {
								/* if binary string, read with type 'binary' */
								resolve(XLSX.read(data, {
									type: 'binary'
								}))
							} else {
								/* if array buffer, convert to base64 */
								let arr = fixdata(data)
								resolve(XLSX.read(btoa(arr), {
									type: 'base64'
								}))
							}
						}
						reader.onerror = (error) => {
							reject(error)
						}
						if (this.rABS) {
							reader.readAsBinaryString(file)
						} else {
							reader.readAsArrayBuffer(file)
						}
					} catch (error) {
						reject(error)
					}
				})
			},
			// custom - maulana yusup abdullah
			checkIfHeaderExist(headers, header) {
				let isExist = false;
				for (let i = 0; i < headers.length; i++) {
					const curr = headers[i];
					if (curr === header) {
						isExist = true;
					}
				};
				return isExist;
			},
			// custom - maulana yusup abdullah
			pushToHeaders(headers, rowHeaders) {
				let newHeaders = headers;
				if (newHeaders.length === 0) {
					newHeaders = rowHeaders;
					return newHeaders;
				};
				for (let i = 0; i < rowHeaders.length; i++) {
					const rowHead = rowHeaders[i];
					for (let j = 0; j < newHeaders.length; j++) {
						const currHead = newHeaders[j];
						const isExist = this.checkIfHeaderExist(newHeaders, rowHead);
						if (!isExist) {
							newHeaders.push(rowHead);
							break;
						};
					};
				};
				return newHeaders;
			},
			xlsxArrToTableArr(xlsxArr) {
				let tableArr = [];
				let length = 0;
				let maxLength = 0;
				let maxLengthIndex = 0;

				// custom - maulana yusup abdullah
				let headers = [];
				xlsxArr.forEach((item, index) => {
					const rowHeaders = Object.keys(item);
					headers = this.pushToHeaders(headers, rowHeaders);
				})

				// custom - maulana yusup abdullah
				xlsxArr.forEach((item, index) => {
					// length = Object.keys(item).length
					length = headers.length
					if (maxLength < length) {
						maxLength = length
						maxLengthIndex = index
					}
				})

				// custom - maulana yusup abdullah
				// let tableHeader = Object.keys(xlsxArr[maxLengthIndex])
				let tableHeader = headers;
				let rowItem = {}
				xlsxArr.forEach((item) => {
					rowItem = {}
					for (let i = 0; i < maxLength; i++) {
						rowItem[tableHeader[i]] = item[tableHeader[i]] || ''
					}
					tableArr.push(rowItem)
				})
				return {
					header: tableHeader,
					data: tableArr
				}
			},
			tableArrToXlsxArr({
				data,
				header
			}) {
				let xlsxArr = []
				let tempObj = {}
				data.forEach((rowItem) => {
					tempObj = {}
					rowItem.forEach((item, index) => {
						tempObj[header[index]] = item
					})
					xlsxArr.push(tempObj)
				})
				return xlsxArr
			},
			initTable({
				data,
				header
			}) {
				this.tableData.header = header
				this.tableData.body = data
				this.$emit('on-select-file', this.tableData)
			},
			handleUploadBtnClick() {
				this.clearAllData()
				document.getElementById(this.uploadInputId).click()
			},
			clearAllData() {
				document.getElementById(this.uploadInputId).value = null
				this.tableData = {
					header: [],
					body: []
				}
				this.rawFile = null
				this.workbook = null
			}
		}
	}
</script>

<style lang="scss">
.vue-xlsx-container {
	display: inline-block;
	margin: 0;
	padding: 0;
	box-sizing: border-box;

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.c-hide {
		display: none;
	}
}

.xlsx-button {
	display: inline-block;
	line-height: 1;
	white-space: nowrap;
	cursor: pointer;
	border: 1px solid #20a0ff;
	-webkit-appearance: none;
	text-align: center;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	padding: 7px 9px;
	font-size: 12px;
	border-radius: 4px;
	color: #fff;
	background-color: #20a0ff;

	&.button-large {
		padding: 10px 15px;
		font-size: 14px;
	}

	&.button-primary {
		color: #1f2d3d;
		border: 1px solid #bfcbd9;
		background-color: #fff;
	}
}
</style>
