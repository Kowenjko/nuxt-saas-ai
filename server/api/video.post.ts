import Replicate from 'replicate'
import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
import { checkSubscription } from '@/lib/useSubscription'

const replicate = new Replicate({
	auth: useRuntimeConfig().replicateApiKey,
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { prompt, userId } = JSON.parse(body)

	console.log('prompt==>', prompt)
	console.log('userId==>', userId)

	if (!userId) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}

	if (!prompt) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Prompt is required',
		})
	}

	const freeTrial = await checkApiLimit(userId)
	const isPro = await checkSubscription(userId)

	if (!freeTrial && !isPro) {
		// if (!freeTrial) {
		throw createError({
			status: 403,
			message: 'Free trial has expired. Please upgrade to pro.',
		})
	}

	const response = await replicate.run(
		'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
		{
			input: {
				prompt,
			},
		}
	)
	if (response) {
		if (!isPro) {
			await incrementApiLimit(userId)
		}

		// console.log(response)

		return response
	}

	throw createError({
		statusCode: 500,
		statusMessage: 'Internal Error',
	})
})
