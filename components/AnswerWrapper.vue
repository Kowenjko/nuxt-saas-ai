<script setup lang="ts">
interface MessageI {
	role: string
	content: string
}

interface Props {
	messages: MessageI[]
}

defineProps<Props>()
</script>

<template>
	<div class="flex flex-col-reverse gap-y-4">
		<div
			v-for="message in messages"
			:key="message.content"
			:class="[
				'p-8 w-full flex items-start gap-x-8 rounded-lg',
				message.role === 'user'
					? 'bg-white border border-black/10'
					: 'bg-muted',
			]"
		>
			<UserAvatar v-if="message.role === 'user'" />
			<BotAvatar v-else />

			<slot :content="message.content" />
		</div>
	</div>
</template>
