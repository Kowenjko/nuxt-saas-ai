import Replicate from 'replicate'

export const useReplicate = () => {
	const replicate = new Replicate({
		auth: useRuntimeConfig().replicateApiKey,
	})

	const musicRiffusion =
		'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05'

	const videoAnotherjesse =
		'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351'

	return { replicate, musicRiffusion, videoAnotherjesse }
}
