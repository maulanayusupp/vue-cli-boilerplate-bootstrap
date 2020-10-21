<template>
	<div
		class="custom-input form-control flex-center"
		:class="{
			'error-input': !isValid || (!isValidHex && type === 'color'),
			'disable-input': disabled,
			'is-focus': isFocus,
		}"
		:id="elementId">
		<!-- Color -->
		<template v-if="type === 'color'">
			<span v-if="!isValidHex" class="absolute error-color-input">{{$t('Incorrect Value')}}</span>
			<input
				maxlength=7
				class="form-control"
				style="border-color: transparent"
				:class="[`text-${align}`, { 'pl-0': align === 'left' }]"
				type="text"
				:value="value"
				@click="openColorPicker"
				@input="onChange"
			/>
		</template>

		<!-- Suffix -->
		<div class="custom-input-suffix">
			<template>
					<!-- color picker -->
					<div
						class="color-preview"
						:style="swatchStyle"
						@click="openColorPicker"
					/>
					<div
						class="color-picker"
						:class="`color-picker-${pickerPosition}`"
						v-if="isColorPickerVisible">
						<chrome-picker
							@input="onColorChange"
							v-model="color"
						></chrome-picker>
						<button
							@click="closeColorPicker"
							class="btn-primary btn-close-picker"
						>{{ $t('Close') }}</button>
					</div>
			</template>
		</div>
	</div>
</template>

<script>
import { Chrome } from 'vue-color';
import { duplicateVar, generateRandomId } from '../lib/helper';

export default {
	name: 'CustomInput',
	props: {
		value: {},
		type: {
			type: String,
			default: 'text',
		},
		label: {
			type: String,
		},
		suffix: {
			type: String,
			default: '',
		},
		field: {
			type: String,
			default: 'normal',
		},
		required: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		align: {
			type: String,
			default: 'center',
		},
		pickerPosition: {
			type: String,
			default: 'left',
		},
	},
	components: {
		ChromePicker: Chrome,
	},
	data() {
		return {
			color: '',
			isColorPickerVisible: false,
			uuid: '',
			isFocus: false,
		};
	},
	methods: {
		onChange(e) {
			let value = e.target.value;
			value = value.trim();
			this.$emit('input', value);

			if (this.type === 'color') {
				this.color = duplicateVar(value);
			}
		},
		onColorChange(color) {
			const hex = color.hex8;
			this.color = hex;
			this.$emit('input', hex);
		},
		openColorPicker() {
			this.isFocus = true;
			this.isColorPickerVisible = true;
		},
		closeColorPicker() {
			this.isFocus = false;
			this.isColorPickerVisible = false;
		},
		initData() {
			this.uuid = generateRandomId();
			if (this.type === 'color') {
				this.color = duplicateVar(this.value);
			}
			if (this.type === 'duration') {
				const finalValue = new Date(this.stringToSeconds(this.value) * 1000).toISOString().substr(14, 5);
				this.maskedValue = finalValue;
			}
		},
		onClick({ target }) {
			if (!target.closest(`#${this.elementId}`)) {
				this.isFocus = false;
				this.isColorPickerVisible = false;
			}
		},
		onFocus() {
			this.isFocus = true;
		},
		onBlur() {
			this.isFocus = false;
		},
	},
	computed: {
		isValid() {
			return this.required ? this.value !== '' : true;
		},
		isValidHex() {
			return /^#[0-9A-F]{6,8}$/i.test(this.value);
		},
		swatchStyle() {
			return {
				backgroundColor: this.value,
			};
		},
		elementId() {
			return `custom-input-${this.uuid}`;
		},
	},
	created() {
		this.initData();
		window.addEventListener('click', this.onClick);
	},
	destroyed() {
		window.removeEventListener('click', this.onClick);
	},
};
</script>

<style>
</style>
