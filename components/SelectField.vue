<script setup lang="ts">
import { FormField } from '@/components/ui/form'

interface OptionsI {
	label: string
	value: string
}

interface Props {
	isLoading: boolean
	options: OptionsI[]
	name: string
	selected: string
}

const props = withDefaults(defineProps<Props>(), {
	isLoading: false,
})

const emit = defineEmits<{
	'update:selected': [value: string]
}>()

const value = computed({
	get() {
		return props.selected
	},
	set(value) {
		emit('update:selected', value)
	},
})
</script>

<template>
	<FormField :name="name">
		<UiFormItem class="col-span-12 lg:col-span-2">
			<UiSelect v-model="value" :disabled="isLoading">
				<UiFormControl>
					<UiSelectTrigger>
						<UiSelectValue />
					</UiSelectTrigger>
				</UiFormControl>
				<UiSelectContent>
					<UiSelectItem
						v-for="option in options"
						:key="option.value"
						:value="option.value"
					>
						{{ option.label }}
					</UiSelectItem>
				</UiSelectContent>
			</UiSelect>
		</UiFormItem>
	</FormField>
</template>
