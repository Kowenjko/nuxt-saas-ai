<script setup lang="ts">
import { Code } from 'lucide-vue-next'
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
			message: 'Prompt is required.',
		}),
	})
)

const isLoading = ref(false)
const messages = ref([])

const onSubmit = async (values: z.infer<typeof formSchema>) => {
	isLoading.value = true

	try {
		const userMessage = {
			role: 'user',
			content: values.prompt,
		}

		const response = await fetch('/api/code', {
			method: 'POST',
			body: JSON.stringify({
				messages: messages.value,
				userId: userId.value,
			}),
		})
		if (response.status === 500) return console.log(response.statusText)
		if (response.status === 400) return console.log(response.statusText)
		if (response.status === 401) return console.log(response.statusText)
		if (response.status === 403) return store.onOpen()

		const data = await response.json()

		messages.value.push(userMessage)

		messages.value.push(data)
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
			title="Code Generation"
			description="Generate code using descriptive text."
			:icon="Code"
			iconColor="text-green-500"
			bgColor="bg-green-500/10"
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
			<Empty
				v-if="messages.length === 0 && !isLoading"
				label="No code started."
			/>
			<div class="flex flex-col-reverse gap-y-4">
				<div
					v-for="message in messages"
					:key="message.content"
					:class="
						cn(
							'p-8 w-full flex items-start gap-x-8 rounded-lg',
							message.role === 'user'
								? 'bg-white border border-black/10'
								: 'bg-muted'
						)
					"
				>
					<UserAvatar v-if="message.role === 'user'" />
					<BotAvatar v-else />

					<div
						class="p-2 border bg-black border-gray-700 rounded-lg text-white"
					>
						<pre class="overflow-auto w-full my-2 bg-gray-800 p-2 rounded-lg">
					code
					</pre
						>
						<code class="text-sm overflow-hidden leading-7">{{
							message.content || ''
						}}</code>
					</div>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<style scoped></style>
