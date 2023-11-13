<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
</script>

<template>
	<UiSheet>
		<UiSheetTrigger>
			<UiButton variant="ghost" size="icon" class="md:hidden">
				<Menu />
			</UiButton>
		</UiSheetTrigger>
		<UiSheetContent side="left" class="p-0">
			<Sidebar />
		</UiSheetContent>
	</UiSheet>
</template>
