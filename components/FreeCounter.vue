<script setup lang="ts">
import { useAuth } from 'vue-clerk'

import { MAX_FREE_COUNTS } from '@/constants'
import { Zap } from 'lucide-vue-next'

const isMounted = ref(false)

const store = useStore()
const { userId } = useAuth()

const progress = computed(() => (store.apiLimitCount / MAX_FREE_COUNTS) * 100)

onMounted(async () => {
	store.setApiLimitCount(await useGetLimit())
	store.setIsPro(await useGetStatus())

	isMounted.value = true
})

watch(userId, async () => {
	store.setApiLimitCount(await useGetLimit())
	store.setIsPro(await useGetStatus())
})
</script>

<template>
	<div v-if="isMounted && !store.isPro" class="px-3">
		<UiCard class="bg-white/10 border-0">
			<UiCardContent class="py-6">
				<div class="text-center text-sm text-white mb-4 space-y-2">
					<p>
						{{ store.apiLimitCount }} / {{ MAX_FREE_COUNTS }} Free Generations
					</p>
					<UiProgress class="h-3" :model-value="progress" />
				</div>
				<UiButton @click="store.onOpen()" variant="premium" class="w-full">
					Upgrade
					<Zap class="w-4 h-4 ml-2 fill-white" />
				</UiButton>
			</UiCardContent>
		</UiCard>
	</div>
</template>

<style scoped></style>
