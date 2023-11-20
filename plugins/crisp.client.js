export default defineNuxtPlugin(() => {
	window.$crisp = []
	window.CRISP_WEBSITE_ID = '5fa55582-1ca4-4dd3-b8e9-2d0a353e1194'

	const startCrisp = () => {
		const d = document
		const s = d.createElement('script')

		s.src = 'https://client.crisp.chat/l.js'
		s.async = 1
		d.getElementsByTagName('head')[0].appendChild(s)
	}

	startCrisp()
})
