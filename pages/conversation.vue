<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'
import { Form } from 'vee-validate'
import { FormField } from '@/components/ui/form'

interface FormI {
	prompt: string
}
interface MessageI {
	role: string
	content: string
}

const store = useStore()
store.setApiLimitCount(await useGetLimit())

const isLoading = ref<boolean>(false)
const messages = ref<MessageI[]>([])
const form = reactive<FormI>({ prompt: '' })

const onSubmit = async () => {
	isLoading.value = true

	const userMessage = {
		role: 'user',
		content: form.prompt,
	}

	const newMessages: MessageI[] = [...messages.value, userMessage]

	const { data, error } = await useFetch<MessageI[]>('/api/conversation', {
		method: 'POST',
		body: {
			messages: newMessages,
		},
	})

	if (error.value) {
		console.log(error.value.statusMessage)
		if (error.value.statusCode === 403) {
			store.onOpen()
		}
	}

	if (data.value) {
		messages.value = [...newMessages, data.value]
		store.setApiLimitCount(await useGetLimit())
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
		title="Conversation"
		description="Our most advanced conversation model."
		:icon="MessageSquare"
		iconColor="text-violet-500"
		bgColor="bg-violet-500/10"
	/>
	<div class="px-4 lg:px-8">
		<form
			@submit.prevent="onSubmit"
			class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
		>
			<FormField name="prompt">
				<UiFormItem class="col-span-12 lg:col-span-10">
					<UiFormControl class="m-0 p-0">
						<UiInput
							class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
							placeholder="How do I calculate the radius of a circle?"
							v-model="form.prompt"
							:disabled="isLoading"
						/>
					</UiFormControl>
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
		</form>
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
				:class="[
					'p-8 w-full flex items-start gap-x-8 rounded-lg',
					message.role === 'user'
						? 'bg-white border border-black/10'
						: 'bg-muted',
				]"
			>
				<UserAvatar v-if="message.role === 'user'" />
				<BotAvatar v-else />

				<p class="text-sm">{{ message.content }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
