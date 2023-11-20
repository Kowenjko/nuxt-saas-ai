import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
	const apiLimitCount = ref(0)
	const isPro = ref(false)
	const isOpen = ref(false)

	const setApiLimitCount = (count: number) => (apiLimitCount.value = count)
	const setIsPro = (status: boolean) => (isPro.value = status)

	const onOpen = () => (isOpen.value = true)
	const onClose = () => (isOpen.value = false)

	return {
		isPro,
		setIsPro,
		apiLimitCount,
		setApiLimitCount,
		isOpen,
		onOpen,
		onClose,
	}
})
