<script setup lang="ts">
import { Code } from 'lucide-vue-next'
import { Form } from 'vee-validate'

interface FormI {
	prompt: string
}
interface MessageI {
	role: string
	content: string
}

const isLoading = ref<boolean>(false)
const messages = ref<MessageI[]>([])
const form = reactive<FormI>({ prompt: '' })

const store = useStore()
const { $mdRenderer, $toast } = useNuxtApp()

const onSubmit = async () => {
	isLoading.value = true

	const userMessage = {
		role: 'user',
		content: form.prompt,
	}
	const newMessages: MessageI[] = [...messages.value, userMessage]

	const { data, error } = await useFetch<MessageI[]>('/api/code', {
		method: 'POST',
		body: {
			messages: newMessages,
		},
	})

	if (error.value) {
		$toast.error(error.value.statusMessage as string)
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
			label="No code started."
		/>

		<AnswerWrapper :messages="messages" v-slot="{ content }">
			<div
				v-if="content"
				class="prose-pre:overflow-auto prose-pre:w-full prose-pre:my-2 prose-pre:bg-black/10 prose-pre:p-2 prose-pre:rounded-lg prose-code:bg-black/10 prose-code:rounded-lg prose-code:p-1 text-sm overflow-hidden leading-7"
				v-html="$mdRenderer.render(content)"
			/>
		</AnswerWrapper>
	</div>
</template>
