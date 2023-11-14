<script setup lang="ts">
import { MAX_FREE_COUNTS } from '@/constants'
import { Zap } from 'lucide-vue-next'

interface Props {
	apiLimitCount: number
	isPro: boolean
}

const props = withDefaults(defineProps<Props>(), {
	apiLimitCount: 0,
	isPro: false,
})

const isMounted = ref(false)
const progress = computed(() => (props.apiLimitCount / MAX_FREE_COUNTS) * 100)

onMounted(() => (isMounted.value = true))
</script>

<template>
	<div v-if="isMounted" class="px-3">
		<UiCard class="bg-white/10 border-0">
			<UiCardContent class="py-6">
				<div class="text-center text-sm text-white mb-4 space-y-2">
					<p>{{ apiLimitCount }} / {{ MAX_FREE_COUNTS }} Free Generations</p>
					<UiProgress class="h-3" :model-value="progress" />
				</div>
				<UiButton variant="premium" class="w-full">
					Upgrade
					<Zap class="w-4 h-4 ml-2 fill-white" />
				</UiButton>
			</UiCardContent>
		</UiCard>
	</div>
</template>

<style scoped></style>
