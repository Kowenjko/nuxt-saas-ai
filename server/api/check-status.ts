import { checkSubscription } from '@/lib/useSubscription'

export default defineEventHandler(async (event) => {
	const { userId } = event.context.auth

	if (!userId) errorHandler(401, 'Unauthorized')

	const isPro = await checkSubscription(userId as string)

	return { isPro }
})
