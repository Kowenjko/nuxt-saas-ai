<script setup lang="ts">
import { Menu } from 'lucide-vue-next'

interface Props {
	apiLimitCount: number
	isPro: boolean
}

withDefaults(defineProps<Props>(), {
	apiLimitCount: 0,
	isPro: false,
})
</script>

<template>
	<UiSheet>
		<UiSheetTrigger>
			<Menu class="md:hidden" />
		</UiSheetTrigger>
		<UiSheetContent side="left" class="p-0">
			<Sidebar :apiLimitCount="apiLimitCount" :isPro="isPro" />
		</UiSheetContent>
	</UiSheet>
</template>
