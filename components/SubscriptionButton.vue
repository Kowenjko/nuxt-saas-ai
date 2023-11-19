<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import { useUser } from 'vue-clerk'

const isLoading = ref(false)

const store = useStore()
const { user } = useUser()

console.log(user.value)

const manageSubscription = async () => {
	isLoading.value = true

	const { data, error } = await useFetch('/api/stripe', {
		method: 'POST',
		body: {
			user: user.value,
		},
	})

	if (error.value) {
		console.log(error.value.statusMessage)
	}

	if (data.value) {
		window.location.href = data.value.url
	}
	isLoading.value = false
}
</script>

<template>
	<UiButton
		:variant="[store.isPro ? 'default' : 'premium']"
		@click="manageSubscription"
		:disabled="isLoading"
	>
		<span v-if="store.isPro">Manage Subscription</span>
		<span v-else>Upgrade</span>
		<Zap v-if="store.isPro" class="w-4 h-4 ml-2 fill-white" />
	</UiButton>
</template>

<style scoped></style>
