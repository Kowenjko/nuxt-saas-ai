<script setup lang="ts">
import { Music } from 'lucide-vue-next'
import { Form, useForm } from 'vee-validate'
import { FormField } from '@/components/ui/form'
import { useAuth } from 'vue-clerk'

import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

const { userId } = useAuth()
const router = useRouter()
const store = useStore()

const formSchema = toTypedSchema(
	z.object({
		prompt: z.string().min(1, {
			message: 'Music prompt is required',
		}),
	})
)

const isLoading = ref(false)
const music = ref(null)

const onSubmit = async (values: z.infer<typeof formSchema>) => {
	isLoading.value = true

	console.log(values)

	try {
		music.value = null

		const response = await fetch('/api/music', {
			method: 'POST',
			body: JSON.stringify({
				prompt: values.prompt,
				userId: userId.value,
			}),
		})

		if (response.status === 500) return console.log(response.statusText)
		if (response.status === 400) return console.log(response.statusText)
		if (response.status === 401) return console.log(response.statusText)
		if (response.status === 403) return store.onOpen()

		const data = await response.json()

		// console.log(await response.text())

		music.value = data.audio
		store.setApiLimitCount(await useGetLimit(userId.value))
	} catch (error) {
		console.log('test', error)
	} finally {
		isLoading.value = false
	}
}
</script>
<template>
	<NuxtLayout name="dashboard">
		<Heading
			title="Music Generation"
			description="Turn your prompt into music."
			:icon="Music"
			iconColor="text-emerald-500"
			bgColor="bg-emerald-500/10"
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
			<Empty v-if="!music && !isLoading" label="No music generated." />
			<audio v-if="music" controls class="w-full mt-8">
				<source :src="music" />
			</audio>
		</div>
	</NuxtLayout>
</template>

<style scoped></style>
