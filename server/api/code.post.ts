import { Configuration, ChatCompletionRequestMessage, OpenAIApi } from 'openai'
import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
import { checkSubscription } from '@/lib/useSubscription'

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

	const freeTrial = await checkApiLimit(userId)
	const isPro = await checkSubscription(userId)

	if (!freeTrial && !isPro) {
		throw createError({
			status: 403,
			message: 'Free trial has expired. Please upgrade to pro.',
		})
	}

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [instructionMessage, ...messages],
	})

	if (response) {
		if (!isPro) {
			await incrementApiLimit(userId)
		}

		return response.data.choices[0].message
	}
	throw createError({
		status: 500,
		message: 'Internal Error',
	})
})
