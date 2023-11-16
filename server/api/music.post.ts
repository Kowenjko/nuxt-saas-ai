import Replicate from 'replicate'
import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
import { checkSubscription } from '@/lib/useSubscription'

const replicate = new Replicate({
	auth: useRuntimeConfig().replicateApiKey,
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { prompt, userId } = JSON.parse(body)

	console.log('body===', body)

	try {
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

		// const freeTrial = await checkApiLimit(userId)
		// const isPro = await checkSubscription(userId)

		// if (!freeTrial && !isPro) {
		// 	throw createError({
		// 		status: 403,
		// 		message: 'Free trial has expired. Please upgrade to pro.',
		// 	})
		// }

		const response = await replicate.run(
			'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05',
			{
				input: {
					prompt_a: prompt,
				},
			}
		)

		// if (!isPro) {
		// 	await incrementApiLimit(userId)
		// }

		return response
	} catch (error) {
		console.log('[CONVERSATION_ERROR]', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Error',
		})
	}
})
