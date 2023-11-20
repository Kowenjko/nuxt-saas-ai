export const useGetStatus = async () => {
	const { data } = await useFetch('/api/check-status')
	return data.value?.isPro || false
}
