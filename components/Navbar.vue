<script setup lang="ts">
import { UserButton } from 'vue-clerk'

const apiLimitCount = 2
const isPro = true
</script>
<template>
	<div class="flex items-center p-4">
		<MobileSidebar :isPro="isPro" :apiLimitCount="apiLimitCount" />
		<div class="flex w-full justify-end h-8">
			<UserButton after-sign-out-url="/" />
		</div>
	</div>
</template>
