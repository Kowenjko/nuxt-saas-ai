<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
</script>

<template>
	<UiSheet>
		<UiSheetTrigger>
			<Menu class="md:hidden" />
		</UiSheetTrigger>
		<UiSheetContent side="left" class="p-0">
			<Sidebar />
		</UiSheetContent>
	</UiSheet>
</template>
