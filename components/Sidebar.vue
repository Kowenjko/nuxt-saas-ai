<script setup lang="ts">
import {
	Code,
	ImageIcon,
	LayoutDashboard,
	MessageSquare,
	Music,
	Settings,
	VideoIcon,
} from 'lucide-vue-next'

const routes = [
	{
		label: 'Dashboard',
		icon: LayoutDashboard,
		href: '/dashboard',
		color: 'text-sky-500',
	},
	{
		label: 'Conversation',
		icon: MessageSquare,
		href: '/conversation',
		color: 'text-violet-500',
	},
	{
		label: 'Image Generation',
		icon: ImageIcon,
		color: 'text-pink-700',
		href: '/image',
	},
	{
		label: 'Video Generation',
		icon: VideoIcon,
		color: 'text-orange-700',
		href: '/video',
	},
	{
		label: 'Music Generation',
		icon: Music,
		color: 'text-emerald-500',
		href: '/music',
	},
	{
		label: 'Code Generation',
		icon: Code,
		color: 'text-green-700',
		href: '/code',
	},
	{
		label: 'Settings',
		icon: Settings,
		href: '/settings',
	},
]
</script>
<template>
	<div class="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
		<div class="px-3 py-2 flex-1">
			<nuxt-link to="/dashboard" class="flex items-center pl-3 mb-14">
				<div class="relative w-8 h-8 mr-4">
					<NuxtImg src="/logo.png" />
				</div>
				<h1 class="text-2xl font-bold">Genius</h1>
			</nuxt-link>
			<div class="space-y-1">
				<nuxt-link
					v-for="route in routes"
					:key="route.href"
					:to="route.href"
					:class="[
						'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
						$route.path === route.href
							? 'text-white bg-white-100'
							: 'text-zinc-400',
					]"
				>
					<div class="flex items-center flex-1">
						<component
							:is="route.icon"
							:class="['h-5 w-5 mr-3', route.color]"
						/>
						{{ route.label }}
					</div>
				</nuxt-link>
			</div>
		</div>
		<FreeCounter />
	</div>
</template>

<style scoped>
h1 {
	font-family: 'Montserrat', sans-serif;
}
</style>
