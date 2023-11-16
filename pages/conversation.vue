<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'
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
			message: 'Prompt is required.',
		}),
	})
)

const form = useForm({
	validationSchema: formSchema,
})

const isLoading = ref(false)
const messages = ref([])

const onSubmit = async (values: z.infer<typeof formSchema>) => {
	isLoading.value = true

	try {
		const userMessage = {
			role: 'user',
			content: values.prompt,
		}

		messages.value.push(userMessage)

		const response = await fetch('/api/conversation', {
			method: 'POST',
			body: JSON.stringify({
				messages: messages.value,
				userId: userId.value,
			}),
		})

		const data = await response.json()
		messages.value.push(data)
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
			title="Conversation"
			description="Our most advanced conversation model."
			:icon="MessageSquare"
			iconColor="text-violet-500"
			bgColor="bg-violet-500/10"
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
				label="No conversation started."
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

					<p class="text-sm">{{ message.content }}</p>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<style scoped></style>
