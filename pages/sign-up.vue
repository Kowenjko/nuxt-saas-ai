<script setup lang="ts">
import { SignUp } from 'vue-clerk'

definePageMeta({
	middleware: ['public'],
	layout: 'auth',
})
</script>

<template>
	<SignUp path="/sign-up" afterSignUpUrl="/dashboard" sign-in-url="/sign-in" />
</template>
