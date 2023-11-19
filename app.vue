<script setup lang="ts">
useHead({
	title: 'Genius',
	meta: [{ name: 'description', content: 'AI Platform' }],
})
</script>

<template>
	<suspense>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</suspense>
</template>
