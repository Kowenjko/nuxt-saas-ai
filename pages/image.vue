<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'
import { Form } from 'vee-validate'
import { FormField } from '@/components/ui/form'

import { amountOptions, resolutionOptions } from '@/constants/image'

interface FormI {
	prompt: string
	amount: string
	resolution: string
}

const store = useStore()
store.setApiLimitCount(await useGetLimit())

const isLoading = ref<boolean>(false)
const photos = ref<string[]>([])
const form = reactive<FormI>({ prompt: '', amount: '1', resolution: '256x256' })

const onSubmit = async () => {
	isLoading.value = true

	const { data, error } = await useFetch('/api/image', {
		method: 'POST',
		body: { form },
	})

	if (error.value) {
		console.log(error.value.statusMessage)
		if (error.value.statusCode === 403) {
			store.onOpen()
		}
	}

	if (data.value) {
		const urls = data.value.map((image: { url: string }) => image.url)
		store.setApiLimitCount(await useGetLimit())
		console.log(urls)

		photos.value = urls
	}
	isLoading.value = false
	form.prompt = ''
}
definePageMeta({
	middleware: ['auth'],
	layout: 'dashboard',
})
</script>
<template>
	<Heading
		title="Image Generation"
		description="Turn your prompt into an image."
		:icon="ImageIcon"
		iconColor="text-pink-700"
		bgColor="bg-pink-700/10"
	/>
	<div class="px-4 lg:px-8">
		<Form
			class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
			@submit="onSubmit"
		>
			<FormField name="prompt">
				<UiFormItem class="col-span-12 lg:col-span-6">
					<UiFormControl class="m-0 p-0">
						<UiInput
							class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
							v-model="form.prompt"
							:disabled="isLoading"
							placeholder="A picture of a horse in Swiss alps"
						/>
					</UiFormControl>
				</UiFormItem>
			</FormField>
			<FormField name="amount">
				<UiFormItem class="col-span-12 lg:col-span-2">
					<UiSelect :disabled="isLoading" v-model="form.amount">
						<UiFormControl>
							<UiSelectTrigger>
								<UiSelectValue />
							</UiSelectTrigger>
						</UiFormControl>
						<UiSelectContent>
							<UiSelectItem
								v-for="option in amountOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</UiSelectItem>
						</UiSelectContent>
					</UiSelect>
				</UiFormItem>
			</FormField>

			<FormField name="resolution">
				<UiFormItem class="col-span-12 lg:col-span-2">
					<UiSelect v-model="form.resolution" :disabled="isLoading">
						<UiFormControl>
							<UiSelectTrigger>
								<UiSelectValue />
							</UiSelectTrigger>
						</UiFormControl>
						<UiSelectContent>
							<UiSelectItem
								v-for="option in resolutionOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</UiSelectItem>
						</UiSelectContent>
					</UiSelect>
				</UiFormItem>
			</FormField>

			<UiButton
				class="col-span-12 lg:col-span-2 w-full"
				type="submit"
				:disabled="isLoading"
				size="icon"
			>
				Generate
			</UiButton>
		</Form>
	</div>
	<div class="space-y-4 mt-4">
		<div
			v-if="isLoading"
			class="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
		>
			<Loader />
		</div>
		<Empty
			v-if="photos.length === 0 && !isLoading"
			label="No images generated."
		/>
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8"
		>
			<UiCard
				v-for="src in photos"
				:key="src"
				class="rounded-lg overflow-hidden"
			>
				<div class="relative aspect-square">
					<NuxtImg :src="src" fill alt="Generated" />
				</div>
				<UiCardFooter class="p-2">
					<NuxtLink :to="src" target="_blank">Download</NuxtLink>
				</UiCardFooter>
			</UiCard>
		</div>
	</div>
</template>

<style scoped></style>
