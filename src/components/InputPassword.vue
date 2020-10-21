<template>
	<div class="d-flex pos-r">
		<input
			:class="{'error-input': notMatch}"
			class="form-control"
			:autocomplete="autocomplete"
			:name="name"
			:type="type"
			:required="required"
			:value="value"
			@input="input">
		<div
			class="cursor-pointer material-icons-password pl-2 pr-2 pt-1"
			@click="toggleInputType">
			{{ icon }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'InputPassword',
	props: {
		value: {
			type: String,
		},
		required: {
			type: Boolean,
			default: true,
		},
		name: {
			type: String,
			default: 'password',
		},
		autocomplete: {
			type: String,
			default: 'on',
		},
		notMatch: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			type: 'password',
		};
	},
	methods: {
		input(e) {
			const value = e.target.value;
			this.$emit('input', value);
		},
		toggleInputType() {
			this.type = this.type === 'password' ? 'text' : 'password';
		},
	},
	computed: {
		icon() {
			return this.type === 'password' ? 'visibility' : 'visibility_off';
		},
	},
};
</script>
