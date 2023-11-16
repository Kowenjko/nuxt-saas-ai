import { getApiLimitCount } from '@/lib/useApiLimit'

export default defineEventHandler(async (event) => {
	const userId = event?.context?.params?.userId

	if (!userId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}

	return {
		count: await getApiLimitCount(userId),
	}
})
