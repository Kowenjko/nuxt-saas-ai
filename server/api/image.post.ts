import { Configuration, OpenAIApi } from 'openai'
import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
import { checkSubscription } from '@/lib/useSubscription'

const configuration = new Configuration({
	apiKey: useRuntimeConfig().openAiApiKey,
})

const openai = new OpenAIApi(configuration)

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { values, userId } = JSON.parse(body)

	console.log('values==>', values)

	const { prompt, amount = 1, resolution = '512x512' } = values

	try {
		console.log('userId==>', userId)

		if (!userId) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
			})
		}

		if (!configuration.apiKey) {
			throw createError({
				statusCode: 500,
				statusMessage: 'OpenAI API Key not configured.',
			})
		}

		if (!prompt) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Prompt is required',
			})
		}

		if (!amount) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Amount is required',
			})
		}

		if (!resolution) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Resolution is required',
			})
		}

		const freeTrial = await checkApiLimit(userId)
		// const isPro = await checkSubscription(userId)

		// if (!freeTrial && !isPro) {
		if (!freeTrial) {
			throw createError({
				statusCode: 403,
				statusMessage: 'Free trial has expired. Please upgrade to pro.',
			})
		}

		const response = await openai.createImage({
			prompt,
			n: parseInt(amount, 10),
			size: resolution,
		})

		// if (!isPro) {
		await incrementApiLimit(userId)
		// }
		console.log(response.data.data)
		return response.data.data
	} catch (error) {
		console.log('[CONVERSATION_ERROR]', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Error',
		})
	}
})
