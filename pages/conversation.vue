<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'
import { Form } from 'vee-validate'

interface FormI {
	prompt: string
}
interface MessageI {
	role: string
	content: string
}

const store = useStore()
const { $toast } = useNuxtApp()

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
		$toast.error(error.value.statusMessage as string)
		if (error.value.statusCode === 403) store.onOpen()
	}

	if (data.value) {
		messages.value = [...newMessages, data.value]
		store.setApiLimitCount(await useGetLimit())
		store.setIsPro(await useGetStatus())
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
		<Form
			@submit="onSubmit"
			class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
		>
			<TextField
				class="col-span-12 lg:col-span-10"
				name="prompt"
				v-model:prompt="form.prompt"
				placeholder="How do I calculate the radius of a circle?"
				:isLoading="isLoading"
			/>

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
		<Loader v-if="isLoading" />
		<Empty
			v-if="messages.length === 0 && !isLoading"
			label="No conversation started."
		/>
		<AnswerWrapper :messages="messages" v-slot="{ content }">
			<p class="text-sm">{{ content }}</p>
		</AnswerWrapper>
	</div>
</template>

<style scoped></style>
