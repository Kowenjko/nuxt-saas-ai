<script setup lang="ts">
import { FileAudio } from 'lucide-vue-next'
import { Form, useForm } from 'vee-validate'
import { FormField } from '@/components/ui/form'
import { useAuth } from 'vue-clerk'

import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

const { userId } = useAuth()
const router = useRouter()

const formSchema = toTypedSchema(
	z.object({
		prompt: z.string().min(1, {
			message: 'Music prompt is required',
		}),
	})
)

const isLoading = ref(false)
const video = ref(null)

const onSubmit = async (values: z.infer<typeof formSchema>) => {
	isLoading.value = true

	console.log(values)

	try {
		video.value = null

		const response = await fetch('/api/video', {
			method: 'POST',
			body: JSON.stringify({
				prompt: values.prompt,
				userId: userId.value,
			}),
		})

		const data = await response.json()
		console.log(data)
		video.value = data[0]
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
			title="Video Generation"
			description="Turn your prompt into video."
			:icon="FileAudio"
			iconColor="text-orange-500"
			bgColor="bg-orange-500/10"
		/>
		<div class="px-4 lg:px-8">
			<Form
				@submit="onSubmit"
				class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
				:validation-schema="formSchema"
			>
				<FormField v-slot="{ field }" name="prompt">
					<UiFormItem class="col-span-12 lg:col-span-10">
						<UiFormControl class="m-0 p-0">
							<UiInput
								class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
								v-bind="field"
								:disabled="isLoading"
								placeholder="Clown fish swimming in a coral reef"
							/>
						</UiFormControl>
						<!-- <UiFormMessage /> -->
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
			<Empty v-if="!video && !isLoading" label="No video files generated." />
			<video
				v-if="video"
				controls
				class="w-full aspect-video mt-8 rounded-lg border bg-black"
			>
				<source :src="video" />
			</video>
		</div>
	</NuxtLayout>
</template>

<style scoped></style>
