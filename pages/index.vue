<script setup lang="ts">
definePageMeta({
	layout: 'leading',
})
</script>

<template>
	<NuxtLayout name="leading">
		<LandingNavbar />
		<LandingHero />
		<LandingContent />
		<!-- <UiButton @click="$router.push('/sign-in')" class="">Login</UiButton>
		<UiButton @click="$router.push('/sign-up')" class="">Register</UiButton> -->
	</NuxtLayout>
</template>
