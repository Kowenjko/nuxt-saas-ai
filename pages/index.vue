<script setup lang="ts"></script>

<template>
	<div class="">
		<UiButton @click="$router.push('/sign-in')" class="">Login</UiButton>
		<UiButton @click="$router.push('/sign-up')" class="">Register</UiButton>
	</div>
</template>
