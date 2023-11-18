<script setup lang="ts">
import { useAuth } from 'vue-clerk'

const { userId } = useAuth()
const store = useStore()

const isPro = false

onMounted(async () => store.setApiLimitCount(await useGetLimit(userId.value)))
watch(userId, async (id) => store.setApiLimitCount(await useGetLimit(id)))
</script>
<template>
	<div class="h-full relative">
		<div
			class="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900"
		>
			<Sidebar :isPro="isPro" :apiLimitCount="store.apiLimitCount" />
		</div>
		<main class="md:pl-72 pb-10">
			<Navbar :isPro="isPro" :apiLimitCount="store.apiLimitCount" />
			<ProModal />
			<slot />
		</main>
	</div>
</template>
