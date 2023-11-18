<script setup lang="ts">
import { useUser } from 'vue-clerk'

const { isSignedIn } = useUser()

const isSign = computed(() => (isSignedIn.value ? '/dashboard' : '/sign-up'))
</script>
<template>
	<div class="text-white font-bold py-36 text-center space-y-5">
		<div
			class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold"
		>
			<h1>The Best AI Tool for</h1>
			<div
				class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
			>
				<!-- <TypewriterComponent
            options={{
              strings: [
                "Chatbot.",
                "Photo Generation.",
                "Blog Writing.",
                "Mail Writing."
              ],
              autoStart: true,
              loop: true,
            }}
          /> -->
			</div>
		</div>
		<div class="text-sm md:text-xl font-light text-zinc-400">
			Create content using AI 10x faster.
		</div>
		<div>
			<NuxtLink :to="isSign">
				<UiButton
					variant="premium"
					class="md:text-lg p-4 md:p-6 rounded-full font-semibold"
				>
					Start Generating For Free
				</UiButton>
			</NuxtLink>
		</div>
		<div class="text-zinc-400 text-xs md:text-sm font-normal">
			No credit card required.
		</div>
	</div>
</template>

<style scoped></style>
