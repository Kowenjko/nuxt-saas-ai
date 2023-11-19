<script setup lang="ts">
definePageMeta({
	layout: 'leading',
})
</script>

<template>
	<LandingNavbar />
	<LandingHero />
	<LandingContent />
	<!-- <UiButton @click="$router.push('/sign-in')" class="">Login</UiButton>
		<UiButton @click="$router.push('/sign-up')" class="">Register</UiButton> -->
</template>
