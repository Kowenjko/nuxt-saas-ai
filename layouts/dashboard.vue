<script setup lang="ts">
const apiLimitCount = 2
const isPro = true
</script>
<template>
	<div class="h-full relative">
		<div
			class="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900"
		>
			<Sidebar :isPro="isPro" :apiLimitCount="apiLimitCount" />
		</div>
		<main class="md:pl-72 pb-10">
			<Navbar />

			<slot />
		</main>
	</div>
</template>
