import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
import { checkSubscription } from '@/lib/useSubscription'

const { replicate, videoAnotherjesse } = useReplicate()

export default defineEventHandler(async (event) => {
	const { prompt } = await readBody(event)
	const { userId } = event.context.auth

	console.log('prompt==>', prompt)
	console.log('userId==>', userId)

	if (!userId) errorHandler(401, 'Unauthorized')
	if (!replicate.auth) errorHandler(500, 'OpenAI API Key not configured.')
	if (!prompt) errorHandler(400, 'Prompt are required')

	const freeTrial = await checkApiLimit(userId)
	const isPro = await checkSubscription(userId)

	if (!freeTrial && !isPro)
		errorHandler(403, 'Free trial has expired. Please upgrade to pro.')

	const response = await replicate.run(videoAnotherjesse, {
		input: { prompt },
	})
	if (response) {
		if (!isPro) await incrementApiLimit(userId)

		return response
	}

	errorHandler(500, 'Internal Error')
})
