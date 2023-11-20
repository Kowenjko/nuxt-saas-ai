<script setup lang="ts">
import { FileAudio } from 'lucide-vue-next'
import { Form } from 'vee-validate'

interface FormI {
	prompt: string
}

const isLoading = ref<boolean>(false)
const video = ref<string | null>(null)
const form = reactive<FormI>({ prompt: '' })

const store = useStore()
const { $toast } = useNuxtApp()

const onSubmit = async () => {
	isLoading.value = true

	video.value = null

	const { data, error } = await useFetch('/api/video', {
		method: 'POST',
		body: { prompt: form.prompt },
	})

	if (error.value) {
		$toast.error(error.value.statusMessage as string)
		if (error.value.statusCode === 403) store.onOpen()
	}

	if (data.value) {
		video.value = data.value[0]
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
		>
			<TextField
				class="col-span-12 lg:col-span-10"
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
		<Loader v-if="isLoading" />
		<Empty v-if="!video && !isLoading" label="No video files generated." />
		<video
			v-if="video"
			controls
			class="w-full aspect-video mt-8 rounded-lg border bg-black"
		>
			<source :src="video" />
		</video>
	</div>
</template>

<style scoped></style>
