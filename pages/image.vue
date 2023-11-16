<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'
import { Form, useForm } from 'vee-validate'
import { FormField } from '@/components/ui/form'
import { useAuth } from 'vue-clerk'
import { toTypedSchema } from '@vee-validate/zod'

import * as z from 'zod'
import { cn } from '@/lib/utils'
import { amountOptions, resolutionOptions } from '@/constants/image'

const { userId } = useAuth()
const router = useRouter()
const store = useStore()

const formSchema = toTypedSchema(
	z.object({
		prompt: z.string().min(1, {
			message: 'Photo prompt is required',
		}),
		amount: z.string().min(1),
		resolution: z.string().min(1),
	})
)

const isLoading = ref(false)
const photos = ref([])

const onSubmit = async (values) => {
	isLoading.value = true

	try {
		const response = await fetch('/api/image', {
			method: 'POST',
			body: JSON.stringify({
				values,
				userId: userId.value,
			}),
		})

		const data = await response.json()
		if (data.statusCode === 500) return store.onOpen()
		console.log(data)
		const urls = data.map((image: { url: string }) => image.url)

		console.log(urls)

		photos.value = urls
		store.setApiLimitCount(await useGetLimit(userId.value))
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
}
</script>
<template>
	<NuxtLayout name="dashboard">
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
				:validation-schema="formSchema"
				@submit="onSubmit"
			>
				<FormField v-slot="{ field }" name="prompt">
					<UiFormItem class="col-span-12 lg:col-span-6">
						<UiFormControl class="m-0 p-0">
							<UiInput
								class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
								v-bind="field"
								:disabled="isLoading"
								placeholder="A picture of a horse in Swiss alps"
							/>
						</UiFormControl>
					</UiFormItem>
				</FormField>
				<FormField v-slot="{ field }" name="amount">
					<UiFormItem class="col-span-12 lg:col-span-2">
						<UiSelect v-bind="field" :disabled="isLoading">
							<UiFormControl>
								<UiSelectTrigger>
									<UiSelectValue :value="field" />
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

				<FormField v-slot="{ field }" name="resolution">
					<UiFormItem class="col-span-12 lg:col-span-2">
						<UiSelect v-bind="field" :disabled="isLoading">
							<UiFormControl>
								<UiSelectTrigger>
									<UiSelectValue :value="field" />
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
	</NuxtLayout>
</template>

<style scoped></style>
