<script setup lang="ts"></script>
<template>
	<div class="h-full relative">
		<div
			class="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 md:w-72"
		>
			Hello Sidebar
		</div>
		<main class="md:pl-72">
			<slot />
		</main>
	</div>
</template>
