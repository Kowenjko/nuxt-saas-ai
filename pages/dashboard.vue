<script setup lang="ts">
import { UserButton } from 'vue-clerk'

definePageMeta({
	middleware: ['auth'],
})
</script>

<template>
	<NuxtLayout class="dashboard">
		DashBoard
		<UserButton after-sign-out-url="/" />
	</NuxtLayout>
</template>
