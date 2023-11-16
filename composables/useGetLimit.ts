export const useGetLimit = async (id: string) => {
	const response = await fetch(`/api/limit-count/${id}`)
	const data = await response.json()
	return data?.count || 0
}
