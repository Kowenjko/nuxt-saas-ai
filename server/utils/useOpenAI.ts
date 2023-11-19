import { Configuration, ChatCompletionRequestMessage, OpenAIApi } from 'openai'

export const useOpenAI = () => {
	const configuration = new Configuration({
		apiKey: useRuntimeConfig().openAiApiKey,
	})
	const openai = new OpenAIApi(configuration)

	const instructionMessage: ChatCompletionRequestMessage = {
		role: 'system',
		content:
			'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
	}

	return { configuration, openai, instructionMessage }
}
