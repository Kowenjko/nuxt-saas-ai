<script setup lang="ts">
import { tools } from '@/constants'
import { cn } from '@/lib/utils'
import { Check, Zap } from 'lucide-vue-next'
import { useUser } from 'vue-clerk'

const isLoading = ref(false)

const store = useStore()

const { user } = useUser()

const manageSubscription = async () => {
	isLoading.value = true

	const { data, error } = await useFetch('/api/stripe', {
		method: 'POST',
		body: {
			user: user.value,
		},
	})

	if (error.value) {
		console.log(error.value.statusMessage)
	}

	if (data.value) {
		window.location.href = data.value.url
	}
	isLoading.value = false
}
</script>

<template>
	<UiDialog :open="store.isOpen" @update:open="store.onClose()">
		<UiDialogContent>
			<UiDialogHeader>
				<UiDialogTitle
					class="flex justify-center items-center flex-col gap-y-4 pb-2"
				>
					<div class="flex items-center gap-x-2 font-bold text-xl">
						Upgrade to Genius
						<UiBadge class="uppercase text-sm py-1">Pro</UiBadge>
					</div>
				</UiDialogTitle>
				<UiDialogDescription
					class="text-center pt-2 space-y-2 text-zinc-900 font-medium"
				>
					<UiCard
						v-for="tool in tools"
						:key="tool.href"
						class="p-3 border-black/5 flex items-center justify-between"
					>
						<div class="flex items-center gap-x-4">
							<div :class="cn('p-2 w-fit rounded-md', tool.bgColor)">
								<component :is="tool.icon" :class="cn('w-6 h-6', tool.color)" />
							</div>
							<div class="font-semibold text-sm">
								{{ tool.label }}
							</div>
						</div>
						<Check class="text-primary w-5 h-5" />
					</UiCard>
				</UiDialogDescription>
			</UiDialogHeader>
			<UiDialogFooter>
				<UiButton
					:disabled="isLoading"
					:onClick="manageSubscription"
					size="lg"
					variant="premium"
					class="w-full"
				>
					Upgrade
					<Zap class="w-4 h-4 ml-2 fill-white" />
				</UiButton>
			</UiDialogFooter>
		</UiDialogContent>
	</UiDialog>
</template>

<style scoped></style>
