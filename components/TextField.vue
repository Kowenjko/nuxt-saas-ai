<script setup lang="ts">
import { FormField } from '@/components/ui/form'

interface Props {
	isLoading: boolean
	name: string
	prompt: string
	placeholder: string
	colSpan?: string
}

const props = withDefaults(defineProps<Props>(), {
	isLoading: false,
	colSpan: '10',
})

const emit = defineEmits<{
	'update:prompt': [value: string]
}>()

const value = computed({
	get() {
		return props.prompt
	},
	set(value) {
		emit('update:prompt', value)
	},
})
</script>

<template>
	<FormField :name="name">
		<UiFormItem :class="`col-span-12 lg:col-span-${colSpan}`">
			<UiFormControl class="m-0 p-0">
				<UiInput
					class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
					:placeholder="placeholder"
					v-model="value"
					:disabled="isLoading"
				/>
			</UiFormControl>
		</UiFormItem>
	</FormField>
</template>
