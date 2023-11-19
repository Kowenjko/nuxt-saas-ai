import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
// import { checkSubscription } from '@/lib/useSubscription'

const { configuration, openai } = useOpenAI()

export default defineEventHandler(async (event) => {
	const { messages } = await readBody(event)
	const { userId } = event.context.auth

	console.log('userId==>', userId)
	console.log('messages==>', messages)

	if (!userId) errorHandler(401, 'Unauthorized')
	if (!configuration.apiKey) errorHandler(500, 'OpenAI API Key not configured.')

	if (!messages && messages.length > 0)
		errorHandler(400, 'Messages are required')

	const freeTrial = await checkApiLimit(userId)

	// const isPro = await checkSubscription(userId)

	// if (!freeTrial && !isPro)
	if (!freeTrial)
		errorHandler(403, 'Free trial has expired. Please upgrade to pro.')

	const response = await openai.createChatCompletion({
		max_tokens: 420,
		model: 'gpt-3.5-turbo', // or `gpt-3.5-turbo`
		temperature: 0.5,
		messages,
	})

	if (response?.data) {
		// if (!isPro)
		await incrementApiLimit(userId)

		return response.data.choices[0].message
	}

	errorHandler(500, 'Internal Error')
})
