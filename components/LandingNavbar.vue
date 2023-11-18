<script setup lang="ts">
import { useUser } from 'vue-clerk'

const { isSignedIn } = useUser()

const isSign = computed(() => (isSignedIn.value ? '/dashboard' : '/sign-up'))
</script>

<template>
	<nav class="p-4 bg-transparent flex items-center justify-between">
		<NuxtLink to="/" class="flex items-center">
			<div class="relative h-8 w-8 mr-4">
				<NuxtImg fill alt="Logo" src="/logo.png" />
			</div>
			<h1 class="text-2xl font-bold text-white">Genius</h1>
		</NuxtLink>
		<div class="flex items-center gap-x-2">
			<NuxtLink :to="isSign">
				<UiButton variant="outline" class="rounded-full">
					Get Started
				</UiButton>
			</NuxtLink>
		</div>
	</nav>
</template>

<style scoped></style>
