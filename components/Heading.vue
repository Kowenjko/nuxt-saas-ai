<script setup lang="ts">
import { cn } from '@/lib/utils'

interface HeadingProps {
	title: string
	description: string
	icon: any
	iconColor?: string
	bgColor?: string
}

defineProps<HeadingProps>()
</script>

<template>
	<div class="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
		<div :class="cn('p-2 w-fit rounded-md', bgColor)">
			<component :is="icon" :class="cn('w-10 h-10', iconColor)" />
		</div>
		<div>
			<h2 class="text-3xl font-bold">{{ title }}</h2>
			<p class="text-sm text-muted-foreground">
				{{ description }}
			</p>
		</div>
	</div>
</template>

<style scoped></style>
