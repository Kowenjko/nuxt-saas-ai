<script setup lang="ts">
const testimonials = [
	{
		name: 'Joel',
		avatar: 'J',
		title: 'Software Engineer',
		description: "This is the best application I've ever used!",
		src: '/logo1.svg',
	},
	{
		name: 'Antonio',
		avatar: 'A',
		title: 'Designer',
		description: 'I use this daily for generating new photos!',
		src: '/logo2.svg',
	},
	{
		name: 'Mark',
		avatar: 'M',
		title: 'CEO',
		description:
			'This app has changed my life, cannot imagine working without it!',
		src: '/logo3.svg',
	},
	{
		name: 'Mary',
		avatar: 'M',
		title: 'CFO',
		description:
			'The best in class, definitely worth the premium subscription!',
		src: '/logo4.svg',
	},
]
</script>

<template>
	<div class="px-10 pb-20">
		<h2 class="text-center text-4xl text-white font-extrabold mb-10">
			Testimonials
		</h2>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
		>
			<UiCard
				v-for="item in testimonials"
				:key="item.description"
				class="bg-white border-none p-4 text-[#192339]"
			>
				<UiCardHeader>
					<UiCardTitle class="flex items-center gap-x-2">
						<div>
							<p class="text-lg">{{ item.name }}</p>
							<p class="text-zinc-400 text-sm">{{ item.title }}</p>
						</div>
					</UiCardTitle>
				</UiCardHeader>
				<UiCardContent class="pt-4 px-0">
					<p>{{ item.description }}</p>

					<NuxtImg
						class="max-h-12 w-full pt-4 object-contain self-end stroke-white"
						:src="item.src"
						alt="Transistor"
						width="158"
						height="48"
					/>
				</UiCardContent>
			</UiCard>
		</div>
	</div>
</template>

<style scoped></style>
