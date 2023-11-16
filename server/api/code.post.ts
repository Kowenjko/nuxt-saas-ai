import { Configuration, ChatCompletionRequestMessage, OpenAIApi } from 'openai'

const configuration = new Configuration({
	apiKey: useRuntimeConfig().openAiApiKey,
})

const openai = new OpenAIApi(configuration)

const instructionMessage: ChatCompletionRequestMessage = {
	role: 'system',
	content:
		'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages, userId } = JSON.parse(body)

	try {
		console.log('messages==>', messages)
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

		if (!messages) {
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
			model: 'gpt-3.5-turbo',
			messages: [instructionMessage, ...messages],
		})

		// if (!isPro) {
		// 	await incrementApiLimit()
		// }

		console.log(response.data.choices[0].message)

		return response.data.choices[0].message
	} catch (error) {
		console.log('[CONVERSATION_ERROR]', error)
		throw createError({
			status: 500,
			message: 'Internal Error',
		})
	}
})
