<script setup lang="ts">
import { UserButton } from 'vue-clerk'
</script>
<template>
	<div class="flex items-center p-4">
		<MobileSidebar />
		<div class="flex w-full justify-end h-8">
			<UserButton after-sign-out-url="/" />
		</div>
	</div>
</template>
