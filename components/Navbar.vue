<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { UserButton } from 'vue-clerk'
</script>
<template>
	<div class="flex items-center p-4">
		<UiButton variant="ghost" size="icon" class="md:hidden">
			<Menu />
		</UiButton>
		<div class="flex w-full justify-end">
			<UserButton after-sign-out-url="/" />
		</div>
	</div>
</template>

<style scoped></style>
