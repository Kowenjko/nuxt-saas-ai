import { incrementApiLimit, checkApiLimit } from '@/lib/useApiLimit'
// import { checkSubscription } from '@/lib/useSubscription'

const { configuration, openai } = useOpenAI()

export default defineEventHandler(async (event) => {
	const { form } = await readBody(event)
	const { userId } = event.context.auth
	const { prompt, amount = 1, resolution = '512x512' } = form

	console.log('userId==>', userId)
	console.log('values==>', form)

	if (!userId) errorHandler(401, 'Unauthorized')
	if (!configuration.apiKey) errorHandler(500, 'OpenAI API Key not configured.')
	if (!prompt) errorHandler(400, 'Prompt are required')

	const freeTrial = await checkApiLimit(userId)
	// const isPro = await checkSubscription(userId)

	// if (!freeTrial && !isPro)
	if (!freeTrial)
		errorHandler(403, 'Free trial has expired. Please upgrade to pro.')

	const response = await openai.createImage({
		prompt,
		n: parseInt(amount, 10),
		size: resolution,
	})

	if (response?.data) {
		// if (!isPro)
		await incrementApiLimit(userId)

		return response.data.data
	}

	errorHandler(500, 'Internal Error')
})
