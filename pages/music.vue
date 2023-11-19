<script setup lang="ts">
import { Music } from 'lucide-vue-next'
import { Form } from 'vee-validate'
import { FormField } from '@/components/ui/form'

interface FormI {
	prompt: string
}

const isLoading = ref<boolean>(false)
const music = ref<string | null>(null)
const form = reactive<FormI>({ prompt: '' })

const store = useStore()

const onSubmit = async () => {
	isLoading.value = true
	music.value = null

	const { data, error } = await useFetch('/api/music', {
		method: 'POST',
		body: { prompt: form.prompt },
	})

	if (error.value) {
		console.log(error.value.statusMessage)
		if (error.value.statusCode === 403) {
			store.onOpen()
		}
	}

	if (data.value) {
		music.value = data.value.audio
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
		>
			<TextField
				name="prompt"
				v-model:prompt="form.prompt"
				placeholder="An astronaut riding a horse"
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
</template>

<style scoped></style>
