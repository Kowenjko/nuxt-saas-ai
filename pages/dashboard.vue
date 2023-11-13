<script setup lang="ts">
definePageMeta({
	middleware: ['auth'],
	layout: 'dashboard',
})
</script>

<template>
	<NuxtLayout name="dashboard"> DashBoard </NuxtLayout>
</template>
