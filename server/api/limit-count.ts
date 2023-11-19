import { getApiLimitCount } from '@/lib/useApiLimit'

export default defineEventHandler(async (event) => {
	const { userId } = event.context.auth

	if (!userId) errorHandler(401, 'Unauthorized')

	const apiLimitCount = await getApiLimitCount(userId)

	return {
		apiLimitCount,
	}
})
