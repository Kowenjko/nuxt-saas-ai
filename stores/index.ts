import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
	const apiLimitCount = ref(0)
	const isOpen = ref(false)

	const setApiLimitCount = (count: number) => (apiLimitCount.value = count)

	const onOpen = () => (isOpen.value = true)
	const onClose = () => (isOpen.value = false)

	return { apiLimitCount, setApiLimitCount, isOpen, onOpen, onClose }
})
