export const useGetLimit = async () => {
	const { data } = await useFetch('/api/limit-count')
	return data.value?.apiLimitCount || 0
}
