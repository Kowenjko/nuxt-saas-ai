import { Configuration, OpenAIApi } from 'openai'
import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
import { checkSubscription } from '@/lib/useSubscription'

const configuration = new Configuration({
	apiKey: useRuntimeConfig().openAiApiKey,
})

const openai = new OpenAIApi(configuration)

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages, userId } = JSON.parse(body)

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

		if (!messages && messages.length > 0) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Messages are required',
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

		const response = await openai.createChatCompletion({
			max_tokens: 420,
			model: 'gpt-3.5-turbo', // or `gpt-3.5-turbo`
			temperature: 0.5,
			messages,
		})

		// if (!isPro) {
		await incrementApiLimit(userId)
		// }
		console.log(response.data.choices[0].message)
		return response.data.choices[0].message
	} catch (error) {
		console.log('[CONVERSATION_ERROR]', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Error',
		})
	}
})
