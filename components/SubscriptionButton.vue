<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import { useAuth, useUser } from 'vue-clerk'

const loading = ref(false)

const store = useStore()
const { userId } = useAuth()
const { user } = useUser()
const router = useRouter()

const onClick = async () => {
	try {
		loading.value = true

		const response = await fetch('/api/stripe', {
			method: 'POST',
			body: JSON.stringify({
				user: user.value,
				userId: userId.value,
			}),
		})

		if (response.status === 401) return console.log(response.statusText)
		if (response.status === 500) return console.log(response.statusText)
		const data = await response.json()
		// console.log(data)

		window.location.href = data.url
	} catch (error) {
		console.error('Something went wrong')
	} finally {
		loading.value = false
	}
}
// const onClick = async () => {
// 	try {
// 		loading.value = true

// 		const response = await fetch('/api/webhook', {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				user: user.value,
// 				userId: userId.value,
// 			}),
// 		})

// 		if (response.status === 401) return console.log(response.statusText)
// 		if (response.status === 500) return console.log(response.statusText)
// 		const data = await response.json()
// 		// console.log(data)

// 		window.location.href = data.url
// 	} catch (error) {
// 		console.error('Something went wrong')
// 	} finally {
// 		loading.value = false
// 	}
// }
</script>

<template>
	<UiButton :variant="[store.isPro ? 'default' : 'premium']" @click="onClick">
		<span v-if="store.isPro">Manage Subscription</span>
		<span v-else>Upgrade</span>
		<Zap v-if="store.isPro" class="w-4 h-4 ml-2 fill-white" />
	</UiButton>
</template>

<style scoped></style>
