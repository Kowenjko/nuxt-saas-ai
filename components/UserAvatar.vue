<script setup lang="ts">
import { useUser } from 'vue-clerk'
const { user } = useUser()
</script>

<template>
	<UiAvatar class="h-8 w-8">
		<UiAvatarImage v-if="user?.profileImageUrl" :src="user?.profileImageUrl" />
		<UiAvatarFallback>
			{{ user?.firstName?.charAt(0) }}
			{{ user?.lastName?.charAt(0) }}
		</UiAvatarFallback>
	</UiAvatar>
</template>

<style scoped></style>
