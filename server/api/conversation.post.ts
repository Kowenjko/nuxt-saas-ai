import { Configuration, OpenAIApi } from 'openai'

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
				status: 401,
				message: 'Unauthorized',
			})
		}

		if (!configuration.apiKey) {
			throw createError({
				status: 500,
				message: 'OpenAI API Key not configured.',
			})
		}

		if (!messages && messages.length > 0) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Messages are required',
			})
		}

		// const freeTrial = await checkApiLimit()
		// const isPro = await checkSubscription()

		// if (!freeTrial && !isPro) {
		// 	throw createError({
		// 		status: 403,
		// 		message: 'Free trial has expired. Please upgrade to pro.',
		// 	})
		// }

		const response = await openai.createChatCompletion({
			max_tokens: 2048,
			model: 'gpt-3.5-turbo', // or `gpt-3.5-turbo`
			temperature: 0.5,
			messages,
		})

		// if (!isPro) {
		// 	await incrementApiLimit()
		// }

		console.log(response.data.choices[0])

		return response.data.choices[0].message
	} catch (error) {
		console.log('[CONVERSATION_ERROR]', error)
		throw createError({
			status: 500,
			message: 'Internal Error',
		})
	}
})
