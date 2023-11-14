<script setup lang="ts">
import { SignIn } from 'vue-clerk'

definePageMeta({
	middleware: ['public'],
	layout: 'auth',
})
</script>

<template>
	<NuxtLayout name="auth">
		<SignIn path="/sign-in" afterSignInUrl="/dashboard" signUpUrl="/sign-up" />
	</NuxtLayout>
</template>
