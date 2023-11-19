<script setup lang="ts">
import { Settings } from 'lucide-vue-next'

const store = useStore()

definePageMeta({
	layout: 'dashboard',
})
</script>
<template>
	<Heading
		title="Settings"
		description="Manage account settings."
		:icon="Settings"
		iconColor="text-gray-700"
		bgColor="bg-gray-700/10"
	/>
	<div class="px-4 lg:px-8 space-y-4">
		<div class="text-muted-foreground text-sm">
			{{
				store.isPro
					? 'You are currently on a Pro plan.'
					: 'You are currently on a free plan.'
			}}
		</div>
		<SubscriptionButton />
	</div>
</template>

<style scoped></style>
