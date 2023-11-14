import { Configuration, OpenAIApi } from 'openai'

const config = useRuntimeConfig()

const configuration = new Configuration({
	apiKey: config.openAiApiKey,
})
const openai = new OpenAIApi(configuration)

export const getChatStream = async ({ messages }) => {
	const response = await openai.createChatCompletion(
		{
			max_tokens: 2048,
			model: 'gpt-4', // or `gpt-3.5-turbo`
			temperature: 0.5,
			messages,
			stream: true,
		},
		{ responseType: 'stream' }
	)

	return response.data
}
